const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const mongoose = require("mongoose");
const app = require("../../server");

chai.use(chaiHttp);

describe("Admin API", () => {
    // Connect to MongoDB before running the tests
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

    });

    // Close the connection after tests
    after(async () => {
        await mongoose.connection.close();
    });

    describe("GET /admin/get_all_users", () => {
        it("should return all users", async () => {
            const res = await chai.request(app)
                .get("/admin/get_all_users")
                .set("Authorization", `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
        });
    });

    describe("GET /admin/get_all_tasks_by_status", () => {
        it("should return total number of tasks by status", async () => {
            const res = await chai.request(app)
                .get("/admin/get_all_tasks_by_status")
                .set("Authorization", `Bearer ${token}`);


            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
        });
    });

    describe("GET /admin/get_all_tasks_by_types", () => {
        it("should return task summary by type", async () => {
            const res = await chai.request(app)
                .get("/admin/get_all_tasks_by_types")
                .set("Authorization", `Bearer ${token}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
        });
    });

    describe("POST /admin/log-login", () => {
        it("should log a login event", async () => {
            const res = await chai.request(app)
                .post("/admin/log-login")
                .set("Authorization", `Bearer ${token}`)

                .send({ userId: new mongoose.Types.ObjectId() });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message", "Login event logged successfully");
        });
    });

    describe("GET /admin/get_monthly_user_stats", () => {
        it("should return monthly user statistics", async () => {
            const res = await chai.request(app)
                .get("/admin/get_monthly_user_stats")
                .set("Authorization", `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("loginStats");
            expect(res.body).to.have.property("deletionStats");
            expect(res.body).to.have.property("inactiveUsers");
        });
    });
});
