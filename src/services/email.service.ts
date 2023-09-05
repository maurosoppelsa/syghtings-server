import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'l.mauro.soppelsa@gmail.com',
        pass: 'lsfsuorlyohemhng',
      },
    });
  }

  public async sendRegistrationEmail(email, code) {
    const mailOptions = {
      from: 'l.mauro.soppelsa@gmail.com',
      to: email,
      subject: 'Registration Email',
      text: `this is you code: ${code}`,
    };

    try {
      //await this.transporter.sendMail(mailOptions);
      console.log(`email code: ${code}`);
      console.log(`Registration email sent to ${email}`);
    } catch (error) {
      console.error('Error sending registration email:', error);
    }
  }

  public async sendResetEmail(email, code) {
    const mailOptions = {
      from: 'l.mauro.soppelsa@gmail.com',
      to: email,
      subject: 'Password Reset Email',
      text: `this is you code: ${code}`,
    };

    try {
      //await this.transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${email}`);
      console.log(`email code: ${code}`);
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  }
}

export default EmailService;
