import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { TEMPLATE } from '../constants';

interface ISendMail {
  to: string;
  message?: string;
  subject?: string;
  html?: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async test() {
    return await this.mailerService.verifyAllTransporters();
  }

  async sendMail({
    to,
    message = 'Email service SPI.',
    subject = `How to Send Emails with Nodemailer`,
    html,
  }: ISendMail): Promise<SentMessageInfo> {
    const email = process.env.EMAIL;

    if (!email) throw new Error('Environment variable EMAIL is not set!');

    return await this.mailerService.sendMail({
      from: `Desarrollo SPI <${email}>`,
      to,
      subject,
      text: message,
      html,
    });
  }

  async sendResetPassword(to: string, token: string): Promise<SentMessageInfo> {
    const resetPasswordLink = `${process.env.FE_URL}/auth/recuperar?token=${token}`;

    return await this.sendMail({
      to,
      subject: 'Solicitud de cambio de contraseña.',
      html: TEMPLATE(resetPasswordLink),
    });
  }
}
