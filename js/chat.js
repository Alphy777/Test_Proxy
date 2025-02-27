document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const usersList = document.getElementById("active-users");
    const chatBox = document.getElementById("chatBox");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    let selectedUser = null;

    if (!username) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("username").innerText = username;

    function fetchActiveUsers() {
        fetch("http://127.0.0.1:5000/active-users")
            .then(response => response.json())
            .then(users => {
                usersList.innerHTML = "";
                users.forEach(user => {
                    if (user !== username) {
                        let li = document.createElement("li");
                        li.innerText = user;
                        li.classList.add("user-item");
                        li.onclick = () => startChat(user);
                        usersList.appendChild(li);
                    }
                });
            })
            .catch(err => console.error("Error loading active users:", err));
    }

    function startChat(user) {
        selectedUser = user;
        chatBox.innerHTML = `<h4>Chat with ${user}</h4>`;
        fetchMessages();
    }

    function fetchMessages() {
        if (!selectedUser) return;
        fetch(`http://127.0.0.1:5001/get-messages/${username}`)
            .then(response => response.json())
            .then(messages => {
                chatBox.innerHTML = "";
                messages.forEach(msg => {
                    if (msg.sender === username && msg.receiver === selectedUser ||
                        msg.sender === selectedUser && msg.receiver === username) {
                        let messageElement = document.createElement("p");
                        messageElement.innerText = `${msg.sender}: ${msg.message}`;
                        chatBox.appendChild(messageElement);
                    }
                });
            })
            .catch(err => console.error("Error loading messages:", err));
    }

    sendBtn.addEventListener("click", function () {
        if (!selectedUser) {
            alert("Select a user to chat with first.");
            return;
        }

        let message = messageInput.value.trim();
        if (!message) return;

        fetch("http://127.0.0.1:5001/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: username, receiver: selectedUser, message })
        })
        .then(response => response.json())
        .then(() => {
            messageInput.value = "";
            fetchMessages();
        })
        .catch(err => console.error("Error sending message:", err));
    });

    fetchActiveUsers();
    setInterval(fetchActiveUsers, 5000);
    setInterval(fetchMessages, 3000);
});
