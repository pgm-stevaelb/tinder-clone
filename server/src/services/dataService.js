/*
Import packages
*/
const { date } = require('faker/lib/locales/az');
const fs = require('fs');
const {
  Http2ServerResponse
} = require('http2');
const path = require('path');
const {
  v4: uuidv4
} = require('uuid');

/*
Import custom packages
*/
const {
  HTTPError,
  convertArrayToPagedObject
} = require('../utils');

/*
File paths
*/
const filePathMessages = path.join(__dirname, '..', 'data', 'messages.json');
const filePathMatches = path.join(__dirname, '..', 'data', 'matches.json');
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');

/*
Write your methods from here
*/

// Read users.json
const readDataFromUsersFile = () => {
  const data = fs.readFileSync(filePathUsers, {
    encoding: 'utf-8',
    flag: 'r'
  });
  const users = JSON.parse(data);
  return users;
}

// Get all users
const getUsers = () => {
  try {
    const users = readDataFromUsersFile();
    return users;
  } catch (e) {
    throw new HTTPError("Can't get users...", 500);
  }
}

// Get a specific user
const getUserById = (userId) => {
  try {
    const users = readDataFromUsersFile();
    // Find a specific user where obj.id === userId
    const user = users.find(user => user.id === userId);
    if (!user) {
      throw new HTTPError(`Can't find the user with the id ${userId}`, 404);
    }
    return user;
  } catch (e) {
    throw new HTTPError("Can't get users...", 500);
  }
}

// Read messages.json
const readDataFromMessagesFile = () => {
  const data = fs.readFileSync(filePathMessages, {
    encoding: 'utf-8',
    flag: 'r'
  });
  const messages = JSON.parse(data);
  return messages;
};

// Get all messages
const getMessages = () => {
  try {
    const messages = readDataFromMessagesFile();
    return messages;
  } catch (e) {
    throw new HTTPError("Can't get messages...", 500);
  }
}

// Get all messages from a specific user
const getMessagesFromUser = (userId, type, friendId) => {
  try {
    const messages = readDataFromMessagesFile();
    let messagesOfUser = '';
    switch (type) {
      case 'sent':
        // All SENT messages
        messagesOfUser = messages.filter(message => message.senderId === userId);
        if (!messagesOfUser) {
          throw new HTTPError(`Can't find any messages for user ${userId}`, 404);
        }
        return messagesOfUser;
      case 'received':
        // All RECEIVED messages
        messagesOfUser = messages.filter(message => message.receiverId === userId);
        if (!messagesOfUser) {
          throw new HTTPError(`Can't find any messages for user ${userId}`, 404);
        }
        return messagesOfUser;
      case 'conversation':
        // Get the conversation between senderId and receiverId
        const conversation = messages.filter(message =>
          (message.senderId === userId && message.receiverId === friendId) || (message.senderId === friendId && message.receiverId === userId)
        );
        // const friendMessages = messages.filter(message => message.receiverId === friendId);
        return conversation;
      default:
        messagesOfUser = messages.filter(message => message.senderId === userId || message.receiverId === userId);
        if (!messagesOfUser) {
          throw new HTTPError(`Can't find any messages for user ${userId}`, 404);
        }
        return messagesOfUser;
    }
  } catch (e) {
    throw e;
  }
}

// Get all conversations between users
const getConversationBetweenUsers = (userId, type, friendId) => {
  try {
    const messages = readDataFromMessagesFile();
    return messages;
  } catch (e) {
    throw new HTTPError(`No converstations found between ${userId} and ${friendId}`, 404);
  }
}

// Create a new message
const createMessage = (message) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Create a message
    const messageToCreate = {
      ...message,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    messages.push(messageToCreate);
    // Write messages array to the message.json file
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    // Return the create message
    return messageToCreate;
  } catch (e) {
    throw new HTTPError(`Can't create a new message`, 501);
  }
}

// Read matches.json
const readDataFromMatchesFile = () => {
  const data = fs.readFileSync(filePathMatches, {
    encoding: 'utf-8',
    flag: 'r'
  });
  const messages = JSON.parse(data);
  return messages;
};

// Get all matches
const getMatches = () => {
  try {
    const matches = readDataFromMatchesFile();
    return matches;
  } catch (e) {
    throw new HTTPError("Can't get matches...", 500);
  }
}

// Get all matches from a specific user
const getMatchesFromUser = (userId) => {
  try {
    const matches = readDataFromMatchesFile();
    const matchesOfUser = matches.filter(match => match.userId === userId);
    if (!matchesOfUser) {
      throw new HTTPError(`Can't find any match for user ${userId}`, 404);
    }
    return matchesOfUser;
  } catch (e) {
    throw e;
  }
}

// Get match between users
const getMatchBetweenUsers = (userId, friendId) => {
  try {
    const matches = readDataFromMatchesFile();
    const matchBetweenUsers = matches.filter(match => match.userId === userId && match.friendId === friendId);
    if (!matchBetweenUsers) {
      throw new HTTPError(`Can't find any match between ${userId} and ${friendId}`, 404);
    }
    return matchBetweenUsers;
  } catch (e) {
    throw e;
  }
}

// Create a new match
const createMatch = (match) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Create a match
    const matchToCreate = {
      ...match,
      createdAt: Date.now(),
    };
    matches.push(matchToCreate);
    // Write matches array to the match.json file
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));
    // Return the create match
    return matchToCreate;
  } catch (e) {
    throw new HTTPError(`Can't create a new match`, 501);
  }
}

// Update a match
const updateMatch = (userId, friendId, match) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Update a match
    const matchToUpdate = {
      userId: userId,
      friendId: friendId,
      rating: match,
      modifiedAt: Date.now(),
    };
    const findIndex  = matches.findIndex(e => e.userId === userId && e.friendId === friendId);
    if (findIndex > -1) {
      matches[findIndex] = {
        ...matches[findIndex],
        ...matchToUpdate
      }
    }
    // Write updated match to the match.json file
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));
    // Return the create match
    return matchToUpdate;
  } catch (e) {
    throw new HTTPError(`Can't create a new match`, 501);
  }
}

// Export all the methods of the data service
module.exports = {
  createMessage,
  getUsers,
  getUserById,
  getMessagesFromUser,
  getMessages,
  getMatches,
  getMatchesFromUser,
  getMatchBetweenUsers,
  updateMatch,
  createMatch,
};