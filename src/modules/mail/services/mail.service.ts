import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from '../dto/email.dto';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async test() {
    return await this.mailerService.verifyAllTransporters();
  }

  async sendMail(
    dto: EmailDto,
    message: string = 'Email service SPI.',
    subject: string = `How to Send Emails with Nodemailer`,
  ): Promise<SentMessageInfo> {
    const { email } = dto;

    return await this.mailerService.sendMail({
      from: `Desarrollo SPI <${process.env.EMAIL}>`,
      to: email,
      subject,
      text: message,
    });
  }
}
