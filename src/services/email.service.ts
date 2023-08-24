import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SERVER_EMAIL_ACCOUNT,
        pass: process.env.SERVER_EMAIL_PASSWORD,
      },
    });
  }

  public async sendRegistrationEmail(email, userId, token) {
    const mailOptions = {
      from: process.env.SERVER_EMAIL_ACCOUNT,
      to: email,
      subject: 'Registration Email',
      text: `Click the link to verify your account: http://localhost:3000/users/verify/${userId}/${token}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Registration email sent to ${email}`);
    } catch (error) {
      console.error('Error sending registration email:', error);
    }
  }

  public async sendResetEmail(email, userId, token) {
    const mailOptions = {
      from: process.env.SERVER_EMAIL_ACCOUNT,
      to: email,
      subject: 'Password Reset Email',
      text: `Click the link to reset your password: http://localhost:3000/users/auth-reset-password/${userId}/${token}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  }
}

export default EmailService;
