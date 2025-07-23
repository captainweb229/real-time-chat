const socket = io("https://real-time-chat-3-r8mm.onrender.com");
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let name = '';

document.addEventListener('DOMContentLoaded', () => {
  const nameScreen = document.getElementById('name-screen');
  const chatScreen = document.getElementById('chat-screen');
  const joinButton = document.getElementById('join-button');

  // Check localStorage for previously saved name
  const storedName = localStorage.getItem('chat-username');
  if (storedName) {
    name = storedName;
    nameScreen.style.display = 'none';
    chatScreen.style.display = 'block';
    appendMessage('You joined');
    socket.emit('new-user', name);
  }

  joinButton.addEventListener('click', () => {
    const nameInput = document.getElementById('name-input').value.trim();
    if (nameInput === '') {
      alert('Please enter your name');
      return;
    }

    name = nameInput;
    localStorage.setItem('chat-username', name);

    nameScreen.style.display = 'none';
    chatScreen.style.display = 'block';

    appendMessage('You joined');
    socket.emit('new-user', name);
  });

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === '') return;

    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  });

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

// Optional: Logout function to clear saved name
function logout() {
  localStorage.removeItem('chat-username');
  location.reload();
}
