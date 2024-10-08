const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server"); // Assuming your Express app is exported from app.js
const mongoose = require("mongoose");
const TodoItemSchema = require("../../schemas/TodoItem");
const TodoItem = mongoose.model("todoitem", TodoItemSchema);
chai.use(chaiHttp);
const expect = chai.expect;
const UserService = require("../../services/UserService");
let todoItemId, userId, friendId;

// describe("TodoItem API", () => {
//   before(async () => {
//     // Connect to the test database
//     await mongoose.connect("mongodb://localhost:27017/testdb", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Create a user and friend for testing
//     const todoItem = new TodoItem({
//       title: "Test Todo",
//       description: "This is a test todo item",
//       team: [],
//     });
//     await todoItem.save();

//     todoItemId = todoItem._id;
//     userId = new mongoose.Types.ObjectId(); // Mock user ID
//     friendId = new mongoose.Types.ObjectId(); // Mock friend ID
//   });

//   after(async () => {
//     // Cleanup: Delete the todo items created for testing
//     await TodoItem.deleteMany({});
//     await mongoose.disconnect();
//   });

describe("POST /addOneTodoItem", () => {
  it("should add a new todo item", (done) => {
    chai
      .request(app)
      .post("/tasks/add_task")
      .send({
        title: "New Todo",
        description: "Adding a new todo item",
        start_date: "10-10-2020",
        end_date: "10-10-2020",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("msg", "Todo ajouté avec succés !");
        console.log(res.body);
        done();
      });
  });
});

describe("PUT /removeTeamMemberFromTask", () => {
  it("should remove a team member from a task", (done) => {
    chai
      .request(app)
      .put("/tasks/remove_team_member_from_task")
      .send({ todoId: todoItemId, userId: userId })
      .end((err, res) => {
        expect(res).to.have.status(200);

        expect(res.body).to.have.property(
          "msg",
          "ID supprimé de l'équipe avec succès!"
        );
        console.log(res.body);
        done();
      });
  });
});

describe("POST /addTeamMemberToTask", () => {
  it("should add a team member to a task", (done) => {
    chai
      .request(app)
      .post("/tasks/add_team_member_to_task")
      .send({ todoItemId: todoItemId, friendId: friendId })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          "msg",
          "ID d'ami ajouté avec succès!"
        );
        done();
      });
  });
});

describe("GET /findOneTodoItem", () => {
  it("should find one todo item", (done) => {
    chai
      .request(app)
      .get(`/tasks/get_task?fields=title&value=${todoItemId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title", "Test Todo");
        done();
      });
  });
});

describe("GET /findManyTodoItems", () => {
  it("should find multiple todo items", (done) => {
    chai
      .request(app)
      .get("/tasks/get_many_tasks?page=1&pageSize=10&q=Test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});

describe("GET /findOneTodoItemById/:id", () => {
  it("should find one todo item by ID", (done) => {
    chai
      .request(app)
      .get(`/tasks/get_task_by_id/${todoItemId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title", "Test Todo");
        done();
      });
  });
});

describe("GET /findTodoItemsByUserId/:id", () => {
  it("should find todo items by user ID", (done) => {
    chai
      .request(app)
      .get(`/tasks/get_user_tasks/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});

describe("DELETE /deleteOneTodoItem/:id", () => {
  it("should delete a todo item", (done) => {
    chai
      .request(app)
      .delete(`/tasks/delete_task/${todoItemId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          "msg",
          "TodoItem supprimé avec succès!"
        );
        done();
      });
  });
});

describe("PUT /updateOneTodoItem/:id", () => {
  it("should update a todo item", (done) => {
    chai
      .request(app)
      .put(`/tasks/update_task/${todoItemId}`)
      .send({ title: "Updated Todo" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title", "Updated Todo");
        done();
      });
  });
});
