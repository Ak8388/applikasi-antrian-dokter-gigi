document.getElementById('login-form').addEventListener('submit', async function (event) {
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

    try{
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/find-email?email=${em}`)
        .then(res=>{
            if(res.ok){
                throw new Error('error');
            }else{
                return res.json();
            }
        })
        .then(resData=>{
            const obj = { "name": nm, "email": em, "password": pass, "address": addrss, "role": "Patient" }
            if (em !== "") {
                localStorage.setItem("key","regist")
                localStorage.setItem("data",JSON.stringify(obj))
                localStorage.setItem("email",em)
                location.href = "../email_verify/email.html"
            }
        })
        
    }catch(error){
        console.log(error);
        showAlert('mohon maaf sepertinya email yang anda masukan sudah terdaftar');
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