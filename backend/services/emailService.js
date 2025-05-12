import nodemailer from "nodemailer";

const mailSender = async (email, subject, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Quick-Kart" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: body,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default mailSender;
