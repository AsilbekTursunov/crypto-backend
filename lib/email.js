import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export function sendMessage(to, name, code, type = 'forget') {
  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  transporter.sendMail({
    from: 'Maddison Foo Koch 👻', // sender address
    to, // list of receivers
    subject: "BookWorm forget password verification", // Subject line
    html: 
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forget Password Email Verification</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; padding: 20px 0; }
        .header h1 { color: #333333; font-size: 24px; margin: 0; }
        .content { padding: 20px; text-align: center; }
        .content p { color: #666666; font-size: 16px; line-height: 1.5; }
        .code { display: inline-block; padding: 10px 20px; background-color: #f0f0f0; color: #333333; font-size: 20px; font-weight: bold; letter-spacing: 2px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Hello, ${name}!</p>
          <p>Thank you for signing up. Please use the following code to verify your email address:</p>
          <div class="code">${code}</div>
          <p>Enter this code in the app to complete your registration.</p>
        </div>
        <div class="footer">
          <p>If you didn’t request this email, please ignore it.</p>
          <p>© 2025 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
  });
}
