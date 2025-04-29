import express from "express";
import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { UserSubscription } from "../models/UserSubscription";
import { UserSubscriptionFeatures } from "../models/UserSubscriptionFeatures";
import { SubscriptionHistory } from "../models/SubscriptionHistory";
import { FreeFeatures } from "../models/FreeFeatures";
import mongoose from "mongoose";

const router = express.Router();

// Get all subscription plans
router.get("/", async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionPlan.find();
    res.json(subscriptionPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific subscription plan
router.get("/:id", async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);
    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.json(subscriptionPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subscription plan
router.post("/", async (req, res) => {
  try {
    const subscriptionPlan = new SubscriptionPlan(req.body);
    await subscriptionPlan.save();
    res.status(201).json(subscriptionPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a subscription plan
router.put("/:id", async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.json(subscriptionPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a subscription plan
router.delete("/:id", async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findByIdAndDelete(
      req.params.id
    );
    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }
    res.json({ message: "Subscription plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subscribe a user to a plan
router.post("/subscribe", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, subscriptionPlanId } = req.body;

    // Get the subscription plan
    const plan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    // Calculate end date based on plan duration
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    // Create user subscription
    const userSubscription = new UserSubscription({
      userId,
      subscriptionPlanId,
      startDate: new Date(),
      endDate,
      status: "active",
      autoRenew: true,
    });
    await userSubscription.save({ session });

    // Get free features
    const freeFeatures = await FreeFeatures.find({ isActive: true });
    const freeFeatureNames = freeFeatures.map((f) => f.name);

    // Create user subscription features
    const userSubscriptionFeatures = new UserSubscriptionFeatures({
      userId,
      subscriptionPlanId,
      features: [...plan.features, ...freeFeatureNames],
      isFree: false,
    });
    await userSubscriptionFeatures.save({ session });

    // Create subscription history
    const subscriptionHistory = new SubscriptionHistory({
      userId,
      subscriptionPlanId,
      changeType: "plan_change",
      newPlanId: subscriptionPlanId,
      newFeatures: [...plan.features, ...freeFeatureNames],
      newStatus: "active",
    });
    await subscriptionHistory.save({ session });

    await session.commitTransaction();
    res.status(201).json({ userSubscription, userSubscriptionFeatures });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Get user's active subscription
router.get("/user/:userId", async (req, res) => {
  try {
    const userSubscription = await UserSubscription.findOne({
      userId: req.params.userId,
      status: "active",
    }).populate("subscriptionPlanId");

    if (!userSubscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    const userFeatures = await UserSubscriptionFeatures.findOne({
      userId: req.params.userId,
      subscriptionPlanId: userSubscription.subscriptionPlanId,
    });

    res.json({ subscription: userSubscription, features: userFeatures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user subscription
router.put("/update", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, newPlanId, features, status } = req.body;

    const currentSubscription = await UserSubscription.findOne({
      userId,
      status: "active",
    });

    if (!currentSubscription) {
      throw new Error("No active subscription found");
    }

    // Update subscription if plan changed
    if (
      newPlanId &&
      newPlanId !== currentSubscription.subscriptionPlanId.toString()
    ) {
      const newPlan = await SubscriptionPlan.findById(newPlanId);
      if (!newPlan) {
        throw new Error("New subscription plan not found");
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + newPlan.durationMonths);

      currentSubscription.subscriptionPlanId = newPlanId;
      currentSubscription.endDate = endDate;
      await currentSubscription.save({ session });

      // Create subscription history for plan change
      const subscriptionHistory = new SubscriptionHistory({
        userId,
        subscriptionPlanId: newPlanId,
        changeType: "plan_change",
        previousPlanId: currentSubscription.subscriptionPlanId,
        newPlanId,
        previousFeatures: (
          await UserSubscriptionFeatures.findOne({
            userId,
            subscriptionPlanId: currentSubscription.subscriptionPlanId,
          })
        )?.features,
        newFeatures: newPlan.features,
      });
      await subscriptionHistory.save({ session });
    }

    // Update features if changed
    if (features) {
      const currentFeatures = await UserSubscriptionFeatures.findOne({
        userId,
        subscriptionPlanId: currentSubscription.subscriptionPlanId,
      });

      if (currentFeatures) {
        currentFeatures.features = features;
        await currentFeatures.save({ session });

        // Create subscription history for feature change
        const subscriptionHistory = new SubscriptionHistory({
          userId,
          subscriptionPlanId: currentSubscription.subscriptionPlanId,
          changeType: "feature_change",
          previousFeatures: currentFeatures.features,
          newFeatures: features,
        });
        await subscriptionHistory.save({ session });
      }
    }

    // Update status if changed
    if (status && status !== currentSubscription.status) {
      const previousStatus = currentSubscription.status;
      currentSubscription.status = status;
      await currentSubscription.save({ session });

      // Create subscription history for status change
      const subscriptionHistory = new SubscriptionHistory({
        userId,
        subscriptionPlanId: currentSubscription.subscriptionPlanId,
        changeType: "status_change",
        previousStatus,
        newStatus: status,
      });
      await subscriptionHistory.save({ session });
    }

    await session.commitTransaction();
    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Get user's subscription history
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await SubscriptionHistory.find({
      userId: req.params.userId,
    })
      .populate("subscriptionPlanId")
      .populate("previousPlanId")
      .populate("newPlanId")
      .sort({ changeDate: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all free features
router.get("/free-features", async (req, res) => {
  try {
    const freeFeatures = await FreeFeatures.find({ isActive: true });
    res.json(freeFeatures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a free feature
router.post("/free-features", async (req, res) => {
  try {
    const freeFeature = new FreeFeatures(req.body);
    await freeFeature.save();
    res.status(201).json(freeFeature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a free feature
router.put("/free-features/:id", async (req, res) => {
  try {
    const freeFeature = await FreeFeatures.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!freeFeature) {
      return res.status(404).json({ message: "Free feature not found" });
    }
    res.json(freeFeature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a free feature
router.delete("/free-features/:id", async (req, res) => {
  try {
    const freeFeature = await FreeFeatures.findByIdAndDelete(req.params.id);
    if (!freeFeature) {
      return res.status(404).json({ message: "Free feature not found" });
    }
    res.json({ message: "Free feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
