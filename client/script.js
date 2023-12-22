(async () => {
  const myUser = await generateRandomUser();
  let activeUsers = [];
  let typingUsers = [];

  const socket = new WebSocket(generateBackendUrl());
  socket.addEventListener('open', () => {
    console.log('WebSocket connected!');
    socket.send(JSON.stringify({ type: 'newUser', user: myUser }));
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message:', message);
    
    switch (message.type) {
      case 'message':
        document.getElementById('userIsTexting').innerHTML = ''
        const messageElement = generateMessage(message, myUser);
        document.getElementById('messages').appendChild(messageElement);
        setTimeout(() => {
          messageElement.classList.add('opacity-100');
        }, 100);
        break;
      case 'activeUsers':
        activeUsers = message.users;
        updateActiveUsersUI(activeUsers);
        break;
      case 'typing':
        typingUsers = message.users;
        console.log(typingUsers)
        const textingBox = document.getElementById('userIsTexting')
        const textingMessage = `<p class= "text-sm font-bold text-white m-1">${myUser.name} Schreibt gerade</p>`
        textingBox.innerHTML = textingMessage
        break;
      default:
        break;
    }


  });
  socket.addEventListener('close', (event) => {
    console.log('WebSocket closed.');
  });
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  const updateActiveUsersUI = (users) => {
    const usersList = document.getElementById('active-users');
    users.forEach(user => {
      const userElement = document.createElement('li');
      userElement.textContent = user.name;
      usersList.appendChild(userElement);
    });
  };

  // Wait until the DOM is loaded before adding event listeners
  document.addEventListener('DOMContentLoaded', () => {
  // Event Listener für den Dark Mode Schalter
  const modeToggle = document.getElementById('modeToggle');
  modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
  
    // Send a message when the send button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    });
  });

  document.addEventListener('keydown', (event) => {

    // Only send if the typed in key is not a modifier key
    if (event.key.length === 1) {
      socket.send(JSON.stringify({ type: 'typing', user: myUser }));
    }
    // Only send if the typed in key is the enter key
    if (event.key === 'Enter') {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    }

    document.addEventListener('keydown', (event) => {
      console.log(typingUsers)
      // Only send if the typed in key is not a modifier key
      if (event.key.length === 1) {
        socket.send(JSON.stringify({ type: 'typing', user: myUser }));

      }
      // Only send if the typed in key is the enter key
      if (event.key === 'Enter') {
        const message = document.getElementById('messageInput').value;
        socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
        document.getElementById('messageInput').value = '';
        textingBox.innerHTML = ''
      }
    });
  });
})();
