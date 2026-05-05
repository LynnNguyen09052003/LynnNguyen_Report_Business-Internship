document.getElementById("registerBtn").addEventListener("click", function() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("message");

    if (!username || !password || !confirmPassword) {
        message.textContent = "Vui lòng nhập đầy đủ thông tin.";
        message.style.color = "red";
        return;
    }

    if (password.length < 6) {
        message.textContent = "Mật khẩu phải từ 6 ký tự trở lên.";
        message.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Mật khẩu nhập lại không khớp!";
        message.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const isExist = users.some(user => user.username === username);

    if (isExist) {
        message.textContent = "Tên đăng nhập đã tồn tại!";
        message.style.color = "red";
        return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Đăng ký thành công! Chuyển về trang đăng nhập...";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
});

document.getElementById("cancelBtn").addEventListener("click", function() {
    window.location.href = "index.html";
});