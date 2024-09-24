// chatbot-script.js (Client-Side)
document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const inputField = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSendBtn');

    // Function to add chatbot message to the chat
    function addChatbotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot-message';
        div.innerHTML = '<img src="images/chatbot.png" alt="Bot" class="message-icon bot-icon"><p>' + text + '</p>';
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom of the chat
    }

    // Function to add user message to the chat
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = '<img src="images/user.png" alt="User" class="message-icon user-icon"><p>' + text + '</p>';
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom of the chat
    }

    // Event listener for the Send button
    sendButton.addEventListener('click', function() {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            addUserMessage(userMessage);
            inputField.value = ''; // Clear the input field

            // Send the user message to the server
            fetch('http://localhost:3001/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                addChatbotMessage(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                addChatbotMessage("Sorry, I can't connect to the server right now.");
            });
        }
    });

    // Get the chatbot's greeting message when the page loads
    fetch('http://localhost:3001/chatbot/greet')
        .then(response => response.json())
        .then(data => {
            addChatbotMessage(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            addChatbotMessage("Sorry, I can't connect to the server right now.");
        });

    // Optional: Allow the user to send a message with the Enter key
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
