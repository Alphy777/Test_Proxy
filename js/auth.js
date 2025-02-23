document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ auth.js loaded");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const logoutBtn = document.getElementById("logout-btn");

    // Check if user is on the login page while already logged in
    if (window.location.pathname.includes('login.html') && localStorage.getItem("username")) {
        window.location.href = "message.html"; // Redirect to chat if already logged in
    }

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            let username = document.getElementById("signup_username").value.trim();
            let password = document.getElementById("signup_password").value.trim();
            let confirmPassword = document.getElementById("signup_password_re").value.trim();

            if (!username || !password || !confirmPassword) {
                alert("All fields are required.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                let response = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                let result = await response.json();
                if (response.ok) {
                    alert(result.status);
                    window.location.href = "login.html";
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Registration failed. Please try again.");
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            let username = document.getElementById("login_username").value.trim();
            let password = document.getElementById("login_password").value.trim();

            try {
                let response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                let result = await response.json();
                if (result.status === "Login successful") {
                    localStorage.setItem("username", result.username);
                    window.location.href = "message.html";
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Login failed. Please try again.");
            }
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function () {
            console.log("🔄 Logout button clicked");

            let username = localStorage.getItem("username");
            if (!username) {
                alert("You're not logged in!");
                return;
            }

            try {
                let response = await fetch("http://127.0.0.1:5000/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username })
                });

                let result = await response.json();
                
                if (response.ok) {
                    // Only remove the current user's session
                    if (localStorage.getItem("username") === username) {
                        localStorage.removeItem("username");
                        window.location.href = "login.html";
                    }
                } else {
                    alert("Logout failed. Please try again.");
                }
            } catch (error) {
                console.error("❌ Logout error:", error);
                alert("Logout failed. Please try again.");
            }
        });
    }
});