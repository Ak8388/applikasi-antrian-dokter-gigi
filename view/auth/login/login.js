document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah pengiriman form secara default

    // Mendapatkan nilai dari form
    var em = document.getElementById('email').value;
    var pass = document.getElementById('pass').value;

    const obj = { "email": em, "password": pass }

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.status > 299) {
                return showAlert("pastikan email atau password yang anda masukan benar!")
            }else{
               return response.json()
            }
        }
        )
        .then(response => {
            localStorage.setItem("token", response.Data.token)
            localStorage.setItem('role',response.role)
            if (response.role == "Patient") {
                window.location.href = "../../secound_page/for_patient/patient_page.html"
            } else if (response.role == "Doctor") {
                window.location.href = "../../secound_page/doctor/doctor.html"
            }else{
                window.location.href = "../../secound_page/admin/admin.html"
            }
        })
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