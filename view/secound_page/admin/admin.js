function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    if (sidebar.style.left === '-300px') {
        sidebar.style.left = '0px';
        content.style.marginLeft = '230px';
        content.style.width = 'calc(100% - 230px)';
    } else {
        sidebar.style.left = '-300px';
        content.style.marginLeft = '0';
        content.style.width = '100%';
    }
}

document.getElementById("patient-page").addEventListener("click", (e) => {
    const token = localStorage.getItem("token");
    const patient = document.getElementById("patients");
    const appPage = document.getElementById('appointments');
    const doctrorPage = document.getElementById('doctors');
    doctrorPage.innerHTML = "";
    appPage.innerHTML = "";
    patient.innerHTML = " ";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trowsH = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "#Name";

    const th2 = document.createElement("th");
    th2.innerText = "Email";

    const th3 = document.createElement("th");
    th3.innerText = "Address";

    const th4 = document.createElement("th");
    th4.innerText = "Role";

    const th5 = document.createElement("th");
    th5.innerText = "Dibuat";

    const th6 = document.createElement("th");
    th6.innerText = "Terakhir di update";

    const th7 = document.createElement("th");
    th7.innerText = "#";

    patient.appendChild(table);
    table.appendChild(thead);
    thead.appendChild(trowsH);
    trowsH.appendChild(th1);
    trowsH.appendChild(th2);
    trowsH.appendChild(th3);
    trowsH.appendChild(th4);
    trowsH.appendChild(th5);
    trowsH.appendChild(th6);
    trowsH.appendChild(th7);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/find-user-by-role/Patient", {
        headers: {
            "Authorization": token,
        }
    })
        .then(response => {
            if (response.status > 299) {
                showAlert("mohon maaf sepertinya ada kesalahan di sisi server, mohon tunggu beberapa menit dan refresh kembali halaman ini.");
                return
            } else {
                return response.json();
            }
        })
        .then(res => {
            res.Data.map((e) => {
                const trows = document.createElement("tr");
                trows.setAttribute('name', e.name);
                trows.setAttribute('email', e.email);
                trows.setAttribute('address', e.address);
                trows.setAttribute('role', e.role);

                const tdata1 = document.createElement("td");
                tdata1.innerText = e.name;

                const tdata2 = document.createElement("td");
                tdata2.innerText = e.email;

                const tdata3 = document.createElement("td");
                tdata3.innerText = e.address;

                const tdata4 = document.createElement("td");
                tdata4.innerText = e.role;

                const nDtae = new Date();
                const tdata5 = document.createElement("td");
                const tanggal1 = e.createdAt.split("T");
                const selisih = hitungSelisihHari(tanggal1[0], nDtae);
                tdata5.innerText = selisih + " hari yang lalu";

                const tdata6 = document.createElement("td");
                const tanggal2 = e.updateAt.split("T");
                const selisih2 = hitungSelisihHari(tanggal2[0], nDtae);
                tdata6.innerText = selisih2 + " hari yang lalu";

                const tdAcction = document.createElement("td");
                tdAcction.style.display = 'flex';
                tdAcction.style.alignItems = 'center';
                tdAcction.style.justifyContent = 'center';

                const btnDel = document.createElement("button");
                btnDel.id = "btn-del";
                const btnEdit = document.createElement("button");
                btnEdit.id = "btn-edit"

                tbody.appendChild(trows);
                trows.appendChild(tdata1);
                trows.appendChild(tdata2);
                trows.appendChild(tdata3);
                trows.appendChild(tdata4);
                trows.appendChild(tdata5);
                trows.appendChild(tdata6);
                trows.appendChild(tdAcction);
                tdAcction.appendChild(btnDel);
                tdAcction.appendChild(btnEdit);

                btnEdit.addEventListener("click", (e) => {
                    let crdReg = document.getElementById('form-reg');

                    const name = document.getElementById('name').value = trows.getAttribute('name');
                    const address = document.getElementById('address').value = trows.getAttribute('address');
                    const role = document.getElementById('role').value = trows.getAttribute('role');

                    const passInp = document.getElementById("password");
                    const emailInp = document.getElementById('email');

                    passInp.removeAttribute('required');
                    emailInp.value = trows.getAttribute('email');

                    localStorage.setItem("rOu", "edit");
                    localStorage.setItem("identity", "patients");

                    if (window.getComputedStyle(crdReg).left === '-300px') {
                        emailInp.setAttribute('disabled', 'true');
                        passInp.setAttribute('disabled', 'true');
                        crdReg.classList.add("sld-crd");
                    } else {
                        passInp.removeAttribute('disabled');
                        emailInp.removeAttribute('disabled');
                        name.value = ' ';
                        address.value = ' ';
                        role.value = ' ';
                        localStorage.removeItem("updateData");
                        crdReg.classList.remove("sld-crd");
                    }

                })
            })
        })
}
)

