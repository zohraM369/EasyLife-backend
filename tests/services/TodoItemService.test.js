const mongoose = require("mongoose");
const TodoItemService = require("../../services/TodoItemService");
const { expect } = require("chai");

let result = {};

describe("TodoItemService", function () {
  before(async () => {
    // Connect to a test database
    await mongoose.connect(
      `mongodb://localhost:27017/${
        process.env.npm_lifecycle_event == "test"
          ? "easy_life_test"
          : "easy_life_prod"
      }`
    );
  });
  after(async () => {
    // Clean up the test database after tests
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  describe("addOneTodoItem", function () {
    it("should add a new todo item successfully", function (done) {
      const todoData = {
        title: "Test Todo",
        description: "This is a test todo item",
        team: [],
        date: "27/08/2024",
        time: "16h30",
      };

      TodoItemService.addOneTodoItem(todoData)
        .then((data) => {
          // Manually verify data
          result = data;
          if (
            data.title === "Test Todo" &&
            data.description === "This is a test todo item"
          ) {
            console.log("addOneTodoItem test passed");
            done();
          } else {
            console.error("addOneTodoItem test failed");
            done(new Error("addOneTodoItem test failed"));
          }
        })
        .catch((err) => done(err));
    });
  });

  describe("addTeamMemberToTask", function () {
    it("should add a team member to the task", async function () {
      const taskId = result._id;
      const teamMemberId = "60d5f7f8a7c8b947e0b0e2b2";

      try {
        const data = await TodoItemService.addTeamMemberToTask({
          todoItemId: taskId,
          friendId: teamMemberId,
        });

        if (data.team.includes(teamMemberId)) {
          console.log("addTeamMemberToTask test passed");
        } else {
          console.error("addTeamMemberToTask test failed");
          throw new Error("addTeamMemberToTask test failed");
        }
      } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow error to ensure the test fails
      }
    });
  });

  describe("removeTeamMemberFromTask", function () {
    it("should remove a team member from the task", function (done) {
      const taskId = result._id;
      const teamMemberId = "60d5f7f8a7c8b947e0b0e2b2";

      TodoItemService.removeTeamMemberFromTask({
        todoId: taskId,
        userId: teamMemberId,
      })
        .then((data) => {
          

          if (!data.team.includes(teamMemberId)) {
            console.log("removeTeamMemberFromTask test passed");
            done();
          } else {
            console.error("removeTeamMemberFromTask test failed");
            done(new Error("removeTeamMemberFromTask test failed"));
          }
        })
        .catch((err) => done(err));
    });
  });

  describe("findTodoItemsByUserId", function () {
    it("should return todo items for a valid user_id", async function () {
      // Arrange: create a test todo item
      const todoItem = {
        title: "Test Todo",
        description: "This is a test todo item",
        team: [],
        date: "27/08/2024",
        time: "16h30",
        user_id: "605c72f1fc13ae1f1c000001",
      };
      let create = await TodoItemService.addOneTodoItem(todoItem);
      console.log(create);
      // Act: Call the function
      const result = await TodoItemService.findTodoItemsByUserId(
        "605c72f1fc13ae1f1c000001"
      );
      console.log(result);
      // Assert: Check the returned data
      expect(result).to.be.an("array");
      expect(result[0].title).to.equal("Test Todo");
    });
  });

 

  describe("findOneTodoItemById", function () {
    it("should return a single todo item by ID", async function () {
        const todoItem = {
          title: "Test Todo",
          description: "This is a test todo item",
          team: [],
          date: "27/08/2024",
          time: "16h30",
          user_id: "605c72f1fc13ae1f1c000002",
        };
        let create = await TodoItemService.addOneTodoItem(todoItem);

      // Act: Call the function
      TodoItemService.findOneTodoItemById(
        create._id,
        {},
        function (err, result) {
          // Assert
          expect(err).to.be.null;
          expect(result.title).to.equal("Test Todo");
        }
      );
    });

    it("should return an error if the ID is invalid", function (done) {
      // Act: Call the function with an invalid ID
      TodoItemService.findOneTodoItemById(
        "invalid_id",
        {},
        function (err, result) {
          // Assert
          expect(err).to.not.be.null;
          expect(err.msg).to.equal("ObjectId non conforme.");
          done();
        }
      );
    });
  });

  describe("updateOneTodoItem", function () {
    it("should update a todo item by ID", async function () {
       const todoItem = {
         title: "Test Todo",
         description: "This is a test todo item",
         team: [],
         date: "27/08/2024",
         time: "16h30",
         user_id: "605c72f1fc13ae1f1c000003",
       };
       let create = await TodoItemService.addOneTodoItem(todoItem);

      TodoItemService.updateOneTodoItem(
        create._id,
        { title: "Updated Title" },
        {},
        function (err, result) {
          // Assert
          expect(err).to.be.null;
          expect(result.title).to.equal("Updated Title");
        }
      );
    });
  });

  describe("deleteOneTodoItem", function () {
    it("should delete a todo item by ID", async function () {
       const todoItem = {
         title: "Test Todo",
         description: "This is a test todo item",
         team: [],
         date: "27/08/2024",
         time: "16h30",
         user_id: "605c72f1fc13ae1f1c000003",
       };
       let create = await TodoItemService.addOneTodoItem(todoItem);
      TodoItemService.deleteOneTodoItem(create._id, {}, function (err, result) {
        // Assert
        expect(err).to.be.null;
        expect(result.title).to.equal("Test Todo");

        // Verify deletion
        TodoItemService.findOneTodoItemById(create._id).then((deletedItem) => {
          expect(deletedItem).to.be.null;
        });
      });
    });
  });
});
