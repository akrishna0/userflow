const nodemailer = require('nodemailer');

const mailHelper = async (options)=>{

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASSW,
    },
  });

  const messageStructure = {
      from: 'akashkrishna11111@gmail.com',
      to: options.email,
      subject: options.subject,
      text: options.message
  }
  
  // send mail with defined transport object
    await transporter.sendMail(messageStructure);

}

module.exports = mailHelper;

