import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure transporter
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const transporter = createTransporter();

/**
 * Send customer email verification link
 */
export const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${CLIENT_URL}/verify-email/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0e11; color: #e1e3e8; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background-color: #14161b; border: 1px solid #262a33; border-radius: 8px; padding: 40px; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #ffffff; text-align: center; margin-bottom: 30px; border-bottom: 1px solid #262a33; padding-bottom: 20px; }
        .heading { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
        .text { font-size: 14px; line-height: 1.6; color: #9499a8; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #d4a373; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 4px; text-align: center; }
        .footer { font-size: 11px; color: #5a5f70; margin-top: 36px; border-top: 1px solid #262a33; padding-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">PENGUIN // ATELIER</div>
        <div class="heading">Verify Your Email</div>
        <p class="text">Welcome to Penguin. Please verify your email address to unlock seamless order tracking and expedited checkout.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" class="btn" target="_blank">Verify Email Address</a>
        </div>
        <p class="text" style="font-size: 12px;">If button doesn't work, copy and paste this link into your browser:<br><a href="${verifyUrl}" style="color: #d4a373; word-break: break-all;">${verifyUrl}</a></p>
        <div class="footer">This verification link will expire in 24 hours. If you did not create an account with Penguin, please disregard this email.</div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Penguin Atelier" <noreply@penguin-mens.com>',
        to: toEmail,
        subject: 'Verify your Penguin account',
        html,
      });
      console.log(`✉️ Verification email sent to ${toEmail}`);
    } catch (err) {
      console.error('⚠️ Failed to send verification email via SMTP:', err.message);
    }
  } else {
    console.log('\n================ EMAIL VERIFICATION (DEV LOG) ================');
    console.log(`To: ${toEmail}`);
    console.log(`Verify Link: ${verifyUrl}`);
    console.log('===============================================================\n');
  }
};

/**
 * Send password reset link
 */
export const sendPasswordResetEmail = async (toEmail, token) => {
  const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0e11; color: #e1e3e8; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background-color: #14161b; border: 1px solid #262a33; border-radius: 8px; padding: 40px; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #ffffff; text-align: center; margin-bottom: 30px; border-bottom: 1px solid #262a33; padding-bottom: 20px; }
        .heading { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
        .text { font-size: 14px; line-height: 1.6; color: #9499a8; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #d4a373; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 4px; text-align: center; }
        .footer { font-size: 11px; color: #5a5f70; margin-top: 36px; border-top: 1px solid #262a33; padding-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">PENGUIN // ATELIER</div>
        <div class="heading">Reset Your Password</div>
        <p class="text">We received a request to reset the password for your Penguin customer account. Click below to choose a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
        </div>
        <p class="text" style="font-size: 12px;">If button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #d4a373; word-break: break-all;">${resetUrl}</a></p>
        <div class="footer">This password reset link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Penguin Atelier" <noreply@penguin-mens.com>',
        to: toEmail,
        subject: 'Reset your Penguin password',
        html,
      });
      console.log(`✉️ Password reset email sent to ${toEmail}`);
    } catch (err) {
      console.error('⚠️ Failed to send reset email via SMTP:', err.message);
    }
  } else {
    console.log('\n================ PASSWORD RESET (DEV LOG) ================');
    console.log(`To: ${toEmail}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('==========================================================\n');
  }
};
