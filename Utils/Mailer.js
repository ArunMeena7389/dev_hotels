const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Email Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering! Please use the following OTP to complete your signup process:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; color: #4CAF50;">
            ${otp}
          </div>
          <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="margin-top: 30px;">Regards,<br/>Team AM</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
};