function storeFormData(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById('user_name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const reason = document.getElementById("reason").value;
    const message = document.getElementById('messege').value;
    const formData = {
        userName: name,
        userEmail: email,   
        userMobile: mobile,
        userReason: reason,
        userMessage: message,

    };
    localStorage.setItem("contactForm", JSON.stringify(formData));

    // Redirect to display page
    window.location.href = "display.html";
}