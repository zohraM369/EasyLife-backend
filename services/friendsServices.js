const { default: mongoose } = require("mongoose");
const FriendRequest = require("../schemas/FriendRequestSchema");
const UserSchema = require("../schemas/User");
var User = mongoose.model("User", UserSchema);

exports.sendFriendRequest = async (userId, email) => {
  const recipient = await User.findOne({ email });
  if (!recipient) throw new Error("User not found");

  const friendRequest = new FriendRequest({
    requester: userId,
    recipient: recipient._id,
  });
  await friendRequest.save();
  return friendRequest;
};

exports.getFriendRequests = async (userId) => {
  const friendRequests = await FriendRequest.find({
    recipient: userId,
    status: "pending",
  }).populate("requester");
  return friendRequests;
};

exports.getFriends = async (userId) => {
  const user = await User.findById(userId).populate("friends");
  return user.friends;
};

exports.acceptFriendRequest = async (requestId) => {
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) throw new Error("Friend request not found");

  friendRequest.status = "accepted";
  await friendRequest.save();

  await User.findByIdAndUpdate(friendRequest.requester, {
    $push: { friends: friendRequest.recipient },
  });
  await User.findByIdAndUpdate(friendRequest.recipient, {
    $push: { friends: friendRequest.requester },
  });

  return friendRequest;
};

exports.deleteFriend = async (userId, friendId) => {
  await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
};
