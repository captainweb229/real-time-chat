const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let name = ''

function joinChat() {
  const nameInput = document.getElementById('name-input').value.trim()
  if (nameInput === '') {
    alert('Please enter your name')
    return
  }

  name = nameInput

  document.getElementById('name-screen').style.display = 'none'
  document.getElementById('chat-screen').style.display = 'block'

  appendMessage('You joined')
  socket.emit('new-user', name)
}

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
  messageContainer.scrollTop = messageContainer.scrollHeight // Auto-scroll
}
document.addEventListener('DOMContentLoaded', () => {
  const joinBtn = document.getElementById('join-btn');
  joinBtn.addEventListener('click', joinChat);
});

window.joinChat = joinChat; // Optional now, but still okay
