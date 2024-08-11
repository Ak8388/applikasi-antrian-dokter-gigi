
function togglePasswordVisibility(fieldId) {
    const inputField = document.getElementById(fieldId);
    const icon = document.getElementById(`${fieldId}-icon`);
    if (inputField.type === 'password') {
        inputField.type = 'text';
        icon.src = 'https://img.icons8.com/ios-filled/50/000000/invisible.png';
    } else {
        inputField.type = 'password';
        icon.src = 'https://img.icons8.com/ios-filled/50/000000/visible.png';
    }
}

document.getElementById('conf-btn').addEventListener('click',e=>{
    const newPass = document.getElementById('new-password').value;
    const oldPass = document.getElementById('old-password').value;
    try{
        if(newPass === oldPass){
            throw new Error('new password and old password must be deferent');
        }
        document.getElementById('confirmModal').style.display = 'block';
    }catch(error){
        showAlert(error);
    }

})

function cancelReset() {
    document.getElementById('reset-password-form').reset();
    document.getElementById('old-password-icon').src = 'https://img.icons8.com/ios-filled/50/000000/visible.png';
    document.getElementById('new-password-icon').src = 'https://img.icons8.com/ios-filled/50/000000/visible.png';
    const pageStart = localStorage.getItem('start-page');
    localStorage.removeItem('start-page');
    location.href=pageStart;
}

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    const ok = localStorage.getItem('changePass');
    if(ok=='ok'){
        localStorage.removeItem('changePass');
        location.href='../../index.html'
    }
    document.getElementById('overlay').classList.remove('show');
}

document.getElementById("confirmYes").addEventListener("click", async function () {
    const token = localStorage.getItem('token');
    const newPass = document.getElementById('new-password').value;
    const oldPass = document.getElementById('old-password').value;
    const objChangePass = {'oldPass':oldPass,'newPass':newPass}
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body:JSON.stringify(objChangePass),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(dataRes => {
                document.getElementById('closeIcons').innerText = '✓';
                localStorage.setItem('changePass','ok');
                showAlert("update password berhasil, mohon untuk login ulang");
                document.getElementById('confirmModal').style.display = 'none';
            })
    } catch (error) {
        showAlert('pastikan password sudah di isi dengan benar');
        document.getElementById('confirmModal').style.display = 'none';
    }
});

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("ubah password dibatalkan");
    document.getElementById("confirmModal").style.display = "none";
});