import nodemailer from 'nodemailer';

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

if (!email || !pass) {
  console.error('Email or password not found in environment variables. Please check your .env.local file.');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass,
  },
});

export const mailOptions = {
  from: email,
  to: '', // This will be set dynamically
};
