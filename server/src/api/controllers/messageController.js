/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all messages
*/
const getMessages = (req, res, next) => {
  try {
    // Get Messages from dataService
    const messages = dataService.getMessages();
    // Send response
    res.status(200).json(messages);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Get a specific message
*/
const getMessageById = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Get messages from a specific user
*/
const getMessagesFromUserById = (req, res, next) => {
  try {
    // Get userId parameter from url
    const { userId } = req.params;
    const { type, friendId } = req.query;
    // Get messages from a specific user
    const messages = dataService.getMessagesFromUser(userId, type, friendId);
    // Send response
    res.status(200).json(messages);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Create a new message
*/
const createMessage = (req, res, next) => {
  try {
    // Get body (message) from request
    const message = req.body;
    // Create a message
    const createdMessage = dataService.createMessage(message);
    // Send response
    res.status(201).json(createdMessage);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Update a specific message
*/
const updateMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Delete a specific message
*/
const deleteMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageById,
  getMessagesFromUserById,
  updateMessage,
};