document.getElementById("doctors-page").addEventListener("click", (e) => {
    const token = localStorage.getItem("token");
    const appPage = document.getElementById('appointments');
    const patientPage = document.getElementById('patients');
    const doctors = document.getElementById("doctors");
    patientPage.innerHTML = "";
    appPage.innerHTML = "";
    doctors.innerHTML = " ";

    const addCntr = document.createElement("div");
    addCntr.id = "add-doctors-cntr";

    const addIcons = document.createElement("img");
    addIcons.src = "../../assets/icons/add.png";
    addIcons.alt = "Add Icons";

    const textAdd = document.createElement("h4");
    textAdd.innerText = "Tambah Dokter";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trowsH = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "#Name";

    const th2 = document.createElement("th");
    th2.innerText = "Email";

    const th3 = document.createElement("th");
    th3.innerText = "Address";

    const th4 = document.createElement("th");
    th4.innerText = "Role";

    const th5 = document.createElement("th");
    th5.innerText = "Dibuat";

    const th6 = document.createElement("th");
    th6.innerText = "Terakhir di update";

    const th7 = document.createElement("th");
    th7.innerText = "#";

    doctors.appendChild(addCntr);
    addCntr.appendChild(addIcons);
    addCntr.appendChild(textAdd);

    doctors.appendChild(table);
    table.appendChild(thead);
    thead.appendChild(trowsH);
    trowsH.appendChild(th1);
    trowsH.appendChild(th2);
    trowsH.appendChild(th3);
    trowsH.appendChild(th4);
    trowsH.appendChild(th5);
    trowsH.appendChild(th6);
    trowsH.appendChild(th7);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/find-user-by-role/Doctor", {
        headers: {
            "Authorization": token,
        }
    })
        .then(response => {
            if (response.status > 299) {
                showAlert("mohon maaf sepertinya ada kesalahan di sisi server, mohon tunggu beberapa menit dan refresh kembali halaman ini.");
                return
            } else {
                return response.json();
            }
        })
        .then(res => {
            res.Data.map((e) => {
                const trows = document.createElement("tr");
                trows.setAttribute('name', e.name);
                trows.setAttribute('email', e.email);
                trows.setAttribute('address', e.address);
                trows.setAttribute('role', e.role);

                const tdata1 = document.createElement("td");
                tdata1.innerText = e.name;

                const tdata2 = document.createElement("td");
                tdata2.innerText = e.email;

                const tdata3 = document.createElement("td");
                tdata3.innerText = e.address;

                const tdata4 = document.createElement("td");
                tdata4.innerText = e.role;

                const nDtae = new Date();
                const tdata5 = document.createElement("td");
                const tanggal1 = e.createdAt.split("T");
                const selisih = hitungSelisihHari(tanggal1[0], nDtae);
                tdata5.innerText = selisih + " hari yang lalu";

                const tdata6 = document.createElement("td");
                const tanggal2 = e.updateAt.split("T");
                const selisih2 = hitungSelisihHari(tanggal2[0], nDtae);
                tdata6.innerText = selisih2 + " hari yang lalu";

                const tdAcction = document.createElement("td");
                tdAcction.style.display = 'flex';
                tdAcction.style.alignItems = 'center';
                tdAcction.style.justifyContent = 'center';

                const btnDel = document.createElement("button");
                btnDel.id = "btn-del";
                const btnEdit = document.createElement("button");
                btnEdit.id = "btn-edit"

                tbody.appendChild(trows);
                trows.appendChild(tdata1);
                trows.appendChild(tdata2);
                trows.appendChild(tdata3);
                trows.appendChild(tdata4);
                trows.appendChild(tdata5);
                trows.appendChild(tdata6);
                trows.appendChild(tdAcction);
                tdAcction.appendChild(btnDel);
                tdAcction.appendChild(btnEdit);

                btnEdit.addEventListener("click", (e) => {
                    let crdReg = document.getElementById('form-reg');

                    const name = document.getElementById('name').value = trows.getAttribute('name');
                    const address = document.getElementById('address').value = trows.getAttribute('address');
                    const role = document.getElementById('role').value = trows.getAttribute('role');

                    const passInp = document.getElementById("password");
                    const emailInp = document.getElementById('email');
                    emailInp.value = trows.getAttribute('email');

                    localStorage.setItem("rOu", "edit");
                    localStorage.setItem("identity", "doctor");

                    passInp.removeAttribute('required');

                    if (window.getComputedStyle(crdReg).left === '-300px') {
                        emailInp.setAttribute('disabled', 'true');
                        passInp.setAttribute('disabled', 'true');
                        crdReg.classList.add("sld-crd");
                    } else {
                        passInp.removeAttribute('disabled');
                        emailInp.removeAttribute('disabled');
                        name.value = ' ';
                        address.value = ' ';
                        role.value = ' ';
                        crdReg.classList.remove("sld-crd");
                    }
                })

                btnDel.addEventListener("click", (e) => {
                    localStorage.setItem('email', trows.getAttribute('email'));
                    document.getElementById("confirmModal").style.display = "block";
                })
            })
        })

    addCntr.addEventListener("click", e => {
        let crdReg = document.getElementById('form-reg');
        localStorage.setItem("rOu", "regist");

        const name = document.getElementById('name')
        const address = document.getElementById('address')
        const email = document.getElementById('email')
        const passInp = document.getElementById("password");
        const role = document.getElementById('role')

        name.setAttribute('required', 'true');
        address.setAttribute('required', 'true');
        email.setAttribute('required', 'true');
        passInp.setAttribute('required', 'true');
        role.setAttribute('required', 'true');

        name.value = '';
        address.value = '';
        passInp.value = '';
        email.value = '';
        role.value = 'Doctor';

        if (window.getComputedStyle(crdReg).left === '-300px') {
            passInp.removeAttribute('disabled');
            email.removeAttribute('disabled');

            crdReg.classList.add("sld-crd");
        } else {
            crdReg.classList.remove("sld-crd");
        }
    })


}
)

