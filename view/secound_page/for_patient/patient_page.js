function main(){
    const token = localStorage.getItem('token');
    console.log(token);
    tokenVerify(token);
}

main()

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}

function tokenVerify(token){
    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/verify",{
        headers:{
            "Authorization":"Bearer "+token,
        }
    })
    .then(res=>{
        if(res.ok){
            return res.json()
        }else{
            showAlert("maaf sesi anda sudah habis");
            setTimeout(()=>{
                window.location.href="../../index.html";
            },5000) 
        }
    })
}