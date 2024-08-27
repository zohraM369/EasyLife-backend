const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../../server");
let should = chai.should();
const _ = require("lodash");
const { default: mongoose } = require("mongoose");

var users = [];
var valid_token = "";
chai.use(chaiHttp);

describe("POST -/auth/register ", () => {
  before(async () => {
    await mongoose.connect(
      `mongodb://localhost:27017/${process.env.npm_lifecycle_event == "test"
        ? "easy_life_test"
        : "easy_life_prod"
      }`
    );
    await chai
      .request(server).post('/auth/register')
      .send({ name: "hichem", email: "test@gmail.com", password: "test123" })
    const res = await chai.request(server)
      .post("/auth/login")
      .send({ username: "test@gmail.com", password: "test123" });

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
        email: "zohra@gmail.com",
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
        username: "dwarfSlayer",
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
        username: "",
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
      .send({ username: "zohra@gmail.com", password: "12345" })
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
})





















