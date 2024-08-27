const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const mongoose = require("mongoose");
const server = require("../../server"); 
const MessageSchema = require("../../schemas/Message"); 
const UserSchema = require("../../schemas/User"); 
const app = require("../../server");
const Message = mongoose.model('message', MessageSchema)
const User = mongoose.model('user', UserSchema)

chai.use(chaiHttp);

describe("Message API", () => {
    let user1, user2, messageId;

    before(async () => {
        
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
        user1 = await User.create({ email: "user1@example.com", password:"user1", name: "User One" });
        user2 = await User.create({ email: "user2@example.com",password:"user2", name: "User Two" });
    });

    after(async () => {
        // Clean up the database
        await Message.deleteMany({});
        await mongoose.connection.close();
    });

    it("should create a new message", (done) => {
        chai.request(server)
            .post("/messages/create_message")
            .set("Authorization", `Bearer ${token}`)

            .send({
                user_id: user1._id,
                content: "Hello, User Two!",
                recipientId: user2._id
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an("object");
             expect(res.body).to.have.property("content", "Hello, User Two!");
                messageId = res.body._id;
                done();
            });
    });

    it("should get messages by user ID", (done) => {
        chai.request(server)
            .get(`/messages/get_user_messages/${user1._id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body[0]).to.have.property("content", "Hello, User Two!");
                done();
            });
    });

    it("should get people chat by IDs", (done) => {
        chai.request(server)
            .get(`/messages/get_people_chat/${user1._id}/${user2._id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body[0]).to.have.property("content", "Hello, User Two!");
                done();
            });
    });

    it("should get people talked with by user ID", (done) => {
        chai.request(server)
            .get(`/messages/get_people_talked_with/${user1._id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                expect(res.body[0]).to.have.property("recipientId");
                done();
            });
    });

    it("should delete a message", (done) => {
        chai.request(server)
            .delete(`/messages/delete_message/${messageId}`)
            .set("Authorization", `Bearer ${token}`)

            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("message", "Message deleted successfully");
                done();
            });
    });
});
