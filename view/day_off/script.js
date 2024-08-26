document.addEventListener("DOMContentLoaded", async function () {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const tableBody = document.querySelector('#daysOffTable tbody');
    let disabledDates = [];
    let url = '';
    if (role == 'Admin') {
        const docId = localStorage.getItem('docId');
        url = `http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off?docId=${docId}`
    } else {
        url = `http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off`
    }
    try {
        await fetch(url, {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                resData.data.forEach((dayOff, index) => {
                    const row = document.createElement('tr');

                    const numberCell = document.createElement('td');
                    numberCell.textContent = index + 1;
                    row.appendChild(numberCell);

                    const dateCell = document.createElement('td');
                    const date = dayOff.dayOff.split("T");
                    dateCell.textContent = date[0];
                    row.appendChild(dateCell);

                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = dayOff.description;
                    row.appendChild(descriptionCell);

                    const actionCell = document.createElement('td');
                    const editIcon = document.createElement('img');
                    editIcon.src = '../assets/icons/edit.png';
                    editIcon.alt = 'Edit';
                    editIcon.addEventListener('click', () => {
                        // Handle edit action here
                        document.getElementById('ctr-day-off').style.display = 'flex';
                        localStorage.setItem('action', 'edit');
                        localStorage.setItem('idDayOff', dayOff.id);
                        console.log('Edit:', dayOff.id);
                    });

                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = '../assets/icons/delete.png';
                    deleteIcon.alt = 'Delete';
                    deleteIcon.addEventListener('click', () => {
                        // Handle delete action here
                        localStorage.setItem('idDayOff', dayOff.id);
                        document.getElementById("confirmModal").style.display = "block";
                        console.log('Delete:', dayOff.id);
                    });

                    actionCell.appendChild(editIcon);
                    actionCell.appendChild(deleteIcon);
                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
                if (resData.data != null) {
                    resData.data.map(data => {
                        const date = data.dayOff.split("T");

                        disabledDates.push(date[0]);
                    })
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (err) {
        console.log(url);
        showAlert('mohon maaf sepertinya ada kesalahan dari sisi server');
    }

    flatpickr("#dateInput", {
        disable: disabledDates.length > 0 ? disabledDates.map(date => new Date(date)) : [],
        dateFormat: "Y-m-d",
        minDate: "today",
        defaultDate: "today", // Tanggal default adalah hari ini
        locale: {
            firstDayOfWeek: 1 // Setel hari pertama dalam minggu sebagai Senin
        },
        theme: "material_green", // Gunakan tema material green
        onChange: function (selectedDates, dateStr, instance) {

        }
    })

});

document.getElementById('cncl-btn').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('ctr-day-off').style.display = 'none';
})

document.getElementById('btn-add').addEventListener('click', e => {
    document.getElementById('ctr-day-off').style.display = 'flex';
    localStorage.setItem('action', 'add');
})

document.getElementById('add-btn').addEventListener('click', async e => {
    e.preventDefault()
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const date = document.getElementById('dateInput').value;
    const des = document.getElementById('descript').value;
    const act = localStorage.getItem('action');

    if (act == 'add') {
        localStorage.removeItem('action');
        let obj = {}
        if (role === 'Admin') {
            const docId = localStorage.getItem('docId');
            obj = { 'doctorId': docId, 'dayOff': date + " " + "15:04:05", 'description': des }
        } else {
            obj = { 'doctorId': "", 'dayOff': date + " " + "15:04:05", 'description': des }
        }
        try {
            await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off', {
                method: "POST",
                headers: { "Authorization": "Bearer " + token },
                body: JSON.stringify(obj),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('err');
                    } else {
                        return res.json();
                    }
                })
                .then(resData => {
                    document.querySelector('.close-icon').textContent = '✓';
                    showAlert('success add doctor holiday');
                    document.getElementById('ctr-day-off').style.display = 'none';
                })
        } catch (err) {
            document.querySelector('.close-icon').textContent = '✗';
            showAlert('harap masukan data dengan benar');
        }
    } else {
        const id = localStorage.getItem('idDayOff');
        localStorage.removeItem('action');
        localStorage.removeItem('idDayOff');
        const obj = { 'id': id, 'dayOff': date + " " + "15:04:05", 'description': des }

        try {
            await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off', {
                method: "PUT",
                headers: { "Authorization": "Bearer " + token },
                body: JSON.stringify(obj),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('err');
                    } else {
                        return res.json();
                    }
                })
                .then(resData => {
                    document.querySelector('.close-icon').textContent = '✓';
                    showAlert('success edit hari libur dokter');
                    document.getElementById('ctr-day-off').style.display = 'none';
                })
        } catch (err) {
            document.querySelector('.close-icon').textContent = '✗';
            showAlert('harap masukan data dengan benar');
        }
    }
})

document.getElementById("confirmYes").addEventListener("click", async function () {
    const id = localStorage.getItem('idDayOff');
    const token = localStorage.getItem('token');
    const req = { 'id': id }
    try {
        await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off', {
            method: "DELETE",
            body: JSON.stringify(req),
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                document.querySelector('.close-icon').textContent = '✓';
                showAlert('success hapus hari libur dokter');
                document.getElementById('confirmModal').style.display = 'none';
            })
    } catch (err) {

    }
})

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("Penghapusan dibatalkan");
    document.getElementById("confirmModal").style.display = "none";
});

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}
