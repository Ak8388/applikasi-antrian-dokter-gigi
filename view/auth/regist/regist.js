document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah pengiriman form secara default
    
    // Mendapatkan nilai dari form
    var nm = document.getElementById('name').value;
    var em = document.getElementById('email').value;
    var addrss = document.getElementById('address').value;
    var pass = document.getElementById('pass').value;
    var passConf = document.getElementById('passConf').value;

    if (pass != passConf) {
        showAlert('Password dan Konfirmasi password tidak cocok')
        return
    }

    const obj = { "name": nm, "email": em, "password": pass, "address": addrss, "role": "Patient" }
    if (em !== "") {
        localStorage.setItem("key","regist")
        localStorage.setItem("data",JSON.stringify(obj))
        localStorage.setItem("email",em)
        location.href = "../email_verify/email.html"
    }

});

// Script Alert
function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}