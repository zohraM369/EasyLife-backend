const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendsController');

router.post('/send_friend_request', friendController.sendFriendRequest);
router.get('/get_friends_requests/:userId', friendController.getFriendRequests);
router.get('/get_friends_list/:userId', friendController.getFriends);
router.post('/handle_friend_request/accept', friendController.acceptFriendRequest);
router.post('/delete_friend', friendController.deleteFriend);

module.exports = router;