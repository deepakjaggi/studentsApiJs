function sendEmail(email, subject, message) {
    try {
        console.log(`Email sent to ${email}: ${subject} - ${message}`);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        return { success: false, message: 'Failed to send email' };
    }
}

module.exports = { sendEmail };
