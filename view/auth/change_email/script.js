document.getElementById("form-email").addEventListener("click", async (e) => {
    e.preventDefault()
    
    let em = document.getElementById("email").value;
    const obj = {'newEmail':em}

    try{
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/find-email?email=${em}`)
        .then(res=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error('error');
            }
        })
        .then(resData=>{
            showAlert('mohon maaf sepertinya email anda sudah terdaftar');
        })
    }catch(error){
        if (em !== "") {
           localStorage.setItem("email",em)
           localStorage.setItem("data",JSON.stringify(obj));
           localStorage.setItem("key","change email");
           location.href ='../email_verify/email.html';
        }
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