const TOdoItemService = require("../../services/TodoItemService");
const chai = require("chai");
let expect = chai.expect;
const _ = require("lodash");
const UserService = require("../../services/UserService");

var id_to_do_item_valid = "";
var to_do_items = [];
var tab_id_to_do_items = [];
var tab_id_users = [];
var valid_token = "";

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

it("Authentification d'un utilisateur fictif.", (done) => {
  UserService.loginUser("oui4", "1234", null, function (err, value) {
    valid_token = value.token;
    done();
  });
});

function rdm_user(tab) {
  let rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))];
  return rdm_id;
}

describe("addOneTodoItem", () => {
  it("to_do_item  correct. - S", () => {
    var to_do_item = {
      tittle: "test",
      description: "ceci est une description",
      start_date: "10-10-2020",
      end_date: "10-10-2020",
      user_id: rdm_user(tab_id_users),
    };
    TOdoItemService.addOneTodoItem(to_do_item, null, function (err, value) {
      console.log(value);
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      expect(value).to.haveOwnProperty("user_id");
      expect(toString(value["user_id"])).to.be.equal(
        toString(to_do_item.user_id)
      );
      id_to_do_item_valid = value._id;
      to_do_items.push(value);
    });
  });
  it("Un to_do_item incorrect. (name) - E", () => {
    var to_do_item_no_valid = {
      user_id: rdm_user(tab_id_users),
      description: "ceci est une description",
      start_date: "10-10-2020",
      end_date: "10-10-2020",
    };
    TOdoItemService.addOneTodoItem(
      to_do_item_no_valid,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("tittle");
        expect(err["fields"]["tittle"]).to.equal("Path `tittle` is required.");
      }
    );
  });
  it("to_do_item incorrect. (Description vide) - E", (done) => {
    var to_do_item_no_valid = {
      user_id: rdm_user(tab_id_users),
      description: "",
      start_date: "10-10-2020",
      end_date: "10-10-2020",
    };
    TOdoItemService.addOneTodoItem(
      to_do_item_no_valid,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("description");
        expect(err["fields"]["description"]).to.equal(
          "Path `description` is required."
        );
        done();
      }
    );
  });
});

describe("findOneTodoItem", () => {
  it("Chercher un to_do_item par les champs selectionnées. - S", (done) => {
    TOdoItemService.findOneTodoItem(
      ["tittle", "description"],
      to_do_items[0].tittle,
      null,
      function (err, value) {
        expect(value).to.haveOwnProperty("name");
        done();
      }
    );
  });
  it("Chercher un to_do_item avec un champ non autorisé. - E", (done) => {
    TOdoItemService.findOneTodoItem(
      ["tittle", "description"],
      to_do_items[0].tittle,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
  it("Chercher un to_do_item sans tableau de champ. - E", (done) => {
    TOdoItemService.findOneTodoItem(
      "tittle",
      to_do_items[0].tittle,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
  it("Chercher un to_do_item inexistant. - E", (done) => {
    TOdoItemService.findOneTodoItem(
      ["tittle"],
      to_do_items[0].tittle,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
});

describe("findOneTodoItemById", () => {
  it("Chercher un to_do_item existant correct. - S", (done) => {
    TOdoItemService.findOneTodoItemById(
      id_to_do_item_valid,
      null,
      function (err, value) {
        expect(value).to.be.a("object");
        expect(value).to.haveOwnProperty("_id");
        expect(value).to.haveOwnProperty("name");
        done();
      }
    );
  });
  it("Chercher un to_do_item non-existant correct. - E", (done) => {
    TOdoItemService.findOneTodoItemById("100", null, function (err, value) {
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.equal("no-valid");
      done();
    });
  });
});

describe("updateOneTodoItem", () => {
  it("Modifier un to_do_item correct. - S", (done) => {
    TOdoItemService.updateOneTodoItem(
      id_to_do_item_valid,
      { tittle: "RDV", description: "entretient" },
      null,
      function (err, value) {
        //console.log(value);
        expect(value).to.be.a("object");
        expect(value).to.haveOwnProperty("_id");
        expect(value).to.haveOwnProperty("tittle");
        expect(value).to.haveOwnProperty("description");
        expect(value["tittle"]).to.be.equal("RDV");
        expect(value["description"]).to.be.equal("entretient");
        done();
      }
    );
  });
  it("Modifier un to_do_item avec id incorrect. - E", (done) => {
    TOdoItemService.updateOneTodoItem(
      "1200",
      { tittle: "RDV", description: "entretient" },
      null,
      function (err, value) {
        expect(err).to.be.a("object");
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("type_error");
        expect(err["type_error"]).to.be.equal("no-valid");
        done();
      }
    );
  });
  it("Modifier un to_do_item avec des champs requis vide. - E", (done) => {
    TOdoItemService.updateOneTodoItem(
      id_to_do_item_valid,
      { name: "", description: "meuble" },
      null,
      function (err, value) {
        expect(value).to.be.undefined;
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("name");
        expect(err["fields"]["name"]).to.equal("Path `name` is required.");
        done();
      }
    );
  });
});

describe("deleteOneto_do_item", () => {
  it("Supprimer un to_do_item correct. - S", (done) => {
    TOdoItemService.deleteOneTodoItem(
      id_to_do_item_valid,
      null,
      function (err, value) {
        //callback
        expect(value).to.be.a("object");
        expect(value).to.haveOwnProperty("_id");
        expect(value).to.haveOwnProperty("TITTLE");
        expect(value).to.haveOwnProperty("description");
        done();
      }
    );
  });
  it("Supprimer un to_do_item avec id incorrect. - E", (done) => {
    TOdoItemService.deleteOneTodoItem("1200", null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      done();
    });
  });
  it("Supprimer un to_do_item avec un id inexistant. - E", (done) => {
    TOdoItemService.deleteOneTodoItem(
      "665f00c6f64f76ba59361e9f",
      null,
      function (err, value) {
        expect(err).to.be.a("object");
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("type_error");
        expect(err["type_error"]).to.be.equal("no-found");
        done();
      }
    );
  });
});

// it("suppression des utilisateurs fictifs", (done) => {
//   UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
//     done();
//   });
// });
