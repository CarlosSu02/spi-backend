import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from '../dto/email.dto';
import { SentMessageInfo } from 'nodemailer';

interface ISendMail {
  to: string;
  message?: string;
  subject?: string;
  html?: string;
}

const TEMPLATE = (link: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cambio de contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      max-width: 500px;
      margin: auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 20px;
      margin-top: 20px;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hola,</h2>
    <p>Recibimos una solicitud para cambiar tu contraseña. Si tú no solicitaste esto, puedes ignorar este mensaje.</p>
    <p>Para cambiar tu contraseña, haz clic en el siguiente botón:</p>
    
    <a href="${link}" class="button">Cambiar contraseña</a>

    <p class="footer">Este enlace expirará en 1 hora por seguridad.</p>
  </div>
</body>
</html>
`;

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
