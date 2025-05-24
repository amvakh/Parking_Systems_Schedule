function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();
  
    if (message !== "") {
      appendMessage("You", message, true);
      setTimeout(function() {
        receiveMessage("Friend", "Hi there!");
      }, 1000); // Simulating receiving a message after 1 second
      messageInput.value = "";
      messageInput.focus();
    }
  }

  //add functionality to send message when we hit enter too
  
  function receiveMessage(sender, message) {
    appendMessage(sender, message, false);
  }
  
  function appendMessage(sender, message, isCurrentUser) {
    var chatBox = document.getElementById("chat-box");
    var chatBubble = document.createElement("div");
    chatBubble.className = "chat-bubble" + (isCurrentUser ? " user-bubble" : " friend-bubble");
    
    // Create elements for sender name and message content
    var senderNameElement = document.createElement("div");
    senderNameElement.className = "sender-name";
    senderNameElement.textContent = sender + ":";
    
    var messageContentElement = document.createElement("div");
    messageContentElement.textContent = message;
    
    // Append sender name and message content to chat bubble
    chatBubble.appendChild(senderNameElement);
    chatBubble.appendChild(messageContentElement);
    
    // Append chat bubble to chat box
    chatBox.appendChild(chatBubble);
    
    // Scroll to bottom of chat box
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  