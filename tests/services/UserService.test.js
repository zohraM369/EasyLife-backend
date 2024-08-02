const UserService = require("../../services/UserService");
const chai = require("chai");
let expect = chai.expect;
const _ = require("lodash");
var id_user_valid = "";
var tab_id_users = [];
var users = [];

describe("addOneUser", () => {
  it("Utilisateur correct. - S", () => {
    var user = {
      username: "louna",
      phone: "2345678",
      email: "louna@gmail.com",
      password: "12345",
    };
    UserService.addOneUser(user, null, function (err, value) {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      id_user_valid = value._id;
      users.push(value);
      done();
      //
    });
  });
  it("Utilisateur incorrect. (Sans username) - E", () => {
    var user_no_valid = {
      email: "edouard.dupont2@gmail.com",
      phone: "edupont2",
      password: "12345",
    };
    UserService.addOneUser(user_no_valid, function (err, value) {
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
      expect(err).to.haveOwnProperty("fields");
      expect(err["fields"]).to.haveOwnProperty("username");
      expect(err["fields"]["username"]).to.equal("Path `username` is required.");
      done();
    });
  });
});

describe("addManyUsers", () => {
  it("Utilisateurs à ajouter, valide. - S", (done) => {
    var users_tab = [
      {
        username: "zohra",
        email: "zohra.dupont7@gmail.com",
        phone: "1112223",
        password: "12345",
      },
      {
        username: "mini",
        email: "mini.dupont8@gmail.com",
        phone: "0645102340",
        password: "12345",
      },
      {
        username: "louna",
        email: "louna.dupont9@gmail.com",
        phone: "0645102340",
        password: "12345",
      },
    ];

    UserService.addManyUsers(users_tab, null, function (err, value) {
      tab_id_users = _.map(value, "_id");
      users = [...value, ...users];
      expect(value).lengthOf(3);
      done();
    });
  });
});

describe("findOneUser", () => {
  it("Chercher un utilisateur par les champs selectionnées. - S", (done) => {
    UserService.findOneUser(
      ["username", "email"],
      users[0].username,
      null,
      function (err, value) {
        expect(value).to.haveOwnProperty("username");
        done();
      }
    );
  });
  it("Chercher un utilisateur avec un champ non autorisé. - E", (done) => {
    UserService.findOneUser(
      ["username", "phone"],
      users[0].email,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
  it("Chercher un utilisateur sans tableau de champ. - E", (done) => {
    UserService.findOneUser(
      "username",
      users[0].email,
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
  it("Chercher un utilisateur inexistant. - E", (done) => {
    UserService.findOneUser(
      ["username"],
      "users[0].email",
      null,
      function (err, value) {
        expect(err).to.haveOwnProperty("type_error");
        done();
      }
    );
  });
});

describe("findManyUsers", () => {
  it("Retourne 4 utilisateurs - S", (done) => {
    UserService.findManyUsers(null, 3, 1, null, function (err, value) {
      expect(value).to.haveOwnProperty("count");
      expect(value).to.haveOwnProperty("results");
      expect(value["count"]).to.be.equal(4);
      expect(value["results"]).lengthOf(3);
      expect(err).to.be.null;

      done();
    });
  });
  it("Envoie d'une chaine de caractère a la place de la page - E", (done) => {
    UserService.findManyUsers(null, "test", 3, null, function (err, value) {
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      expect(value).to.undefined;
      done();
    });
  });
});

describe("findOneUserById", () => {
  it("Chercher un utilisateur existant correct. - S", (done) => {
    UserService.findOneUserById(id_user_valid, null, function (err, value) {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      expect(value).to.haveOwnProperty("username");
      done();
    });
  });
  it("Chercher un utilisateur non-existant correct. - E", (done) => {
    UserService.findOneUserById("100", null, function (err, value) {
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.equal("no-valid");
      done();
    });
  });
});

describe("findManyUsersById", () => {
  it("Chercher des utilisateurs existant correct. - S", (done) => {
    UserService.findManyUsersById(tab_id_users, null, function (err, value) {
      expect(value).lengthOf(3);
      done();
    });
  });
});

describe("updateOneUser", () => {
  it("Modifier un utilisateur correct. - S", (done) => {
    UserService.updateOneUser(
      id_user_valid,
      { username: "zohra", phone: "123456" },
      null,
      function (err, value) {
        expect(value).to.be.a("object");
        expect(value).to.haveOwnProperty("_id");
        expect(value).to.haveOwnProperty("username");
        expect(value).to.haveOwnProperty("phone");
        expect(value["username"]).to.be.equal("zohra");
        expect(value["phone"]).to.be.equal("123456");
        done();
      }
    );
  });
  it("Modifier un utilisateur avec id incorrect. - E", (done) => {
    UserService.updateOneUser(
      "1200",
      { username: "zohra", phone: "123456" },
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
  it("Modifier un utilisateur avec des champs requis vide. - E", (done) => {
    UserService.updateOneUser(
      id_user_valid,
      { username: "", phone: "123456" },
      null,
      function (err, value) {
        expect(value).to.be.undefined;
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("username");
        expect(err["fields"]["username"]).to.equal("Path `username` is required.");
        done();
      }
    );
  });
});

describe("updateManyUsers", () => {
  it("Modifier plusieurs utilisateurs correctement. - S", (done) => {
    UserService.updateManyUsers(
      tab_id_users,
      { username: "zohra", phone: "123456" },
      null,
      function (err, value) {
        expect(value).to.haveOwnProperty("modifiedCount");
        expect(value).to.haveOwnProperty("matchedCount");
        expect(value["matchedCount"]).to.be.equal(tab_id_users.length);
        expect(value["modifiedCount"]).to.be.equal(tab_id_users.length);
        done();
      }
    );
  });
  it("Modifier plusieurs utilisateurs avec id incorrect. - E", (done) => {
    UserService.updateManyUsers(
      "1200",
      { username: "zohra", phone: "123456" },
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
  it("Modifier plusieurs utilisateurs avec des champs requis vide. - E", (done) => {
    UserService.updateManyUsers(
      tab_id_users,
      { username: "", phone: "123456" },
      null,
      function (err, value) {
        expect(value).to.be.undefined;
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("username");
        expect(err["fields"]["username"]).to.equal("Path `username` is required.");
        done();
      }
    );
  });
});

describe("deleteOneUser", () => {
  it("Supprimer un utilisateur correct. - S", (done) => {
    UserService.deleteOneUser(id_user_valid, null, function (err, value) {
      //callback
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      expect(value).to.haveOwnProperty("username");
      expect(value).to.haveOwnProperty("phone");
      done();
    });
  });
  it("Supprimer un utilisateur avec id incorrect. - E", (done) => {
    UserService.deleteOneUser("1200", null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      done();
    });
  });
  it("Supprimer un utilisateur avec un id inexistant. - E", (done) => {
    UserService.deleteOneUser(
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

describe("deleteManyUsers", () => {
  it("Supprimer plusieurs utilisateurs correctement. - S", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("deletedCount");
      expect(value["deletedCount"]).is.equal(tab_id_users.length);
      done();
    });
  });
  it("Supprimer plusieurs utilisateurs avec id incorrect. - E", (done) => {
    UserService.deleteManyUsers("1200", null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      done();
    });
  });
});
