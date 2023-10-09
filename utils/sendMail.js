const nodemailer = require('nodemailer');
const { NotFoundError } = require('../common/NotFoundError');

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_OAUTH_USER,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const message = {
      from: 'Upcycling',
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
