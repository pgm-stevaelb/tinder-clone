/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const {
  HTTPError,
  handleHTTPError
} = require('../../utils');

/*
Get all matches
*/
const getMatches = (req, res, next) => {
  try {
    // Get Matches from dataService
    const matches = dataService.getMatches();
    // Send response
    res.status(200).json(matches);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Get a specific match
*/
const getMatchByIds = (req, res, next) => {
  try {
    // Get userId and friendId parameter from url
    const { userId, friendId } = req.params;
    // Get matches from a specific user
    const match = dataService.getMatchBetweenUsers(userId, friendId);
    // Send response
    res.status(200).json(match);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Get matches from a specific user
*/
const getMatchesFromUserById = (req, res, next) => {
  try {
    // Get userId parameter from url
    const { userId } = req.params;
    // Get matches from a specific user
    const matches = dataService.getMatchesFromUser(userId);
    // Send response
    res.status(200).json(matches);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Create a new match
*/
const createMatch = (req, res, next) => {
  try {
    // Get body (match) from request
    const match = req.body;
    // Create a match
    const createdMatch = dataService.createMatch(match);
    // Send response
    res.status(201).json(createdMatch);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Update a specific match
*/
const updateMatch = (req, res, next) => {
  try {
    // Get userId parameter from url
    const { userId, friendId } = req.params;
    const match = req.body.rating;
    const updatedMatch = dataService.updateMatch(userId, friendId, match);
    // Send response
    res.status(200).json(updatedMatch);
  } catch (e) {
    handleHTTPError(e, next);
  }
};

/*
Delete a specific match
*/
const deleteMatch = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createMatch,
  deleteMatch,
  getMatches,
  getMatchByIds,
  getMatchesFromUserById,
  updateMatch,
};