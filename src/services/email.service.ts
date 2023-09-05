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

  public async sendRegistrationEmail(email, code) {
    const mailOptions = {
      from: process.env.SERVER_EMAIL_ACCOUNT,
      to: email,
      subject: 'Registration Email',
      text: `this is you code: ${code}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending registration email:', error);
    }
  }

  public async sendResetEmail(email, code) {
    const mailOptions = {
      from: process.env.SERVER_EMAIL_ACCOUNT,
      to: email,
      subject: 'Password Reset Email',
      text: `this is you code: ${code}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  }
}

export default EmailService;
