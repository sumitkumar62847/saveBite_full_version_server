import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();


const SendMobileOtp = async (mobileNo , otpclient) => {
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  try {
    await twilioClient.messages.create({
      body: `Your OTP is ${otpclient}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobileNo}`
    });
  } catch (error) {
      console.log('Failed to send OTP',error);
  }
};

export default SendMobileOtp;