// Durasi hitungan mundur dalam menit
const countdownMinutes = 4;

// Konversi durasi ke detik
let timeInSeconds = countdownMinutes * 60;

// Fungsi untuk memperbarui tampilan hitungan mundur
function updateCountdown() {
    // Hitung menit dan detik yang tersisa
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    // Format waktu untuk ditampilkan
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // Tampilkan waktu di elemen dengan id "countdown"
    document.getElementById('countdown').textContent = `${formattedMinutes}:${formattedSeconds}`;

    // Kurangi waktu dengan 1 detik
    timeInSeconds--;

    // Hentikan interval ketika waktu habis
    if (timeInSeconds < 0) {
        showAlert("waktu verifikasi email sudah habis silahkan verifikasi kembali");
        localStorage.setItem('act','discharged');
        localStorage.setItem("verifyCode", "")
        clearInterval(countdownInterval);
        countdownInterval=null; 
        return
    }
}

// Panggil fungsi updateCountdown setiap detik
let countdownInterval = setInterval(updateCountdown, 1000);

// Panggil fungsi updateCountdown sekali untuk menampilkan waktu awal

function Main(e) {
    let ky = localStorage.getItem("key")
    let em = localStorage.getItem("email")

    let obj = { "email": em, "rOn": ky }

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(obj),
    })
        .then(response => {
            if (response.status > 299) {
                if (ky == "regist") {
                    showAlert("mohon maaf atas ketidaknyamanannya mungkin ada sedikit masalah di server kami, mohon mencoba kembali beberapa saat lagi")

                    localStorage.removeItem("key")
                    localStorage.removeItem("email")

                    location.href = "../regist/regist.html"
                    return null
                } else {
                    showAlert("mohon maaf email yang anda masukan belum terdaftar")

                    localStorage.removeItem("key")
                    localStorage.removeItem("email")

                    location.href = "../login/forgot/forget_pass.html"
                    return null
                }
            } else {
                return response.json()
            }
        })
        .then(res => {
            localStorage.setItem("verifyCode", res.verifyCode)
            updateCountdown();
        })

}

Main()

document.getElementById("form-email").addEventListener("submit", async (e) => {
    e.preventDefault()

    // Get Verify Code
    const vC = document.getElementById("vC").value;
    const verifyC = localStorage.getItem("verifyCode");
    const ky = localStorage.getItem("key");
    
    if (verifyC == "") {
        if (ky == "regist") {
            localStorage.removeItem("verifyCode")
            localStorage.removeItem("key")
            localStorage.removeItem("data")
            
            location.href = "../regist/regist.html"
        } else if(ky == "change email"){
            localStorage.removeItem("verifyCode")
            localStorage.removeItem("key")
            localStorage.removeItem("data")

            location.href = "../change_email/email.html"
        }else {
            localStorage.removeItem("verifyCode")
            localStorage.removeItem("key")

            location.href = "../login/forgot_pass/forget_pass.html"
        }
    }
    
    
    if (vC == verifyC) {
        if (ky == "regist") {
            // Get Data Registration
            const data = localStorage.getItem("data");
            const obj = JSON.parse(data);
            try{
                await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/regist", {
                    method: "POST",
                    body: JSON.stringify(obj),
                })
                    .then(response => {
                        if (response.status > 299) {
                            throw new Error("pastikan data yang anda input benar dan email yang anda daftarkan belum terdaftar.");
                        } else {
                            return response.json();
                        }
                    })
                    .then(response => {
                        showAlert2("Verifikasi akun telah berhasil, halaman akan otomatis di alihkan ke halaman login setelah 5 detik")
                        setTimeout(() => {
                            location.href = "../login/login.html"
                        }, 4000)
                    })
            }catch(error){
                showAlert(error)
            }
            
        } else if(ky == "change email") {
            const token = localStorage.getItem('token');
            const data = localStorage.getItem("data");
            const obj = JSON.parse(data);
            try{
                await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/emails", {
                    method: "PUT",
                    body: JSON.stringify(obj),
                    headers:{
                        "Authorization":"Bearer "+token
                    }

                })
                    .then(response => {
                        if (response.status > 299) {
                            throw new Error("pastikan data yang anda input benar dan email yang anda daftarkan belum terdaftar.");
                        } else {
                            return response.json();
                        }
                    })
                    .then(response => {
                        localStorage.setItem('act','changeEmail');
                        showAlert2("perubahan email berhasil, mohon untuk login ulang");
                    })
            }catch(error){
                showAlert(error)
            }
        }else{

        }
    }
})

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

function showAlert2(text) {
    document.getElementById('text-alert2').innerText = text;
    document.getElementById('overlay2').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    const act = localStorage.getItem('act');
    localStorage.removeItem('act');

    if(act == "discharged"){
        location.href='../login/login.html';
    }
    document.getElementById('overlay').classList.remove('show');
}

function closeAlert2() {
    const act = localStorage.getItem('act');
    localStorage.removeItem('act');
    if(act == "changeEmail"){
        localStorage.removeItem('token');
        location.href = '../../index.html';
    }

    document.getElementById('overlay2').classList.remove('show');
}