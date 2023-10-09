const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { NotFoundError } = require('../common/NotFoundError');

dotenv.config({ path: '.env' });

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const message = {
      from: 'RE BIRTH:',
      to,
      subject,
      text,
    };
    const info = await transport.sendMail(message);
    return info;
  } catch (err) {
    throw new NotFoundError('이메일을 보낼 수 없습니다.');
  }
};

module.exports = { sendMail };
