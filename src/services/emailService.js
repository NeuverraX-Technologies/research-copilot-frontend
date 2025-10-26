import emailjs from '@emailjs/browser';

// Initialize with your EmailJS credentials
emailjs.init('YOUR_PUBLIC_KEY');

export const sendPaymentNotification = async (paymentData) => {
  const templateParams = {
    to_email: 'info@neuverrax.com',
    user_name: paymentData.userName,
    user_email: paymentData.userEmail,
    plan: paymentData.plan,
    amount: paymentData.amount,
    payment_id: paymentData.paymentId,
    date: new Date().toLocaleString()
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams
    );
    console.log('✅ Payment notification sent');
  } catch (error) {
    console.error('❌ Email notification failed:', error);
  }
};

export const sendSignupNotification = async (userData) => {
  const templateParams = {
    to_email: 'info@neuverrax.com',
    user_name: userData.displayName,
    user_email: userData.email,
    signup_date: new Date().toLocaleString()
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_SIGNUP_TEMPLATE_ID',
      templateParams
    );
    console.log('✅ Signup notification sent');
  } catch (error) {
    console.error('❌ Email notification failed:', error);
  }
};