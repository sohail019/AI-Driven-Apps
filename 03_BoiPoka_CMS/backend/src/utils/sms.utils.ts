import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// if (!accountSid || !authToken || !twilioPhoneNumber) {
//   throw new Error("Twilio credentials are not properly configured");
// }

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
  try {
    // await client.messages.create({
    //   body,
    //   to,
    //   from: twilioPhoneNumber,
    // });
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS");
  }
};