document.getElementById("form-rgistri").addEventListener("submit", e => {
    e.preventDefault()
    const token = localStorage.getItem('token');
    const name = document.getElementById("name").value;
    const pass = document.getElementById('password').value;
    const email = document.getElementById("email").value;
    const address = document.getElementById('address').value;
    const role = document.getElementById("role").value;

    const rOu = localStorage.getItem("rOu");
    const formData = new FormData();

    const crdReg = document.getElementById('form-reg')

    if (rOu == "regist") {
        const obj = {
            'doctor': {
                'name': name,
                'password': pass,
                'email': email,
                'address': address,
                'role': role
            },
            'doctorDetail': {}
        };

        formData.append('photos', ' ');
        formData.append('json', JSON.stringify(obj));

        try {
            fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/doctors', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                },
                body: formData,
            })
                .then(response => {
                    if (response.status > 299) {
                        return new Error('mohon maaf sepertinya ada kesalah di sisi server')
                    } else {
                        return response.json()
                    }
                })
                .then(res => {
                    const doc = document.getElementById('doctors');
                    doc.click();
                    crdReg.classList.remove("sld-crd");
                })
        } catch (error) {
            console.log(error)
        }

    } else {
        const obj = { 'name': name, 'password': pass, 'email': email, 'address': address, 'role': role }
        fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users?email=${email}`, {
            method: 'PUT',
            headers: {
                "Authorization": token
            },
            body: JSON.stringify(obj),
        })
            .then(response => {
                if (response.status > 299) {
                    return showAlert('mohon maaf sepertinya ada kesalahan di sisi server, mohon ntuk menunggu')
                } else {
                    return response.json()
                }
            })
            .then(res => {
                const identifikasi = localStorage.getItem('identity');

                if (identifikasi == 'doctor') {
                    const doc = document.getElementById('doctors');
                    if (doc) {
                        doc.click();
                    }
                } else {
                    const pat = document.getElementById('patients');
                    if (pat) {
                        pat.click();
                    }
                }
                crdReg.classList.remove("sld-crd");
            })
    }
})

document.getElementById('appoitments-page').addEventListener('click', e => {
    const token = localStorage.getItem('token');
    tokenVerify(token);

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/doctors", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) {
                return showAlert('mohon maaf sepertinya ada kesalahan dari sisi server');
            } else {
                return res.json()
            }
        })
        .then(data => {
            const appPage = document.getElementById('appointments');
            const doctrorPage = document.getElementById('doctors');
            const patientPage = document.getElementById('patients');
            patientPage.innerHTML = "";
            doctrorPage.innerHTML = "";
            appPage.innerHTML = "";
            data.Data.map(dataRes => {
                console.log(dataRes);
                const drCard = document.createElement('div');
                drCard.className = 'card-dr';
                appPage.appendChild(drCard);

                const drPhoto = document.createElement('img');
                drPhoto.src = dataRes.photos;
                drPhoto.alt = 'doctor photos';
                drCard.appendChild(drPhoto);

                const drName = document.createElement('h2');
                drName.innerText = dataRes.name;
                drCard.appendChild(drName);

                drCard.addEventListener('click',cardElement=>{
                    localStorage.setItem('doc-id',dataRes.doctorId)
                    location.href = './appoitment/appoitment.html'
                })
            })
        })
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

function hitungSelisihHari(tanggal1, tanggal2) {
    // Buat objek Date untuk kedua tanggal
    const date1 = new Date(tanggal1);
    const date2 = new Date(tanggal2);

    // Dapatkan nilai milidetik dari kedua tanggal
    const time1 = date1.getTime();
    const time2 = date2.getTime();

    // Hitung selisih milidetik
    const selisihMilidetik = Math.abs(time2 - time1);

    // Konversi milidetik ke hari (1 hari = 24 jam * 60 menit * 60 detik * 1000 milidetik)
    const selisihHari = Math.ceil(selisihMilidetik / (1000 * 60 * 60 * 24));

    return selisihHari;
}

function convertPxToPercent(pxValue, parentSize) {
    return (pxValue / parentSize) * 100;
}

// Dialog Alert
document.getElementById("confirmYes").addEventListener("click", function () {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // Lakukan tindakan penghapusan
    fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users?email=${email}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token,
        },
    })
        .then(res => {
            if (res.status > 299) {
                showAlert('mohon maaf sepertinya ada kesalahan dari sisi server');
                return
            } else {
                return res.json();
            }
        })
        .then(res => {
            localStorage.removeItem('email');
            alert("Data telah berhasil dihapus");
        })


    document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("Penghapusan dibatalkan");
    document.getElementById("confirmModal").style.display = "none";
});

// Menutup modal jika pengguna mengklik di luar modal
window.onclick = function (event) {
    if (event.target == document.getElementById("confirmModal")) {
        document.getElementById("confirmModal").style.display = "none";
    }
}

function tokenVerify(token) {
    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/verify", {
        headers: {
            "Authorization": "Bearer " + token,
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                showAlert("maaf sesi anda sudah habis");
                setTimeout(() => {
                    window.location.href = "../../index.html";
                }, 5000)
            }
        })
}