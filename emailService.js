function sendEmail(email, subject, message) {
    console.log(`Email sent to ${email}: ${subject} - ${message}`);
}

module.exports = { sendEmail };
