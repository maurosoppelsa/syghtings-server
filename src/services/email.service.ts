class EmailService {
  public static async sendRegistrationEmail(email, userId, token) {
    console.log(`Sending registration email to ${email} with token ${token}`);
    console.log('link: http://localhost:3000/users/verify/' + userId + '/' + token);
  }
  public static async sendResetEmail(email, userId, token) {
    console.log(`Sending reset email to ${email} with token ${token}`);
    console.log('link: http://localhost:3000/users/auth-reset-password/' + userId + '/' + token);
  }
}

export default EmailService;
