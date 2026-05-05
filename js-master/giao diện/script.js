document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        message.textContent = "Đăng nhập thành công!";
        message.style.color = "green";
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    } else {
        message.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
        message.style.color = "red";
    }
});
document.getElementById("registerBtn").addEventListener("click", function() {
    window.location.href = "register.html";
});