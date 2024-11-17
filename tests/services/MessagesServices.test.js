const mongoose = require("mongoose");
const chai = require("chai");
const MessageService = require("../../services/messagesService");
const MessageSchema = require("../../schemas/Message");
const UserSchema = require("../../schemas/User");
const expect = chai.expect;

const Message = mongoose.model("Message", MessageSchema);
const User = mongoose.model("User", UserSchema);

describe("MessageService", () => {
  let user1, user2, user3;

  before(async () => {
    // Connect to a test database
    await mongoose.connect(
      `mongodb://localhost:27017/${
        process.env.npm_lifecycle_event == "test"
          ? "easy_life_test"
          : "easy_life_prod"
      }`
    );

    // Seed user data for testing
    user1 = await User.create({
      name: "User1",
      email: "user1@test.com",
      password: "hashedPassword1",
    });
    user2 = await User.create({
      name: "User2",
      email: "user2@test.com",
      password: "hashedPassword2",
    });
    user3 = await User.create({
      name: "User3",
      email: "user3@test.com",
      password: "hashedPassword3",
    });

    // Seed message data for testing
    await Message.create([
      { user_id: user1._id, recipientId: user2._id, content: "Hello" },
      { user_id: user2._id, recipientId: user1._id, content: "Hi there" },
      { user_id: user1._id, recipientId: user3._id, content: "Good morning" },
    ]);
  });

  after(async () => {
    // Clean up the test database after tests
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe("createMessage", () => {
    it("should create a new message", async () => {
      const messageData = {
        user_id: user1._id,
        recipientId: user2._id,
        content: "Hey!",
      };
      const result = await MessageService.createMessage(messageData);
      expect(result).to.have.property("_id");
      expect(result).to.have.property("user_id").that.equals(user1._id);
      expect(result).to.have.property("recipientId").that.equals(user2._id);
      expect(result).to.have.property("content", "Hey!");
    });
  });

  describe("getMessagesByUserId", () => {
    it("should return messages involving a specific user", async () => {
      const result = await MessageService.getMessagesByUserId(user1._id);
      expect(result).to.be.an("array").that.has.lengthOf(4);
    });
  });

  describe("getPeopleChat", () => {
    it("should return the chat between two specific users", async () => {
      const result = await MessageService.getPeopleChat(user1._id, user2._id);
      // expect(result).to.be.an('array').that.has.lengthOf(2);
      expect(result[0])
        .to.have.property("user_id")
        .that.satisfies(
          (val) => val.equals(user1._id) || val.equals(user2._id)
        );
      expect(result[0])
        .to.have.property("recipientId")
        .that.satisfies(
          (val) => val.equals(user1._id) || val.equals(user2._id)
        );
    });
  });

  describe("getPeopleTalkedWith", () => {
    it("should return people the user has talked with", async () => {
      const result = await MessageService.getPeopleTalkedWith(user1._id);
      expect(result).to.be.an("array").that.has.lengthOf(4);
      expect(result[0])
        .to.have.property("user_id")
        .that.satisfies(
          (val) => val.equals(user1) || val.equals(user2)
        );
      expect(result[0])
        .to.have.property("recipientId")
        .that.satisfies(
          (val) => val.equals(user1) || val.equals(user2)
        );
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message by ID", async () => {
      const message = await Message.create({
        user_id: user1._id,
        recipientId: user3._id,
        content: "Hello again!",
      });
      const result = await MessageService.deleteMessage(message._id);
      const deletedMessage = await Message.findById(message._id);
      expect(deletedMessage).to.be.null;
    });
  });
});
