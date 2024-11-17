const friendService = require("../services/friendsServices");

exports.sendFriendRequest = async (req, res) => {
  const { userId, email } = req.body;
  try {
    const friendRequest = await friendService.sendFriendRequest(userId, email);
    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriendRequests = async (req, res) => {
  const { userId } = req.params;
  try {
    const friendRequests = await friendService.getFriendRequests(userId);
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  const { userId } = req.params;
  try {
    const friends = await friendService.getFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
    const friendRequest = await friendService.acceptFriendRequest(requestId);
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFriend = async (req, res) => {
  const { friendId, userId } = req.body;
  try {
    await friendService.deleteFriend(userId, friendId);
    res.status(200).json({ message: "Friend deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
