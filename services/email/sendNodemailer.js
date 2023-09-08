const nodemailer = require('nodemailer');

const {META_PASSWORD} = process.env

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'valeria.workit@meta.ua',
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendNodemailer = (data) =>{
    const emailOptions = {
        ...data,
        from: 'valeria.workit@meta.ua',
      };

      transporter
      .sendMail(emailOptions)
      .then(info => console.log(info))
      .catch(err => console.log(err));
      return true;
}

module.exports = sendNodemailer;



