/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all users
*/
const getUsers = (req, res, next) => {
  try {
    // Get Users from dataService
    const users = dataService.getUsers();
    // Send response
    res.status(200).json(users);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Get a specific user
*/
const getUserById = (req, res, next) => {
  try {
    // Get userId parameter
    const { userId } = req.params;
    // Get specific user
    const user = dataService.getUserById(userId);
    // Send response
    res.status(200).json(user);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Create a new user
*/
const createUser = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Update a specific user
*/
const updateUser = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Delete a specific user
*/
const deleteUser = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
};
