const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");

const FriendRequest = require("../../schemas/FriendRequestSchema");
const UserSchema = require("../../schemas/User");
var User = mongoose.model("User", UserSchema);
const friendService = require("../../services/friendsServices");

describe("Friend Service Tests", () => {
  before(async () => {
    await mongoose.connect(
      `mongodb://localhost:27017/${
        process.env.npm_lifecycle_event == "test"
          ? "easy_life_test"
          : "easy_life_prod"
      }`
    );
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await FriendRequest.deleteMany({});
    await User.deleteMany({});
  });

  describe("sendFriendRequest", () => {
    it("should throw an error if recipient is not found", async () => {
      try {
        await friendService.sendFriendRequest(
          "userId",
          "nonexistent@example.com"
        );
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }
    });

    it("should create and return a new friend request", async () => {
      const newUser1 = new User({
        name: "test1",
        password: "test123",
        email: "test1@example.com",
        friends: [],
      });
      const newUser2 = new User({
        name: "test2",
        password: "test123",
        email: "test2@example.com",
        friends: [],
      });
      await newUser1.save();
      await newUser2.save();

      const friendRequest = await friendService.sendFriendRequest(
        newUser1._id,
        "test2@example.com"
      );
      console.log(friendRequest);
      expect(friendRequest).to.have.property("requester");
      expect(friendRequest).to.have.property("recipient");

      let recipientId = friendRequest.recipient.toString();
      expect(recipientId).to.equal(newUser2._id.toString());
    });
  });

  describe("getFriendRequests", () => {
    it("should return a list of pending friend requests", async () => {
      const newUser1 = new User({
        name: "test1",
        password: "test123",
        email: "test1@example.com",
        friends: [],
      });
      const newUser2 = new User({
        name: "test2",
        password: "test123",
        email: "test2@example.com",
        friends: [],
      });
      await newUser1.save();
      await newUser2.save();

      const friendRequest = new FriendRequest({
        requester: newUser1._id,
        recipient: newUser2._id,
        status: "pending",
      });
      await friendRequest.save();

      const friendRequests = await friendService.getFriendRequests(
        newUser2._id
      );
      expect(friendRequests).to.be.an("array").that.has.lengthOf(1);
      expect(friendRequests[0]).to.have.property("status", "pending");
    });
  });

  describe("getFriends", () => {
    it("should return a list of friends for a user", async () => {
      const newUser1 = new User({
        name: "test1",
        password: "test123",
        email: "test1@example.com",
        friends: [],
      });
      const newUser2 = new User({
        name: "test2",
        password: "test123",
        email: "test2@example.com",
        friends: [],
      });
      await newUser1.save();
      await newUser2.save();

      newUser1.friends.push(newUser2._id);
      await newUser1.save();
      await newUser2.save();

      const friends = await friendService.getFriends(newUser1._id);
      expect(friends).to.be.an("array").that.has.lengthOf(1);
      expect(friends[0]).to.have.property("email", "test2@example.com");
    });
  });

  describe("acceptFriendRequest", () => {
    it("should accept a friend request and update friends lists", async () => {
      const newUser1 = new User({
        name: "test1",
        password: "test123",
        email: "test1@example.com",
        friends: [],
      });
      const newUser2 = new User({
        name: "test2",
        password: "test123",
        email: "test2@example.com",
        friends: [],
      });
      await newUser1.save();
      await newUser2.save();

      const friendRequest = new FriendRequest({
        requester: newUser1._id,
        recipient: newUser2._id,
        status: "pending",
      });
      await friendRequest.save();

      const acceptedRequest = await friendService.acceptFriendRequest(
        friendRequest._id
      );
      expect(acceptedRequest).to.have.property("status", "accepted");

      const updatedUser1 = await User.findById(newUser1._id);
      const updatedUser2 = await User.findById(newUser2._id);

      expect(updatedUser1.friends).to.include(newUser2._id);
      expect(updatedUser2.friends).to.include(newUser1._id);
    });
  });

  describe("deleteFriend", () => {
    it("should delete a friend from both users' friend lists", async () => {
      const newUser1 = new User({
        name: "test1",
        password: "test123",
        email: "test1@example.com",
        friends: [],
      });
      const newUser2 = new User({
        name: "test2",
        password: "test123",
        email: "test2@example.com",
        friends: [],
      });
      await newUser1.save();
      await newUser2.save();

      newUser1.friends.push(newUser2._id);
      newUser2.friends.push(newUser1._id);
      await newUser1.save();
      await newUser2.save();

      await friendService.deleteFriend(newUser1._id, newUser2._id);

      const updatedUser1 = await User.findById(newUser1._id);
      const updatedUser2 = await User.findById(newUser2._id);

      expect(updatedUser1.friends).to.not.include(newUser2._id);
      expect(updatedUser2.friends).to.not.include(newUser1._id);
    });
  });
});
