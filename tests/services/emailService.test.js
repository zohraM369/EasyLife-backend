const chai = require("chai");
const expect = chai.expect;
const emailService = require("../../services/emailServices");

describe("Email Service Tests", () => {
  describe("sendLandingEmail", () => {
    it("should send landing email with user data", async () => {
      const data = {
        email: "chadly_zohra@hotmail.com",
        username: "Test User",
        message: "Hello, this is a test message",
        phone: "12345678",
      };

      const result = await emailService.sendLandingEmail(data);

      // Assertions for sendLandingEmail
      expect(result).to.be.true;
      console.log(result);
           expect(result.length).to.equal(1);
      expect(result[0].from).to.equal(data.email);
      expect(result[0].to).to.equal("chadly_zohra@hotmail.com");
      expect(result[0].subject).to.include(`Message de ${data.username}`);
      expect(result[0].html).to.include(data.message);
      expect(result[0].html).to.include(`Numéro Tel: +216 ${data.phone}`);
    });
  });

  describe("sendVerificationCode", () => {
    it("should send verification code email", async () => {
      const data = {
        email: "testuser@gmail.com",
        code: "123456",
      };

      const result = await emailService.sendVerificationCode(data);

      // Assertions for sendVerificationCode
      expect(result).to.be.true;

      // Check if the email was "sent"
      const sentMail = transporter.sentMail();
      expect(sentMail.length).to.equal(1);
      expect(sentMail[0].from).to.equal("admin@gmail.com");
      expect(sentMail[0].to).to.equal(data.email);
      expect(sentMail[0].subject).to.equal("Alert");
      expect(sentMail[0].html).to.include(data.code);
    });
  });

  describe("sendResetPasswordEmail", () => {
    it("should send reset password email with a link", async () => {
      const data = {
        email: "testuser@gmail.com",
        randomCode: "abcdef123456",
      };

      const result = await emailService.sendResetPasswordEmail(data);

      // Assertions for sendResetPasswordEmail
      expect(result).to.be.true;

      // Check if the email was "sent"
      const sentMail = transporter.sentMail();
      expect(sentMail.length).to.equal(1);
      expect(sentMail[0].from).to.equal("admin@gmail.com");
      expect(sentMail[0].to).to.equal(data.email);
      expect(sentMail[0].subject).to.equal("Alert");
      expect(sentMail[0].html).to.include(
        `${process.env.FRONTURL}/reset_password/${data.randomCode}`
      );
    });
  });
});
