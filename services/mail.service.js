const nodeMailer = require("nodemailer");

class MailService {
  constructor() {
    this.tranporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(email, activationLink) {
    const info = await this.tranporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Activate your account",
      text: `Click on the following link to activate your account: ${activationLink}`,
    });

    return info;
  }
}

module.exports = new MailService();
