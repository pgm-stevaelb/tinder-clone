const TINDER_BASE_PATH = 'http://localhost:8080/api';

class TinderApi {
  constructor () {
    this.url = TINDER_BASE_PATH;
  };

  async getUsers() {
    try {
      const response = await fetch(`${this.url}/users`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async getUserById(userId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  }

  async getAllMessagesFromUser(userId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}/messages`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  }

  async getReceivedMessagesFromUser(userId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}/messages?type=received`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async getSentMessagesFromUser(userId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}/messages?type=sent`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async getConversationBetweenUsers(userId, friendId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}/messages?type=conversation&friendId=${friendId}`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async addMessageBetweenUsers (message) {
    try {
      const response = await fetch(`${this.url}/messages`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async getMatchesForUser (userId) {
    try {
      const response = await fetch(`${this.url}/users/${userId}/matches`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async addMatch (match) {
    try {
      const response = await fetch(`${this.url}/matches`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(match)
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  };

  async updateMatch (userId, friendId, match) {
    try {
      const response = await fetch(`${this.url}/matches/${userId}/${friendId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(match)
      });
      //const data = await response.json();
      //return data;
    } catch (e) {
      console.error('An error ocurred...', e.message);
    }
  }
};