// services/AdminService.js
const mongoose = require('mongoose');
const UserSchema = require('../schemas/User');
const TaskSchema = require('../schemas/TodoItem');
const LoginEvent = require('../schemas/LoginEvent');

const TodoItem = mongoose.model('TodoItem', TaskSchema);
const User = mongoose.model('User', UserSchema);

const getUsers = async () => {
    const users = await User.find();
    return users.map(user => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    });
};

const getTotalTasksByStatus = async () => {
    const taskSummary = await TodoItem.aggregate([
        {
            $match: {
                status: { $ne: null }, // Filter out documents with null or missing type
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                status: '$_id',
                count: 1,
            },
        },
    ]);

    const summary = {};
    taskSummary.forEach(item => {
        summary[item.status] = item.count;
    });
    delete summary.null
    return summary;
};


const getTaskSummaryByType = async () => {
    const taskSummary = await TodoItem.aggregate([
        {
            $match: {
                type: { $ne: null }, // Filter out documents with null or missing type
            },
        },
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                count: 1,
            },
        },
    ]);

    const summary = {};
    taskSummary.forEach(item => {
        summary[item.type] = item.count;
    });
    delete summary.null
    return summary;
};

const logLoginEvent = async (userId) => {
    await LoginEvent.create({ userId });
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
};

const getMonthlyUserStats = async () => {
    const currentYear = new Date().getFullYear();

    const loginStats = await LoginEvent.aggregate([
        {
            $match: {
                loginTime: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$loginTime" } },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                count: 1,
            },
        },
        { $sort: { month: 1 } },
    ]);

    const deletionStats = await User.aggregate([
        {
            $match: {
                deleted: true,
                deletedAt: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$deletedAt" } },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                count: 1
            },
        },

        { $sort: { month: 1 } },
    ]);

    const inactiveUsers = await User.aggregate([
        {
            $match: {
                deleted: false,
                lastLogin: { $eq: null },
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                count: 1
            },
        },

        { $sort: { month: 1 } },
    ]);

    return {
        loginStats,
        deletionStats,
        inactiveUsers,
    };
};

module.exports = {
    getUsers,
    getTotalTasksByStatus,
    getTaskSummaryByType,
    logLoginEvent,
    getMonthlyUserStats
};
