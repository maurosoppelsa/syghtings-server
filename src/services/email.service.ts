import fs from 'fs';
import { EMAIL_REPORT_TEXT, SERVER_EMAIL_ACCOUNT, SERVER_EMAIL_HOST, SERVER_EMAIL_PASSWORD, SERVER_EMAIL_PORT } from '@/config';
import { logger } from '@/utils/logger';
import nodemailer from 'nodemailer';
import { EmailType } from '@/interfaces/email.interface';
import { EMAIL_SUBJECTS, EmailTypes } from '@/constants';
import { Readable } from 'node:stream';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SERVER_EMAIL_HOST,
      port: SERVER_EMAIL_PORT,
      secure: true,
      auth: {
        user: SERVER_EMAIL_ACCOUNT,
        pass: SERVER_EMAIL_PASSWORD,
      },
    });
  }

  private getSubject(type: EmailType): string {
    return EMAIL_SUBJECTS[type];
  }

  private getEmailTemplate(code, type) {
    const templates_location = './src/services/email-templates';
    let emailTemplate: string;
    if (type === EmailTypes.RESET_PASSWORD) {
      emailTemplate = fs.readFileSync(`${templates_location}/forgot-password_es.html`, 'utf8');
    } else if (type === EmailTypes.REGISTRATION) {
      emailTemplate = fs.readFileSync(`${templates_location}/registration_es.html`, 'utf8');
    } else {
      emailTemplate = fs.readFileSync(`${templates_location}/resend_es.html`, 'utf8');
    }
    return emailTemplate.replace('{{code}}', code);
  }

  public async sendVerifyEmail(email: string, code: string, type: EmailType) {
    const mailOptions = {
      from: process.env.SERVER_EMAIL_ACCOUNT,
      to: email,
      subject: this.getSubject(type),
      //text: `This is your code: ${code}`, // uncomment for testing purposes
      html: this.getEmailTemplate(code, type),
    };

    try {
      //logger.info(mailOptions.text); // uncomment for testing purposes
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error('Error sending reset email:', error);
    }
  }

  public async sendSightsDbReport(csvContent: string, filename: string) {
    const type: EmailType = EmailTypes.REPORT as EmailType;
    const mailOptions = {
      from: SERVER_EMAIL_ACCOUNT,
      to: SERVER_EMAIL_ACCOUNT,
      subject: this.getSubject(type),
      text: EMAIL_REPORT_TEXT,
      attachments: [
        {
          filename: filename,
          content: new Readable({
            read() {
              this.push(csvContent);
              this.push(null);
            },
          }),
          contentType: 'text/csv',
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info('Internal email with CSV attachment sent successfully.');
    } catch (error) {
      logger.error('Error sending internal email with CSV attachment:', error);
    }
  }
}

export default EmailService;
