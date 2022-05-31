(() => {
	const app = {
		init() {
			this.cacheElem();
			this.registerListeners();

			this.tinderApi = new TinderApi();

			this.users = null;
			this.fetchUsers();

			this.currentUserId = null;
			this.currentFriendId = null;
			this.receivedMessages = null;

			this.currentConversation = null;

			this.matches = null;
			this.noMatches = null;
		},
		cacheElem() {
			this.$userList = document.querySelector('.users__list');
			this.$allMessages = document.querySelector('.messages');
			this.$receivedItemsList = document.getElementById('messages__list--received');
			this.$sentItemsList = document.getElementById('messages__list--sent');
			this.$conversationList = document.getElementById('conversation__list');
			this.$messageForm = document.getElementById('send-message');
			this.$matchList = document.getElementById('matchmaker__list--matches');
			this.$newPeople = document.getElementById('matchmaker__list--new-people');
		},
		registerListeners() {
			this.$userList.addEventListener('click', ev => {
				const userId = ev.target.dataset.id || ev.target.parentNode.dataset.id || ev.target.parentNode.parentNode.dataset.id;
        this.$newPeople.innerHTML = '';
				this.setActiveUser(userId);
			});

			this.$receivedItemsList.addEventListener('click', ev => {
				const userId = ev.target.dataset.userid || ev.target.parentNode.dataset.userid || ev.target.parentNode.parentNode.dataset.userid;
				const friendId = ev.target.dataset.friendid || ev.target.parentNode.dataset.friendid || ev.target.parentNode.parentNode.dataset.friendid;
				this.currentFriendId = friendId;
				this.setActiveReceivedMessage(friendId);
				this.fetchConversationBetweenUsers(userId, friendId);
			});

			this.$sentItemsList.addEventListener('click', ev => {
				const userId = ev.target.dataset.userid || ev.target.parentNode.dataset.userid || ev.target.parentNode.parentNode.dataset.userid;
				const friendId = ev.target.dataset.friendid || ev.target.parentNode.dataset.friendid || ev.target.parentNode.parentNode.dataset.friendid;
				this.currentFriendId = friendId;
				this.setActiveSentMessage(friendId);
				this.fetchConversationBetweenUsers(userId, friendId);
			});

			this.$messageForm.addEventListener('submit', ev => {
				return this.createMessage(ev);
			});
		},
		async createMessage(ev) {
			ev.preventDefault();
			const messageToCreate = {
				senderId: this.currentFriendId,
				receiverId: this.currentUserId,
				message: ev.target['txtMessage'].value
			}
			await this.tinderApi.addMessageBetweenUsers(messageToCreate);
			this.fetchConversationBetweenUsers(this.currentUserId, this.currentFriendId);
			ev.target['txtMessage'].value = '';
      
      this.fetchReceivedMessagesFromUser(this.currentUserId);
			this.fetchSentMessagesFromUser(this.currentUserId);
		},
		async fetchUsers() {
			this.users = await this.tinderApi.getUsers();

			this.$userList.innerHTML = this.users.map(user => `
        <li class="users__list-item rounded-corners margin-r-1">
          <a href="#" data-id="${user.id}" class="user__link flex-center rounded-corners">
            <img src="${user.picture.thumbnail}" alt="${user.username}" class="user__img">
            ${user.firstName + ' ' + user.lastName}
          </a>
          <div class="tooltip hidden">BLABLA</div>
        </li>
      `).join('');

			const userId = this.users[0].id;
			this.setActiveUser(userId);
		},
		setActiveUser(userId) {
			this.currentUserId = userId;
			const $selectedUser = this.$userList.querySelector('.users__list-item.selected--user');
			if ($selectedUser !== null) {
				$selectedUser.classList.remove('selected--user');
			}
			this.$userList.querySelector(`.users__list-item > a[data-id="${userId}"]`).parentNode.classList.add('selected--user');

			this.fetchReceivedMessagesFromUser(userId);
			this.fetchSentMessagesFromUser(userId);
		},
		async fetchReceivedMessagesFromUser(userId) {
			this.receivedMessages = await this.tinderApi.getReceivedMessagesFromUser(userId);

			this.$receivedItemsList.innerHTML = this.receivedMessages.sort((a, b) => b.createdAt - a.createdAt).map(message => this.generateHTMLForMessagesList(message, 'receiver')).join('');
			document.querySelector('.messages--received .counter').innerHTML = `(${this.receivedMessages.length})`;

			const senderId = this.receivedMessages[0].senderId;
			this.setActiveReceivedMessage(senderId);
			this.currentFriendId = senderId;
		},
		async fetchSentMessagesFromUser(userId) {
			this.sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);

			this.$sentItemsList.innerHTML = this.sentMessages.sort((a, b) => b.createdAt - a.createdAt).map(message => this.generateHTMLForMessagesList(message, 'sent')).join('');
			document.querySelector('.messages--sent .counter').innerHTML = `(${this.sentMessages.length})`;
		},
		setActiveReceivedMessage(friendId) {
			const $selectedMessage = this.$allMessages.querySelector('.selected-message');
			if ($selectedMessage !== null) {
				$selectedMessage.classList.remove('selected-message');
			}
			this.$receivedItemsList.querySelector(`.messages__list-item > a[data-friendid="${friendId}"]`).parentNode.classList.add('selected-message');
			this.fetchConversationBetweenUsers(this.currentUserId, friendId);
			this.fetchMatches(friendId);
		},
		setActiveSentMessage(friendId) {
			const $selectedMessage = this.$allMessages.querySelector('.selected-message');
			if ($selectedMessage !== null) {
				$selectedMessage.classList.remove('selected-message');
			}
			this.$sentItemsList.querySelector(`.messages__list-item > a[data-friendid="${friendId}"]`).parentNode.classList.add('selected-message');
		},
		generateHTMLForMessagesList(message, type) {
			const senderOrReceiver = this.users.find(u => {
				return (type === 'receiver') ? u.id === message.senderId : u.id === message.receiverId;
			});
			return `
        <li class="messages__list-item">
          <a href="#" data-userid="${type === 'receiver' ? message.receiverId : message.senderId}" data-friendid="${type === 'receiver' ? message.senderId : message.receiverId}">
            <div class="messages__list__header">
              <h3>${senderOrReceiver.firstName + ' ' + senderOrReceiver.lastName}</h3>
              <span class="date flex-center">${this.convertToDate(message.createdAt)}</span>
            </div>
            <p>${this.createExcerpt(message.message)}</p>
          </a>
        </li>`;
		},
		async fetchConversationBetweenUsers(userId, friendId) {
			this.conversation = await this.tinderApi.getConversationBetweenUsers(userId, friendId);
			this.$conversationList.innerHTML = this.conversation.map(message => this.setActiveConversation(message)).join('');
		},
		setActiveConversation(message) {
			let output = '';
			if (message.receiverId === this.currentUserId) {
				output += `<div class="conversation-message--sent rounded-corners">
          <div class="conversation-message--header">
            <h3>You</h3>
            <p class="date flex-center">${this.convertToDate(message.createdAt)}</p>
          </div>
          <p>${message.message}</p>
        </div>`;
			} else {
				const userName = this.users.filter(u => u.id === this.currentFriendId).map(u => u.firstName);
				output += `<div class="conversation-message--received rounded-corners">
          <div class="conversation-message--header">
            <h3>${userName}</h3>
            <p class="date flex-center">${this.convertToDate(message.createdAt)}</p>
          </div>
          <p>${message.message}</p>
        </div>`;
			}
			return output;
		},
		async fetchMatches() {
			this.matches = await this.tinderApi.getMatchesForUser(this.currentUserId);

			const currentMatches = [...this.matches.map(e => e.friendId), this.currentUserId]
			const allUsers = [...this.users.map(e => e.id)]
      const noMatches = allUsers.filter(n => currentMatches.indexOf(n) === -1);
      for (const single of noMatches) {
        this.$newPeople.innerHTML += this.users.filter(e => e.id === single).map(e => {
          return this.generateHTMLForMatches(e)
        }).join('');
      }

			this.$matchList.innerHTML = this.matches.map(match => {
				switch (match.rating) {
					case 'like':
						return this.users.filter(u => u.id === match.friendId).map(e => this.generateHTMLForMatches(e, match.rating));
					case 'superlike':
						return this.users.filter(u => u.id === match.friendId).map(e => this.generateHTMLForMatches(e, match.rating));
					default:
						return this.users.filter(u => u.id === match.friendId).map(e => this.generateHTMLForMatches(e, match.rating));
				}
			}).join('');

      this.createMatchTriggers();
      this.updateMatchTriggers();
		},
    createMatchTriggers() {
      this.$dislike = document.querySelectorAll('.icon--dislike');
      this.$like = document.querySelectorAll('.icon--like');
      this.$superlike = document.querySelectorAll('.icon--super');

      this.$dislike.forEach(e => {
        e.addEventListener('click', ev => {
          this.createMatch(ev);
        });
      });

      this.$like.forEach(e => {
        e.addEventListener('click', ev => {
          this.createMatch(ev);
        });
      });

      this.$superlike.forEach(e => {
        e.addEventListener('click', ev => {
          this.createMatch(ev);
        });
      });
    },
    async createMatch(ev) {
      ev.preventDefault();
      const friendId = ev.target.dataset.friendid || ev.target.parentNode.dataset.friendid || ev.target.parentNode.parentNode.dataset.friendid;
      const type =  ev.target.dataset.type || ev.target.parentNode.dataset.type || ev.target.parentNode.parentNode.dataset.type;
      const matchToCreate = {
        userId: this.currentUserId,
        friendId: friendId,
        rating: type
      }
      await this.tinderApi.addMatch(matchToCreate);
      this.$newPeople.innerHTML = '';
      const userId = this.currentUserId;
			this.setActiveUser(userId);
    },
		generateHTMLForMatches(e, rating) {
			return `<div class="match-wrapper" data-friendId="${e.id}">
        <div>
          <img src="${e.picture.thumbnail}" alt="${e.username}" class="user__img">
          <div class="match__details">
            <p><strong>${e.firstName + ' ' + e.lastName}</strong></p>
            <p>${e.gender + ' ' + this.convertToAge(e.dayOfBirth)}</p>
            <p>${e.location.city + ', ' + e.location.country}</p>
          </div>
        </div>
        <div class="match__btns">
          <img src="static/media/icons/cross.svg" alt="cross" class="match__icon ${rating !== undefined ? 'icon--dislike--matched' : 'icon--dislike'} cross ${rating === 'dislike' ? 'matched' : ''}" data-type="dislike">
          <img src="static/media/icons/heart.svg" alt="heart" class="match__icon ${rating !== undefined ? 'icon--like--matched' : 'icon--like'} ${rating === 'like' ? 'matched' : ''}" data-type="like">
          <img src="static/media/icons/star.svg" alt="star" class="match__icon ${rating !== undefined ? 'icon--super--matched' : 'icon--super'} ${rating === 'superlike' ? 'matched' : ''}" data-type="superlike">
        </div>
      </div>`
		},
    updateMatchTriggers() {
      this.$dislikeMatch = document.querySelectorAll('.icon--dislike--matched');
      this.$likeMatch = document.querySelectorAll('.icon--like--matched');
      this.$superlikeMatch = document.querySelectorAll('.icon--super--matched');

      this.$dislikeMatch.forEach(e => {
        e.addEventListener('click', ev => {
          this.updateMatch(ev);
        });
      });

      this.$likeMatch.forEach(e => {
        e.addEventListener('click', ev => {
          this.updateMatch(ev);
        });
      });

      this.$superlikeMatch.forEach(e => {
        e.addEventListener('click', ev => {
          this.updateMatch(ev);
        });
      });
    },
    async updateMatch(ev) {
      ev.preventDefault();
      const friendId = ev.target.dataset.friendid || ev.target.parentNode.dataset.friendid || ev.target.parentNode.parentNode.dataset.friendid;
      const type =  ev.target.dataset.type || ev.target.parentNode.dataset.type || ev.target.parentNode.parentNode.dataset.type;
      const matchToUpdate = {
        userId: this.currentUserId,
        friendId: friendId,
        rating: type
      }
      await this.tinderApi.updateMatch(this.currentUserId, friendId, matchToUpdate);
      //this.createMatchTriggers();
      this.fetchMatches();
    },
		convertToDate(epoch) {
			const newDate = new Date(epoch);
			const country = 'nl-BE';
			return newDate.toLocaleDateString(country) + ' <span class="dot"></span> ' + newDate.toLocaleTimeString(country, {
				hour: '2-digit',
				minute: '2-digit'
			});
		},
		createExcerpt(message) {
			return (message.length > 50) ? message.substr(0, 49) + '...' : message;
		},
		convertToAge(epoch) {
			const today = new Date();
			const birthDay = new Date(epoch);
			return today.getFullYear() - birthDay.getFullYear();
		}
	};

	app.init();
})();