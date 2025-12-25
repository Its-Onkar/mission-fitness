import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendCompletionEmail = async (user, type) => {
  const subject = type === 'workout' ? '🏋️ Workout Completed!' : '🥗 Diet Goal Achieved!';
  const html = `
    <h2>Great Job! 🎉</h2>
    <p>Hi ${user.userName},</p>
    <p>Congratulations on completing your ${type} for today!</p>
    <p>Keep up the excellent work. Consistency is the key to success!</p>
    <p>Tomorrow's another opportunity to crush your goals! 💪</p>
    <a href="${process.env.CLIENT_URL}/main-dashboard" style="background: #EE6D0F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
  `;
  
  await sendEmail(user.email, subject, html);
};
