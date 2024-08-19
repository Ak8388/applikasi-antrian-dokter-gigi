async function main() {
    const data = await jadwalData();
    const name = await drName();
    showSchedule(data, name);
}

const filterHari = document.getElementById('days-filter');
const scheduleTable = document.getElementById('tableBody');

const jadwalData = async (e) => {
    const token = localStorage.getItem('token');
    tokenVerify(token);
    const id = localStorage.getItem('doc-id');
    console.log(id);
    let data = {}
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/dr-schedules?drId=${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error");
                } else {
                    return res.json();
                }
            })
            .then(dataResponse => {
                data = dataResponse.Data;
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan')
    }
    return data;
};

// get doctor name 
const drName = async () => {
    const token = localStorage.getItem('token');
    tokenVerify(token);
    const id = localStorage.getItem('doc-id');
    let data = {}
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/doctors?id=${id}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error");
                } else {
                    return res.json();
                }
            })
            .then(dataResponse => {
                data = dataResponse.data.name;
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan');
        return
    }

    return data;
}

// Fungsi untuk menampilkan jadwal
async function showSchedule(data, name) {
    scheduleTable.innerHTML = ''; // Hapus data lama
    try {
        data.map(schedule => {
            let timeClose = schedule.closingHours.split("T");
            let timOpen = schedule.openingHours.split("T");
            const timeCloseFix = timeClose[1].replace(":00Z", "");
            const timeOpenFix = timOpen[1].replace(":00Z", "");
            const time = timeOpenFix + " - " + timeCloseFix;

            const trows = document.createElement('tr');

            const drName = document.createElement('td');
            console.log(schedule);
            drName.innerText = name;

            const days = document.createElement('td');
            days.innerText = schedule.days;

            const timeElm = document.createElement('td');
            timeElm.innerText = time;

            const imgEdit = document.createElement('img');
            imgEdit.src = '../../../assets/icons/edit.png';

            const imgDelete = document.createElement('img');
            imgDelete.src = '../../../assets/icons/delete.png';

            const act = document.createElement('td');
            act.className = 'action-data';

            act.appendChild(imgEdit);
            act.appendChild(imgDelete);

            scheduleTable.appendChild(trows);
            trows.appendChild(drName);
            trows.appendChild(days);
            trows.appendChild(timeElm);
            trows.appendChild(act);

            imgEdit.addEventListener('click', e => {
                const cardEdit = document.getElementById('card-sche');
                localStorage.setItem('id-schedule', schedule.id);
                localStorage.setItem('actionSche', 'edit');
                document.getElementById('day').value = schedule.days;
                document.getElementById('openingHours').value = timeOpenFix;
                document.getElementById('closingHours').value = timeCloseFix;
                cardEdit.style.display = 'block';
                document.getElementById('add-btn').innerText = 'Edit';
            })

            imgDelete.addEventListener('click', e => {
                localStorage.setItem('id-schedule', schedule.id);
                document.getElementById('confirmModal').style.display = 'block';
            })
        })
    } catch (error) {
        showAlert(error)
    }
}

filterHari.addEventListener('change', async () => {
    const dayFilter = filterHari.value;
    const data = await jadwalData();
    const name = await drName();
    const filteredData = dayFilter === '' ? data : data.filter(schedule => schedule.days === dayFilter);
    showSchedule(filteredData, name);
});

main()

document.getElementById('cancelBtn').addEventListener('click', e => {
    document.getElementById('card-sche').style.display = 'none';
})

document.getElementById('btn-add').addEventListener('click', e => {
    localStorage.setItem('actionSche', 'add');
    document.getElementById('add-btn').innerText = 'Add';
    document.getElementById('card-sche').style.display = 'block';
})

document.getElementById('add-btn').addEventListener('click', async e => {
    e.preventDefault()
    let timeLayout = "0000-01-01 08:00:00";
    const action = localStorage.getItem('actionSche');
    const token = localStorage.getItem('token');
    const days = document.getElementById('day').value;
    const openingHours = document.getElementById('openingHours').value;
    const closingHours = document.getElementById('closingHours').value;
    const openingTime = timeLayout.replace("08:00", openingHours);
    const closeTime = timeLayout.replace("08:00", closingHours);
    const docId = localStorage.getItem('doc-id');

    if (action == 'edit') {
        const id = localStorage.getItem('id-schedule');
        const obj = { 'id': id, 'days': days, 'openingHours': openingTime, 'closingHours': closeTime }
        try {
            await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules?doc-id=${docId}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(obj)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('error');
                    } else {
                        return res.json();
                    }
                })
                .then(dataRes => {
                    const textCek = document.getElementById('closeIcons');
                    textCek.innerText = '✓';
                    textCek.style.color = 'white';
                    showAlert('data berhasil di di ubah');
                })
        } catch (error) {
            showAlert("mohon maaf mohon masukan data dengan valid");
        }
    } else {
        try {
            const obj = {'days': days, 'openingHours': openingTime, 'closingHours': closeTime }
            await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules?doc-id=${docId}`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(obj)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.status);
                    } else {
                        return res.json();
                    }
                })
                .then(dataRes => {
                    const textCek = document.getElementById('closeIcons');
                    textCek.innerText = '✓';
                    textCek.style.color = 'white';
                    showAlert('data berhasil di tambahkan');
                })
        } catch (err) {
            console.log(err);
            showAlert("mohon maaf mohon masukan data dengan valid");
        }
    }

    document.getElementById('card-sche').style.display = 'none';
})

document.getElementById("confirmYes").addEventListener("click", async function () {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id-schedule');

    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/${id}`, {
            method: "DELETE",
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
            .then(dataRes => {
                document.getElementById('closeIcons').innerText = '✓';
                showAlert("hapus data jadwal berhasil");
                document.getElementById('confirmModal').style.display = 'none';
            })
    } catch (error) {
        showAlert('mohon maaf sepertinya ada antrian di jadwal ini yang belum di selesaikan');
        document.getElementById('confirmModal').style.display = 'none';
    }
});

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("Penghapusan dibatalkan");
    document.getElementById("confirmModal").style.display = "none";
});

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
                showAlert("maaf sesi anda sudah habis")
                setTimeout(() => {
                    window.location.href = "../../index.html";
                }, 5000)
            }
        })
}

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}