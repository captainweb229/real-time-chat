const socket = io("https://real-time-chat-3-r8mm.onrender.com");
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let name = '';

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const nameScreen = document.getElementById('name-screen');
  const chatScreen = document.getElementById('chat-screen');
  const joinButton = document.getElementById('join-button');

  joinButton.addEventListener('click', () => {
    const nameInput = document.getElementById('name-input').value.trim();
    if (nameInput === '') {
      alert('Please enter your name');
      return;
    }

    name = nameInput;

    // Show chat screen
    nameScreen.style.display = 'none';
    chatScreen.style.display = 'block';

    appendMessage('You joined');
    socket.emit('new-user', name);
  });

  // Message sending
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === '') return;

    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  });

  // Incoming messages
  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
  });

  socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
  });

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
  });
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
