const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../../server");
let should = chai.should();
const _ = require("lodash");

var users = [];
var valid_token = "";
chai.use(chaiHttp);

describe("POST -/auth/register ", () => {
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
        expect(res).to.have.status(201);
        users.push(res.body);
        done();
      });
  });
  it("Ajouter un utilisateur incorrect. (Sans name) - E", (done) => {
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
  it("Ajouter un utilisateur incorrect. (Avec un name existant) - E", (done) => {
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
describe("POST - /users", () => {
  it("Ajouter plusieurs utilisateurs. - S", (done) => {
    chai
      .request(server)
      .post("/auth/users")
      .send([
        {
          name: "zohra",
          email: "zohra.us@gmail.com",
          phone: "1234567",
          password: "1234",
        },
        {
          name: "Lara",
          email: "Lara.us@gmail.com",
          phone: "123456",
          password: "1234",
        },
      ])
      .end((err, res) => {
        res.should.have.status(201);

        users = [...users, ...res.body];
        done();
      });
  });
});

describe("POST - /login", () => {
  it("Authentifier un utilisateur correct. - S", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ name: "dwarfSlayer", password: "1234" })
      .end((err, res) => {
        res.should.have.status(200);
        valid_token = res.body.token;
        done();
      });
  });
  it("Authentifier un utilisateur incorrect. (name inexistant) - E", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ name: "zdesfrgtyhj", password: "1234" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it("Authentifier un utilisateur incorrect. (password incorrect) - E", (done) => {
    chai
      .request(server)
      .post("/auth/login")
      .send({ name: "dwarfSlayer", password: "7894" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("GET - /user/:id", () => {
  it("Chercher un utilisateur correct. - S", (done) => {
    chai
      .request(server)
      .get("/auth/user/" + users[0]._id)
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher un utilisateur incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/auth/user/665f18739d3e172be5daf092")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher un utilisateur incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/auth/user/123")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un utilisateur sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user/" + users[0]._id)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("GET - /user", () => {
  it("Chercher un utilisateur par un champ selectionné. - S", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .query({ fields: ["name"], value: users[0].name })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher un utilisateur avec un champ non autorisé. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .query({ fields: ["name"], value: users[0].name })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un utilisateur sans tableau de champ. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .query({ value: users[0].name })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un utilisateur avec un champ vide. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .query({ fields: ["name"], value: "" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un utilisateur sans aucunes querys. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un utilisateur inexistant. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .auth(valid_token, { type: "bearer" })
      .query({ fields: ["name"], value: "users[0].name" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher un utilisateur par un champ selectionné sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .get("/auth/user")
      .query({ fields: ["name"], value: users[0].name })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("GET - /users", () => {
  it("Chercher plusieurs utilisateurs. - S", (done) => {
    chai
      .request(server)
      .get("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: _.map(users, "_id") })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("Chercher plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"] })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: ["123", "456"] })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Chercher plusieurs utilisateurs sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .get("/auth/users")
      .query({ id: _.map(users, "_id") })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("GET - /users_by_filter", () => {
  it("Chercher plusieurs utilisateurs. - S", (done) => {
    chai
      .request(server)
      .get("/auth/users_by_filter")
      .auth(valid_token, { type: "bearer" })
      .query({ page: 1, pageSize: 2 })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.results).to.be.an("array");
        done();
      });
  });
  it("Chercher plusieurs utilisateurs avec une query vide. - S", (done) => {
    chai
      .request(server)
      .get("/auth/users_by_filter")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.results).to.be.an("array");
        expect(res.body.count).to.be.equal(3);
        done();
      });
  });
  it("Chercher plusieurs utilisateurs avec une query contenant une chaine de caractère - S", (done) => {
    chai
      .request(server)
      .get("/auth/users_by_filters")
      .auth(valid_token, { type: "bearer" })
      .query({ page: 1, pageSize: 2, q: "lu" })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.results).to.be.an("array");
        expect(res.body.count).to.be.equal(3);
        done();
      });
  });
  it("Chercher plusieurs utilisateurs avec une chaine de caractere dans page. - E", (done) => {
    chai
      .request(server)
      .get("/auth/users_by_filter")
      .auth(valid_token, { type: "bearer" })
      .query({ page: "une phrase", pageSize: 2 })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Chercher plusieurs utilisateurs sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .get("/auth/users_by_filters")
      .query({ page: 1, pageSize: 2 })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("PUT - /user", () => {
  it("Modifier un utilisateur. - S", (done) => {
    chai
      .request(server)
      .put("/auth/user/" + users[0]._id)
      .auth(valid_token, { type: "bearer" })
      .send({ name: "zohra" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier un utilisateur avec un id invalide. - E", (done) => {
    chai
      .request(server)
      .put("/auth/user/123456789")
      .auth(valid_token, { type: "bearer" })
      .send({ name: "zohra", email: "Edouard" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier un utilisateur avec un id inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/auth/user/66791a552b38d88d8c6e9ee7")
      .send({ name: "dwarfSlayer", email: "lutfu.us@gmail.com" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier un utilisateur avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/auth/user/" + users[0]._id)
      .auth(valid_token, { type: "bearer" })
      .send({ name: "", email: "lutfu.us@gmail.com" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier un utilisateur avec un champ unique existant. - E", (done) => {
    chai
      .request(server)
      .put("/auth/user/" + users[0]._id)
      .auth(valid_token, { type: "bearer" })
      .send({ name: users[1].name })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Modifier un utilisateur sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .put("/auth/user/" + users[0]._id)
      .send({ name: "dwarfSlayer" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("PUT - /users", () => {
  it("Modifier plusieurs utilisateurs. - S", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: _.map(users, "_id") })
      .send({ name: "zohra" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier plusieurs utilisateurs avec des ids invalide. - E", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: ["267428142", "41452828"] })
      .send({ name: "zohra" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier plusieurs utilisateurs avec des ids inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: ["66791a552b38d88d8c6e9ee7", "667980886db560087464d3a7"] })
      .send({ name: "zohra" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier des utilisateurs avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: _.map(users, "_id") })
      .send({ name: "" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier des utilisateurs avec un champ unique existant. - E", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: _.map(users, "_id") })
      .send({ name: users[1].name })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Modifier plusieurs utilisateurs sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .put("/auth/users")
      .query({ id: _.map(users, "_id") })
      .send({ name: "zohra" })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("DELETE - /user", () => {
  it("Supprimer un utilisateur. - S", (done) => {
    chai
      .request(server)
      .delete("/auth/user/" + users[1]._id)
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer un utilisateur incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/auth/user/665f18739d3e172be5daf092")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer un utilisateur incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/auth/user/123")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Supprimer un utilisateur sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .delete("/auth/user/" + users[1]._id)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("DELETE - /users", () => {
  it("Supprimer plusieurs utilisateurs. - S", (done) => {
    chai
      .request(server)
      .delete("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: _.map(users, "_id") })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/auth/users/665f18739d3e172be5daf092&665f18739d3e172be5daf093")
      .auth(valid_token, { type: "bearer" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/auth/users")
      .auth(valid_token, { type: "bearer" })
      .query({ id: ["123", "456"] })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
  it("Supprimer plusieurs utilisateurs sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .delete("/auth/users")
      .query({ id: _.map(users, "_id") })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it("Supprimer plusieurs utilisateurs sans etre authentifié. - E", (done) => {
    chai
      .request(server)
      .delete("/auth/users")
      .query({ id: _.map(users, "_id") })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
