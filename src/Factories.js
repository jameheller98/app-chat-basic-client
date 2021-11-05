const { v4: uuidv4 } = require("uuid");

const createUser = ({ name = "", socketId = null } = {}) => ({
  id: uuidv4(),
  name,
  socketId,
});

const createMessage = ({ text = "", sender = "" } = {}) => ({
  id: uuidv4(),
  timestamp: Date.now(),
  text,
  sender,
});

const createThread = ({
  title = "Community",
  messages = [],
  users = [],
  typingUsers = [],
  isCommunity = false,
} = {}) => ({
  id: uuidv4(),
  title: isCommunity ? "Community" : createChatNameFromUser(users),
  messages,
  users,
  typingUsers,
  isCommunity,
});

const createChatNameFromUser = (users, excludedUser = "") => {
  return users.filter((u) => u !== excludedUser).join(" & ") || "Empty Users";
};

module.exports = {
  createUser,
  createMessage,
  createThread,
  createChatNameFromUser,
};
