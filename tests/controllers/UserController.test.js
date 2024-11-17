const chai = require("chai");
const fs = require("fs");
const path = require("path");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../../server");
let should = chai.should();
const _ = require("lodash");
const { default: mongoose } = require("mongoose");

var users = [];
let resetCode = "";
var token = "";
const code = Math.floor(100000 + Math.random() * 900000).toString();
let userId;
chai.use(chaiHttp);

describe("POST -/auth/register ", () => {
  before(async () => {
    await mongoose.connect(
      `mongodb://localhost:27017/${
        process.env.npm_lifecycle_event == "test"
          ? "easy_life_test"
          : "easy_life_prod"
      }`
    );
    await chai
      .request(server)
      .post("/auth/register")
      .send({ name: "zohra", email: "test@gmail.com", password: "test123" });
    const res = await chai
      .request(server)
      .post("/auth/login")
      .send({ username: "test@gmail.com", password: "test123" });
    userId = res.body.user._id;

    token = res.body.user.token;
  });
  // Close the connection after tests

  it("Ajouter un utilisateur. - S", (done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send({
        name: "dwarfSlayer",
        email: "lutfu.us@gmail.com",
        phone: "123456",
        password: "12345",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("Ajouter un utilisateur. - S", (done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send({
        name: "zohra",
        email: "chadly_zohra@hotmail.com",
        phone: "123456",
        password: "12345",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("Ajouter un utilisateur incorrect. (Sans username) - E", (done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send({
        email: "lutfu.us@gmail.com",
        phone: "123456",
        password: "12345",
      })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
  it("Ajouter un utilisateur incorrect. (Avec un email existant) - E", (done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send({
        name: "dwarfSlayer",
        email: "lutfu.us@gmail.com",
        phone: "123456",
        password: "12345",
      })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
  it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send({
        name: "",
        email: "lutfu.us@gmail.com",
        phone: "123456",
        password: "12345",
      })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
});

describe("POST - /login", () => {
  it("Authentifier un utilisateur correct. - S", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ username: "chadly_zohra@hotmail.com", password: "12345" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("Authentifier un utilisateur incorrect. (username inexistant) - E", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ username: "zdesfrgtyhj", password: "1234" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it("Authentifier un utilisateur incorrect. (password incorrect) - E", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ username: "dwarfSlayer", password: "7894" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it("Chercher un utilisateur incorrect (avec un id inexistant). - E", (done) => {
    const randomId = new mongoose.Types.ObjectId(); // Generate a random ObjectId

    chai
      .request(server)
      .get(`/auth/user/${randomId}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("send reset email", (done) => {
    chai
      .request(server)
      .post("/auth/send_reset_email")
      .send({
        email: "chadly_zohra@hotmail.com",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);

        resetCode = JSON.parse(res.text).resetCode;
        done();
      });
  });
  it("reset password handler", (done) => {
    chai
      .request(server)
      .post("/auth/reset_password")
      .send({
        password: "newPassword",
        resetCode: resetCode,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("send verification email", (done) => {
    chai
      .request(server)
      .post("/auth/sendEmail")
      .send({
        email: "chadly_zohra@hotmail.com",
        code: code,
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("verify code", (done) => {
    chai
      .request(server)
      .post("/auth/verifyCode")
      .send({
        email: "chadly_zohra@hotmail.com",
        code: code,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("update email", (done) => {
    chai
      .request(server)
      .put("/auth/update_email")
      .set("Authorization", `Bearer ${token}`)

      .send({
        newEmail: "chadly_zohra1@hotmail.com",
        userId: userId,
        password: "test123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("update name", (done) => {
    chai
      .request(server)
      .put("/auth/update_name")
      .set("Authorization", `Bearer ${token}`)

      .send({
        newName: "chadly_zohra1",
        userId: userId,
        password: "test123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("update city", (done) => {
    chai
      .request(server)
      .put("/auth/update_city")
      .set("Authorization", `Bearer ${token}`)

      .send({
        newCity: "Nice",
        userId: userId,
        password: "test123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("update password", (done) => {
    chai
      .request(server)
      .put("/auth/update_password")
      .set("Authorization", `Bearer ${token}`)

      .send({
        newPassword: "test123456",
        userId: userId,
        oldPassword: "test123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        users.push(res.body);
        done();
      });
  });
  it("update userImage", (done) => {
    chai
      .request(server)
      .put("/auth/update_user_image")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("user_id", userId.toString())
      .attach(
        "profileImage",
        fs.readFileSync(path.join(__dirname, "new-user-image.png")),
        "new-user-image.png"
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("image profile a été mis a jour avec succes !");
        res.body.user.should.have.property("image").that.includes("/uploads/");
        done();
      });
  });
});
