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
    patientDisplay()
}
)

function patientDisplay() {
    const token = localStorage.getItem("token");
    const appPage = document.getElementById('appointments');
    const doctrorPage = document.getElementById('doctors');
    const patientPage = document.getElementById('patients');
    const dashPage = document.getElementById('dashboard');
    const schedulePgae = document.getElementById('schedule');
    dashPage.style.height = '0';
    schedulePgae.innerHTML = "";
    dashPage.innerHTML = "";
    patientPage.innerHTML = "";
    doctrorPage.innerHTML = "";
    appPage.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trowsH = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "Name";

    const th2 = document.createElement("th");
    th2.innerText = "Email";

    const th3 = document.createElement("th");
    th3.innerText = "Address";

    const th4 = document.createElement("th");
    th4.innerText = "Role";

    const th5 = document.createElement("th");
    th5.innerText = "Created";

    const th6 = document.createElement("th");
    th6.innerText = "last updated";

    const th7 = document.createElement("th");
    th7.innerText = "Action";

    patientPage.appendChild(table);
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
                tdata5.innerText = selisih + " days ago";

                const tdata6 = document.createElement("td");
                const tanggal2 = e.updateAt.split("T");
                const selisih2 = hitungSelisihHari(tanggal2[0], nDtae);
                tdata6.innerText = selisih2 + " days ago";

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

                btnDel.addEventListener("click", (e) => {
                    localStorage.setItem('email', trows.getAttribute('email'));
                    document.getElementById("confirmModal").style.display = "block";
                })
            })
        })
}

document.getElementById("doctors-page").addEventListener("click", (e) => {
    doctorDisplay()
}
)

function doctorDisplay(){
    const token = localStorage.getItem("token");
    const appPage = document.getElementById('appointments');
    const doctrorPage = document.getElementById('doctors');
    const patientPage = document.getElementById('patients');
    const dashPage = document.getElementById('dashboard');
    const schedulePgae = document.getElementById('schedule');
    dashPage.style.height = '0';
    schedulePgae.innerHTML = "";
    dashPage.innerHTML = "";
    patientPage.innerHTML = "";
    doctrorPage.innerHTML = "";
    appPage.innerHTML = "";

    const addCntr = document.createElement("div");
    addCntr.id = "add-doctors-cntr";

    const addIcons = document.createElement("img");
    addIcons.src = "../../assets/icons/add.png";
    addIcons.alt = "Add Icons";

    const textAdd = document.createElement("h4");
    textAdd.innerText = "Add Doctor";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trowsH = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "Name";

    const th2 = document.createElement("th");
    th2.innerText = "Email";

    const th3 = document.createElement("th");
    th3.innerText = "Address";

    const th4 = document.createElement("th");
    th4.innerText = "Role";

    const th5 = document.createElement("th");
    th5.innerText = "Created";

    const th6 = document.createElement("th");
    th6.innerText = "Last Updated";

    const th7 = document.createElement("th");
    th7.innerText = "Action";

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
                tdata5.innerText = selisih + " days ago";

                const tdata6 = document.createElement("td");
                const tanggal2 = e.updateAt.split("T");
                const selisih2 = hitungSelisihHari(tanggal2[0], nDtae);
                tdata6.innerText = selisih2 + " days ago";

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
                    doctorDisplay()
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
                        doctorDisplay();
                        doc.click();
                    }
                } else {
                    const pat = document.getElementById('patients');
                    if (pat) {
                        patientDisplay();
                        pat.click();
                    }
                }
                crdReg.classList.remove("sld-crd");
            })
    }
})

document.getElementById('dashboard-page').addEventListener('click', e => {
    Main();
})

document.getElementById('doctors-menu').addEventListener('click', e => {
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
            const dashPage = document.getElementById('dashboard');
            const schedulePgae = document.getElementById('schedule');
            dashPage.style.height = '0';
            schedulePgae.innerHTML = "";
            dashPage.innerHTML = "";
            patientPage.innerHTML = "";
            doctrorPage.innerHTML = "";
            appPage.innerHTML = "";

            data.Data.map(dataRes => {
                console.log(dataRes);
                const drCard = document.createElement('div');
                drCard.className = 'card-dr';
                appPage.appendChild(drCard);

                const drPhoto = document.createElement('img');
                drPhoto.src = "../../../" + dataRes.photos;
                drPhoto.alt = 'doctor photos';
                drCard.appendChild(drPhoto);

                const drName = document.createElement('h2');
                drName.innerText = dataRes.name;
                drCard.appendChild(drName);

                drCard.addEventListener('click', cardElement => {
                    localStorage.setItem('doc-id', dataRes.id);
                    console.log(dataRes.id);
                    document.getElementById('card-doc').style.display = 'block';
                })
            })
        })
})

function closeCard() {
    document.getElementById('card-doc').style.display = 'none';
}

