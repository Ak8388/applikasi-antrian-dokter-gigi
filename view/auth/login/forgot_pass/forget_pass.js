document.getElementById("form-email").addEventListener("submit", (e) => {
    e.preventDefault()

    let em = document.getElementById("email").value;

    if (em !== "") {
       localStorage.setItem("email",em)
       localStorage.setItem("key","not regist")
       location.href="../.././email_verify/email.html"
    }

})

// Script Alert
function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}