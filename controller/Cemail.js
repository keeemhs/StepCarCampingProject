const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail', // 사용하고자 하는 서비스
  host: 'smtp.gmail.com', // host를 gmail로 설정
  auth: {
    user: process.env.GMAIL_USER, // 환경 변수 사용
    pass: process.env.GMAIL_PASS, // 환경 변수 사용
  }
})

// //이메일 폼 표시
const showEmailForm = (req, res) => {
  res.render('email');
}

const sendEmail = async (req, res) => {
  try {
    const {
      to,
      subject,
      message
    } = req.body;
    const mailOptions = {
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: '이메일이 전송되었습니다.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: '이메일 전송 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  showEmailForm,
  sendEmail
};