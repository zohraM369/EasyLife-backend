const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const mongoose = require("mongoose");
const UserSchema = require("../../schemas/User");
const FriendRequest = require("../../schemas/FriendRequestSchema");
const User = mongoose.model('user', UserSchema)
chai.use(chaiHttp);
const expect = chai.expect;

let user1Id, user2Id, friendRequestId;

describe("Friend Request API", () => {
    before(async () => {
        await mongoose.connect(
            `mongodb://localhost:27017/${process.env.npm_lifecycle_event == "test"
                ? "easy_life_test"
                : "easy_life_prod"
            }`
        );
        await mongoose.connect(
            `mongodb://localhost:27017/${process.env.npm_lifecycle_event == "test"
                ? "easy_life_test"
                : "easy_life_prod"
            }`
        );
        await chai.request(app).post('/auth/register').send({ name: "hichem", email: "test@gmail.com", password: "test123" })
        const res = await chai.request(app)
            .post("/auth/login") // Replace with your actual login route
            .send({ username: "test@gmail.com", password: "test123" });

        token = res.body.user.token; // Adjust this according to your API's response structure
        const user1 = new User({ name: "test1", email: "friend1@example.com", password: "password1", friends: [] });
        const user2 = new User({ name: "test2", email: "friend2@example.com", password: "password2", friends: [] });
        await user1.save();
        await user2.save();

        user1Id = user1._id;
        user2Id = user2._id;
    });

    after(async () => {
        // Cleanup: Delete the users and friend requests created for testing
        await mongoose.disconnect();
    });

    describe("POST /sendFriendRequest", () => {
        it("should send a friend request", (done) => {
            chai.request(app)
                .post("/friends/send_friend_request")
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: user1Id, email: "friend2@example.com" })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.property("requester", user1Id.toString());
                    expect(res.body).to.have.property("recipient", user2Id.toString());
                    friendRequestId = res.body._id;
                    done();
                });
        });
    });

    describe("GET /friendRequests/:userId", () => {
        it("should get pending friend requests", (done) => {
            chai.request(app)
                .get(`/friends/get_friends_requests/${user2Id}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body[0]).to.have.property("requester");
                    expect(res.body[0].requester._id).to.equal(user1Id.toString());
                    done();
                });
        });
    });

    describe("POST /acceptFriendRequest", () => {
        it("should accept a friend request", (done) => {
            chai.request(app)
                .post("/friends/handle_friend_request/accept")
                .set("Authorization", `Bearer ${token}`)
                .send({ requestId: friendRequestId })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("status", "accepted");
                    done();
                });
        });

        it("should add users to each other's friends list", async () => {
            const user1 = await User.findById(user1Id);
            const user2 = await User.findById(user2Id);
            expect(user1.friends).to.include(user2Id.toString());
            expect(user2.friends).to.include(user1Id.toString());
        });
    });

    describe("POST /deleteFriend", () => {
        it("should delete a friend", (done) => {
            chai.request(app)
                .post("/friends/delete_friend")
                .set("Authorization", `Bearer ${token}`)
                .send({ friendId: user2Id, userId: user1Id })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("message", "Friend deleted");
                    done();
                });
        });

        it("should remove users from each other's friends list", async () => {
            const user1 = await User.findById(user1Id);
            const user2 = await User.findById(user2Id);
            expect(user1.friends).to.not.include(user2Id.toString());
            expect(user2.friends).to.not.include(user1Id.toString());
        });
    });
});