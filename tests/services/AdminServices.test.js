const mongoose = require('mongoose');
const chai = require('chai');
const AdminService = require('../../services/adminService');
const UserSchema = require('../../schemas/User');
const TodoItemSchema = require('../../schemas/TodoItem');
const LoginEvent = require('../../schemas/LoginEvent');

const User = mongoose.model('User', UserSchema);
const TodoItem = mongoose.model('TodoItem', TodoItemSchema);

const expect = chai.expect;

describe('AdminService', () => {

    let user1Id;
    let user2Id;

    before(async () => {
        // Connect to a test database
        await mongoose.connect(
            `mongodb://localhost:27017/${process.env.npm_lifecycle_event == "test"
                ? "easy_life_test"
                : "easy_life_prod"
            }`
        );

        // Seed data for testing
        const user1 = new User({
            email: 'user1@test.com',
            name: 'user1',
            password: 'hashedPassword1',
            lastLogin: null,
        });

        const user2 = new User({
            email: 'user2@test.com',
            name: 'user2',
            password: 'hashedPassword2',
            lastLogin: null,
        });

        await user1.save();
        await user2.save();

        user1Id = user1._id;
        user2Id = user2._id;

        await TodoItem.create([
          {
            title: "Task 1",
            status: "done",
            type: "sport",
            date: "27/08/2024",
            time: "10h30",
          },
          {
            title: "Task 2",
            status: "active",
            type: "education",
            date: "27/08/2024",
            time: "12h30",
          },
          {
            title: "Task 3",
            status: "done",
            type: "sport",
            date: "27/08/2024",
            time: "16h30",
          },
        ]);

        await LoginEvent.create({ userId: user1Id, loginTime: new Date() });
    });

    after(async () => {
        // Clean up the test database after tests
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    describe('getUsers', () => {
        it('should return a list of users without their passwords', async () => {
            const users = await AdminService.getUsers();
            expect(users).to.be.an('array');
            expect(users[0]).to.have.property('name');
            expect(users[0]).to.not.have.property('password');
        });
    });

    describe('getTotalTasksByStatus', () => {
        it('should return the total number of tasks grouped by status', async () => {
            const result = await AdminService.getTotalTasksByStatus();
            expect(result).to.deep.equal({ done: 2, active: 1 });
        });
    });

    describe('getTaskSummaryByType', () => {
        it('should return a summary of tasks grouped by type', async () => {
            const result = await AdminService.getTaskSummaryByType();
            expect(result).to.deep.equal({ sport: 2, education: 1 });
        });
    });

    describe('logLoginEvent', () => {
        it('should log a login event and update the user\'s last login date', async () => {
            await AdminService.logLoginEvent(user1Id);

            const updatedUser = await User.findById(user1Id);
            expect(updatedUser.lastLogin).to.be.an.instanceOf(Date);
        });
    });

    describe('getMonthlyUserStats', () => {
        it('should return monthly user stats for logins, deletions, and inactive users', async () => {
            const result = await AdminService.getMonthlyUserStats();

            expect(result).to.have.property('loginStats').that.is.an('array');
            expect(result).to.have.property('deletionStats').that.is.an('array');
            expect(result).to.have.property('inactiveUsers').that.is.an('array');
        });
    });
});
