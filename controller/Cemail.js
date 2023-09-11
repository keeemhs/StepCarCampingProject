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

// // 인증번호 생성 + 이메일 변수 가져오기
// // 인증번호 메일 보내는 양식
// const sendEmail2 = async (req, res) => {
//   try {
//     const message = req.body.message;
//     const email = req.body.email;
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const mailOptions2 = {
//       to: email,
//       text: `${message}인증 코드: ${verificationCode}`,
//     };

//     await transporter.sendMail(mailOptions2);
//     res.status(200).json({
//       message: '인증번호가 이메일로 전송되었습니다.'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: '이메일 전송 중 오류가 발생했습니다.'
//     });
//   }
// };

// exports.verifyCode = async (req, res) => {
//   const email = req.body.email;
//   const user = await User.findOne({
//     where: {
//       email
//     }
//   });

//   if (user && user.verificationCode === req.body.verificationCode) {
//     res.send('인증 성공');
//   } else {
//     res.send('인증 실패');
//   }
// };

module.exports = {
  showEmailForm,
  sendEmail,
  // sendEmail2
};