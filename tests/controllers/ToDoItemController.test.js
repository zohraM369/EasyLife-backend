const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("../../server");
let should = chai.should();
const _ = require("lodash");
const UserService = require("../../services/UserService");

var to_do_items = [];
var tab_id_users = [];

let users = [
  {
    name: "oui1",
    email: "iencli1@gmail.com",
    password: "12345",
  },

  {
    name: "oui2",
    email: "iencli2@gmail.com",
    password: "12345",
  },

  {
    name: "oui3",
    email: "iencli3@gmail.com",
    password: "12345",
  },

  {
    name: "oui4",
    email: "iencli4@gmail.com",
    password: "12345",
  },
];

it("Création des utilisateurs fictif", (done) => {
  UserService.addManyUsers(users, null, function (err, value) {
    tab_id_users = _.map(value, "_id");
    done();
  });
});

function rdm_user(tab) {
  let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))];
  return rdm_id;
}
chai.use(chaiHttp);

describe("POST - /add_todo_item", () => {
  it("Ajouter un todo_Item . - S", (done) => {
    chai
      .request(server)
      .post("/add_todo_item")
      .send({
        tittle: "rdv",
        description: "outside",
        start_date: "10-10-2020",
        end_date: "10-10-2020",
        user_id: rdm_user(tab_id_users),
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        articles.push(res.body);
        done();
      });
  });
  it("Ajouter un todo_item  incorrect. (name) - E", (done) => {
    chai
      .request(server)
      .post("/add_todo_item")
      .send({
        description: "outside",
        start_date: "10-10-2020",
        end_date: "10-10-2020",
        user_id: rdm_user(tab_id_users),
      })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });

  it("Ajouter un todo_item incorrect. (Avec un champ vide) - E", (done) => {
    chai
      .request(server)
      .post("/add_todo_item")
      .send({
        tittle: " ",
        description: "outside",
        start_date: "10-10-2020",
        end_date: "10-10-2020",
        user_id: rdm_user(tab_id_users),
      })
      .end((err, res) => {
        expect(res).to.have.status(405);
        done();
      });
  });
});

describe("POST - /add_todo_items", () => {
  it("Ajouter plusieurs todo_items. - S", (done) => {
    chai
      .request(server)
      .post("/add_todo_items")
      .send([
        {
          tittle: "rdv dentiste",
          description: "outside",
          start_date: "10-10-2020",
          end_date: "10-10-2020",
          user_id: rdm_user(tab_id_users),
        },

        {
          tittle: "paiement des factures",
          description: "outside",
          start_date: "10-10-2020",
          end_date: "10-10-2020",
          user_id: rdm_user(tab_id_users),
        },
      ])
      .end((err, res) => {
        //console.log(res.body);
        res.should.have.status(201);
        to_do_items = [...to_do_items, ...res.body];
        done();
      });
  });
});

describe("GET -  /todo_item/:id", () => {
  it("Chercher un todo_item correct. - S", (done) => {
    chai
      .request(server)
      .get("/todo_item/" + to_do_items[0]._id)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher un todo_item incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/todo_item/665f18739d3e172be5daf092")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher un todo_item incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/todo_item/123")
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("GET - /todo_item", () => {
  it("Chercher un todo_item par un champ selectionné. - S", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .query({ fields: ["tittle"], value: to_do_items[0].tittle })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Chercher un todo_item avec un champ non autorisé. - E", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .query({ fields: ["description"], value: to_do_items[0].description })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un todo_item sans tableau de champ. - E", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .query({ value: to_do_items[0].tittle })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un todo_item avec un champ vide. - E", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .query({ fields: ["tittle"], value: "" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un todo_item sans aucunes querys. - E", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Chercher un todo_item inexistant. - E", (done) => {
    chai
      .request(server)
      .get("/todo_item")
      .query({ fields: ["tittle"], value: "to_do_items.description" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

describe("GET - /todo_items", () => {
  it("Chercher plusieurs todo_items. - S", (done) => {
    chai
      .request(server)
      .get("/todo_items")
      .query({ id: _.map(to_do_items, "_id") })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("Chercher plusieurs todo_items incorrects (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .get("/todo_items")
      .query({ id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"] })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Chercher plusieurs todo_items incorrects (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .get("/todo_items")
      .query({ id: ["123", "456"] })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("PUT - /todo_item/:id", () => {
  it("Modifier un to_do_item. - S", (done) => {
    chai
      .request(server)
      .put("/todo_item/" + to_do_items[0]._id)
      .send({ tittle: "rdv" })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("Modifier un todo_item  avec un id invalide. - E", (done) => {
    chai
      .request(server)
      .put("/todo_item/123456789")
      .send({ tittle: "rdv", description: " entretient" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });

  it("Modifier un todo_item  avec un id inexistant. - E", (done) => {
    chai
      .request(server)
      .put("/todo_item/66791a552b38d88d8c6e9ee7")
      .send({ tittle: "rdv", description: " entretient" })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it("Modifier un todo_item  avec un champ requis vide. - E", (done) => {
    chai
      .request(server)
      .put("/todo_item/" + to_do_items[0]._id)
      .send({ tittle: "", description: " entretient" })
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

describe("DELETE - /todo_item/:id", () => {
  it("Supprimer un todo_item. - S", (done) => {
    chai
      .request(server)
      .delete("/todo_item/" + to_do_items[0]._id)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("Supprimer un todo_item  incorrect (avec un id inexistant). - E", (done) => {
    chai
      .request(server)
      .delete("/todo_item/665f18739d3e172be5daf092")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
  it("Supprimer un todo_item    incorrect (avec un id invalide). - E", (done) => {
    chai
      .request(server)
      .delete("/todo_item/123")
      .end((err, res) => {
        res.should.have.status(405);
        done();
      });
  });
});

// it("suppression des utilisateurs fictifs", (done) => {
//   UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
//     done();
//   });
// });
