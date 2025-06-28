import nodemailer from 'nodemailer';

export const sendNewUserEmail = async (email, password) => {

        console.log("Password email function called");
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
       user: process.env.EMAIL, // Corrected: remove single quotes to evaluate the variable
       pass: process.env.EMAIL_APP_PASSWORD, // Corrected: remove single quotes to evaluate the variable
    },
      tls: {
    // This disables certificate validation (for development only)
    rejectUnauthorized: false,
  },
  });

  const mailOptions = {
    from: '"Shikayat Seva" <your_email@gmail.com>',
    to: email,
    subject: 'Your Password for Shikayat Seva',
    html: `<p>Your  password is <b>${password}</b> for accound login.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("password email sent");
  } catch (error) {
    console.error("Error sending password email:", error);
    throw error;
  }
};
