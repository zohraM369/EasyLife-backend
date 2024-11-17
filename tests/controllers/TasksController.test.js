const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server"); 
const mongoose = require("mongoose");
const TodoItemSchema = require("../../schemas/TodoItem");
const TodoItem = mongoose.model("todoitem", TodoItemSchema);
chai.use(chaiHttp);
const expect = chai.expect;

let todoItemId, userId, friendId;

describe("TodoItem API", () => {
  before(async () => {
    await mongoose.connect(
      `mongodb://localhost:27017/${
        process.env.npm_lifecycle_event == "test"
          ? "easy_life_test"
          : "easy_life_prod"
      }`
    );
    await chai
      .request(app)
      .post("/auth/register")
      .send({ name: "zohra", email: "test@gmail.com", password: "test123" });
    const res = await chai
      .request(app)
      .post("/auth/login")
      .send({ username: "test@gmail.com", password: "test123" });

    token = res.body.user.token;
    const todoItem = new TodoItem({
      title: "Test Todo",
      description: "This is a test todo item",
      team: [],
      date: "27/08/2024",
      time: "16h30",
    });
    await todoItem.save();

    todoItemId = todoItem._id;
    userId = new mongoose.Types.ObjectId();
    friendId = new mongoose.Types.ObjectId();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe("POST /addOneTodoItem", () => {
    it("should add a new todo item", (done) => {
      chai
        .request(app)
        .post("/tasks/add_task")
        .set("Authorization", `Bearer ${token}`)

        .send({
          title: "New Todo",
          description: "Adding a new todo item",
          date: "27/08/2024",
          time: "16h30",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("msg", "Todo ajouté avec succés !");
          done();
        });
    });
  });

  describe("PUT /removeTeamMemberFromTask", () => {
    it("should remove a team member from a task", (done) => {
      chai
        .request(app)
        .put("/tasks/remove_team_member_from_task")
        .set("Authorization", `Bearer ${token}`)

        .send({ todoId: todoItemId, userId: userId })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property(
            "msg",
            "ID removed from team successfully!"
          );
          done();
        });
    });
  });

  describe("POST /addTeamMemberToTask", () => {
    it("should add a team member to a task", (done) => {
      chai
        .request(app)
        .post("/tasks/add_team_member_to_task")
        .set("Authorization", `Bearer ${token}`)

        .send({ todoItemId: todoItemId, friendId: friendId })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property(
            "msg",
            "Friend ID added successfully!"
          );
          done();
        });
    });
  });

  describe("GET /findOneTodoItem", () => {
    it("should find one todo item", (done) => {
      chai
        .request(app)
        .get(`/tasks/get_task?fields=title&value=Test%20Todo`)
        .set("Authorization", `Bearer ${token}`)

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
        .get("/tasks/get_many_tasks/1/10/Test")
        .set("Authorization", `Bearer ${token}`)

        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.results).to.be.an("array");
          done();
        });
    });
  });

  describe("GET /findOneTodoItemById/:id", () => {
    it("should find one todo item by ID", (done) => {
      chai
        .request(app)
        .get(`/tasks/get_task_by_id/${todoItemId}`)
        .set("Authorization", `Bearer ${token}`)

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
        .set("Authorization", `Bearer ${token}`)

        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("PUT /updateOneTodoItem/:id", () => {
    it("should update a todo item", (done) => {
      chai
        .request(app)
        .put(`/tasks/update_task/${todoItemId}`)
        .set("Authorization", `Bearer ${token}`)

        .send({ title: "Updated Todo" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title", "Updated Todo");
          done();
        });
    });
  });
  describe("DELETE /deleteOneTodoItem/:id", () => {
    it("should delete a todo item", (done) => {
      chai
        .request(app)
        .delete(`/tasks/delete_task/${todoItemId}`)
        .set("Authorization", `Bearer ${token}`)

        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
