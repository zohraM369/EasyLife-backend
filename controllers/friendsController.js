const { default: mongoose } = require("mongoose");
const FriendRequest = require("../schemas/FriendRequestSchema");
const UserSchema = require("../schemas/User");
var User = mongoose.model("User", UserSchema);

exports.sendFriendRequest = async (req, res) => {
  const { userId, email } = req.body;

  try {
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ error: "User not found" });

    const friendRequest = new FriendRequest({
      requester: userId,
      recipient: recipient._id,
    });
    await friendRequest.save();

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriendRequests = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const friendRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("requester");
    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("friends");
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest)
      return res.status(404).json({ error: "Friend request not found" });

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.requester, {
      $push: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $push: { friends: friendRequest.requester },
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete friend
exports.deleteFriend = async (req, res) => {
  const { friendId, userId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    res.status(200).json({ message: "Friend deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