async function Main() {
    const token = localStorage.getItem('token');
    const dash = document.getElementById('dashboard');
    const appPage = document.getElementById('appointments');
    const doctrorPage = document.getElementById('doctors');
    const patientPage = document.getElementById('patients');
    const schedulePgae = document.getElementById('schedule');
    dash.innerHTML = "";
    schedulePgae.innerHTML = "";
    patientPage.innerHTML = "";
    doctrorPage.innerHTML = "";
    appPage.innerHTML = "";
    dash.style.height = '100%';

    // Card Pasien
    const cardUser = document.createElement('div');
    cardUser.className = 'card';

    const cardUserIcon = document.createElement('div');
    cardUserIcon.className = 'icon';
    const iconUser = document.createElement('i');
    iconUser.className = 'fas fa-user';
    cardUserIcon.appendChild(iconUser);

    const detailsUser = document.createElement('div');
    detailsUser.className = 'details';
    const countUser = document.createElement('h3');
    countUser.id = 'userCount';
    const desUser = document.createElement('p');
    desUser.innerText = 'Number of patients';

    detailsUser.appendChild(countUser);
    detailsUser.appendChild(desUser);

    cardUser.appendChild(cardUserIcon);
    cardUser.appendChild(detailsUser);

    // Card Doctor
    const cardDoctor = document.createElement('div');
    cardDoctor.className = 'card';

    const cardDocIcon = document.createElement('div');
    cardDocIcon.className = 'icon';
    const iconDoc = document.createElement('i');
    iconDoc.className = 'fas fa-user-md';
    cardDocIcon.appendChild(iconDoc);

    const detailsDoctor = document.createElement('div');
    detailsDoctor.className = 'details';
    const countDoc = document.createElement('h3');
    countDoc.id = 'doctorCount';
    const desDoc = document.createElement('p');
    desDoc.innerText = 'Number of doctors';

    detailsDoctor.appendChild(countDoc);
    detailsDoctor.appendChild(desDoc);

    cardDoctor.appendChild(cardDocIcon);
    cardDoctor.appendChild(detailsDoctor);

    // Card Que
    const cardQueue = document.createElement('div');
    cardQueue.className = 'card';

    const cardQueueIcon = document.createElement('div');
    cardQueueIcon.className = 'icon';
    const iconQueue = document.createElement('i');
    iconQueue.className = 'fas fa-clipboard-list';

    cardQueueIcon.appendChild(iconQueue);

    const detailsQue = document.createElement('div');
    detailsQue.className = 'details';
    const countQue = document.createElement('h3');
    countQue.id = 'queueCount';
    const desQue = document.createElement('p');
    desQue.style.width = '100px';
    desQue.innerText = 'Number of queues month';

    detailsQue.appendChild(countQue);
    detailsQue.appendChild(desQue);

    cardQueue.appendChild(cardQueueIcon);
    cardQueue.appendChild(detailsQue);

    dash.appendChild(cardUser);
    dash.appendChild(cardDoctor);
    dash.appendChild(cardQueue);

    cardUser.addEventListener('click', e => {
        document.getElementById('patient-page').click();
        location.href = '#patients';
    })

    cardDoctor.addEventListener('click', e => {
        document.getElementById('doctors-page').click();
        location.href = '#doctors';
    })

    cardQueue.addEventListener('click', e => {
        document.getElementById('doctors-menu').click();
    })

    // Placeholder data, replace with real data fetching logic
    const data = {
        users: await CountDataPatient(token),
        doctors: await CountDataDoctor(token),
        queues: await CountDataQueue(token)
    };

    countUser.textContent = data.users;
    countDoc.textContent = data.doctors;
    countQue.textContent = data.queues;
}

async function CountDataPatient(token) {
    let totalData = 0;
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/count-data-user/Patient`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                totalData = resData.totalData;
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan server');
    }

    return totalData;
}

async function CountDataDoctor(token) {
    let totalData = 0;
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/count-data-user/Doctor`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                totalData = resData.totalData;
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan server');
    }

    return totalData;
}

async function CountDataQueue(token) {
    let totalData = 0;
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/count-queues`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                totalData = resData.totalData;
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan server');
    }

    return totalData;
}

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


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    tokenVerify(token);
    Main();
});

// Dialog Alert
document.getElementById("confirmYes").addEventListener("click", async function () {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // Lakukan tindakan penghapusan
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/users?email=${email}`, {
            method: 'DELETE',
            headers: {
                'Authorization': "Bearer " + token,
            },
        })
            .then(res => {
                if (res.status > 299) {
                    throw new Error("error");
                } else {
                    return res.json();
                }
            })
            .then(res => {
                localStorage.removeItem('email');
                alert("data successfully deleted");
                location.reload();
            })
    } catch (error) {
        document.getElementById("confirmModal").style.display = "none";
        showAlert('sorry there seems to be an error from the server side');
        return
    }


    document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("deletion canceled");
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

document.getElementById('setting').addEventListener('click', e => {
    document.querySelector('.card-setting').style.display = 'block';
})

function closeCardSetting() {
    // Implementasi untuk menutup card-setting
    document.querySelector('.card-setting').style.display = 'none';
}

function changePassword() {
    // Implementasi untuk mengubah kata sandi
    location.href = '../../auth/reset_password/reset_password.html';
    localStorage.setItem('start-page', '../../secound_page/admin/admin.html');
}

function changeEmail() {
    location.href = '../../auth/change_email/email.html';
}

function logOut() {
    localStorage.removeItem('token');
    location.href = '../../index.html';
}

function navigateTo(page) {
    window.location.href = page;
}