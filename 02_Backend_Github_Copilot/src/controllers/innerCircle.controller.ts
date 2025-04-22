import { Request, Response } from "express";
import { InnerCircle } from "../models/innerCircle.model";
import { User } from "../models/user.model";
import { sendSMS } from "../utils/sms.utils";
import { withTransaction } from "../utils/transaction.utils";

export const sendInvitation = async (req: Request, res: Response) => {
  try {
    const { invites } = req.body;
    const senderId = req.user._id;

    if (!Array.isArray(invites) || invites.length === 0) {
      throw new Error("At least one invitation must be sent");
    }

    await withTransaction(async (session) => {
      for (const invite of invites) {
        const { receiverName, receiverMobileNumber, libraryIds } = invite;

        if (!Array.isArray(libraryIds) || libraryIds.length === 0) {
          throw new Error(
            "At least one library must be selected for each invitation"
          );
        }

        // Check if user exists with this mobile number
        const existingUser = await User.findOne({
          mobile: receiverMobileNumber,
        }).session(session);
        const receiverId = existingUser?._id || receiverMobileNumber;

        // Create individual invitations for each library
        const invitationPromises = libraryIds.map(async (libraryId) => {
          // Check for existing invitation
          const existingInvite = await InnerCircle.findOne({
            senderId,
            receiverId,
            libraryId,
            status: "pending",
          }).session(session);

          if (existingInvite) {
            // throw new Error(`Invitation already exists for library ${libraryId}`);
            return true;
          }

          // Create new invitation
          return new InnerCircle({
            senderId,
            receiverId,
            receiverName,
            libraryId,
          }).save({ session });
        });

        await Promise.all(invitationPromises);

        // Send SMS invitation
        await sendSMS(
          receiverMobileNumber,
          `You have been invited to view ${libraryIds.length} library/libraries by ${req.user.firstName}. Please check your app to accept or reject the invitation.`
        );
      }
    });

    res.json({ message: "Invitations sent successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const respondToInvitation = async (req: Request, res: Response) => {
  try {
    const { invitationId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    await withTransaction(async (session) => {
      const invitation = await InnerCircle.findOne({
        _id: invitationId,
        receiverId: userId,
        status: "pending",
      }).session(session);

      if (!invitation) {
        throw new Error("Invitation not found or already responded");
      }

      if (status === "rejected") {
        await invitation.deleteOne({ session });
      } else {
        invitation.status = status;
        await invitation.save({ session });
      }
    });

    res.json({ message: `Invitation ${status} successfully` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getInvitations = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const userId = req.user._id;

    // Get invitations where user is receiver
    const receivedInvitations = await InnerCircle.aggregate([
      {
        $match: {
          receiverId: userId,
          ...(status ? { status } : {}),
        },
      },
      {
        $lookup: {
          from: "userlibraries",
          localField: "libraryId",
          foreignField: "_id",
          as: "library",
        },
      },
      {
        $unwind: {
          path: "$library",
          preserveNullAndEmptyArrays: true, // in case library is missing
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $group: {
          _id: "$senderId",
          sender: { $first: "$sender" },
          invitations: {
            $push: {
              _id: "$_id",
              libraryId: "$libraryId",
              libraryName: "$library.name",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          senderId: "$sender._id",
          firstName: "$sender.firstName",
          lastName: "$sender.lastName",
          invitations: 1,
        },
      },
    ]);

    // Get invitations where user is sender
    const sentInvitations = await InnerCircle.aggregate([
      {
        $match: {
          senderId: userId,
          ...(status ? { status } : {}),
        },
      },
      {
        $lookup: {
          from: "userlibraries",
          localField: "libraryId",
          foreignField: "_id",
          as: "library",
        },
      },
      {
        $unwind: {
          path: "$library",
          preserveNullAndEmptyArrays: true, // in case library is missing
        },
      },
      {
        $group: {
          _id: "$receiverId",
          receiverName: { $first: "$receiverName" },
          invitations: {
            $push: {
              _id: "$_id",
              libraryId: "$libraryId",
              libraryName: "$library.name",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
    ]);

    res.json({
      received: receivedInvitations,
      sent: sentInvitations,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const followers = await InnerCircle.aggregate([
      {
        $match: {
          senderId: userId,
          status: "accepted",
        },
      },
      {
        $lookup: {
          from: "userlibraries",
          localField: "libraryId",
          foreignField: "_id",
          as: "library",
        },
      },
      {
        $unwind: {
          path: "$library",
          preserveNullAndEmptyArrays: true, // in case library is missing
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: {
          path: "$receiver",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$receiverId",
          name: {
            $first: {
              $ifNull: ["$receiver.firstName", "$receiverName"],
            },
          },
          libraries: {
            $push: {
              libraryId: "$libraryId",
              libraryName: "$library.name",
              inviteId: "$_id",
            },
          },
        },
      },
    ]);

    res.json(followers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Function to resolve pending invitations for a newly registered user
export const resolvePendingInvitations = async (
  userId: string,
  mobile: string,
  firstName: string
) => {
  try {
    await withTransaction(async (session) => {
      // Find all pending invitations where the mobile number was used as receiverId
      const pendingInvitations = await InnerCircle.find({
        receiverId: mobile,
        status: "pending",
      }).session(session);

      // Update each invitation with the new userId and receiverName
      const updatePromises = pendingInvitations.map((invitation) =>
        InnerCircle.updateOne(
          { _id: invitation._id },
          {
            $set: {
              receiverId: userId,
              receiverName: firstName,
            },
          }
        ).session(session)
      );

      await Promise.all(updatePromises);
    });
  } catch (error) {
    console.error("Error resolving pending invitations:", error);
    throw error;
  }
};

export const getSentInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const sentInvitations = await InnerCircle.aggregate([
      {
        $match: {
          senderId: userId,
          status: { $ne: "accepted" }, // Exclude accepted invitations
        },
      },
      {
        $lookup: {
          from: "userlibraries",
          localField: "libraryId",
          foreignField: "_id",
          as: "library",
        },
      },
      {
        $unwind: {
          path: "$library",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$receiverId",
          receiverName: { $first: "$receiverName" },
          invitations: {
            $push: {
              _id: "$_id",
              libraryId: "$libraryId",
              libraryName: "$library.name",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          receiverId: "$_id",
          receiverName: 1,
          invitations: 1,
        },
      },
    ]);

    res.json(sentInvitations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReceivedInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const receivedInvitations = await InnerCircle.aggregate([
      {
        $match: {
          receiverId: userId,
          status: { $ne: "accepted" }, // Exclude accepted invitations
        },
      },
      {
        $lookup: {
          from: "userlibraries",
          localField: "libraryId",
          foreignField: "_id",
          as: "library",
        },
      },
      {
        $unwind: {
          path: "$library",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$senderId",
          sender: { $first: "$sender" },
          invitations: {
            $push: {
              _id: "$_id",
              libraryId: "$libraryId",
              libraryName: "$library.name",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          senderId: "$sender._id",
          firstName: "$sender.firstName",
          lastName: "$sender.lastName",
          invitations: 1,
        },
      },
    ]);

    res.json(receivedInvitations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
