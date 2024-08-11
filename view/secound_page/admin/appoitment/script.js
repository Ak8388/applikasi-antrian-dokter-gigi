function main() {
    const token = localStorage.getItem('token');
    tokenVerify(token);

    const status = document.getElementById('statusFilter').value;

    FilterGet("", status, token);
}

function setFilter() {
    const token = localStorage.getItem('token');
    tokenVerify(token);

    const strtTime = document.getElementById("startTime").value;
    const endTime = document.getElementById('endTime').value;
    const period = strtTime + " " + endTime;
    const status = document.getElementById('statusFilter').value;

    FilterGet(period, status, token);
}

main()

async function FilterGet(period, stts, token) {
    const id = localStorage.getItem('doc-id');
    try {
        await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/views?id=${id}&period=${period}&status=${stts}`, {
            headers: {
                "Authorization": 'Bearer ' + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error");
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                console.log(resData);
                const tableData = document.getElementById('table-body');
                tableData.innerHTML = "";
                resData.Data.map(data => {
                    const trows = document.createElement('tr');

                    const queNum = document.createElement('td');
                    queNum.innerText = data.queueNumber;

                    const patientName = document.createElement('td');
                    patientName.innerText = data.patient.name;

                    const docName = document.createElement('td');
                    docName.innerText = data.doctor.name;

                    const note = document.createElement('td');
                    note.innerText = data.note;

                    const resrvDate = document.createElement('td');
                    let dateResStr = data.queueDate.split("T");
                    resrvDate.innerText = dateResStr[0];

                    const resrvTime = document.createElement('td');
                    let reservTimeStr = data.queueTime.split("T");
                    let reservTimeStr2 = reservTimeStr[1].replace(":00Z", "");
                    resrvTime.innerText = reservTimeStr2;

                    const stts = document.createElement('td');
                    stts.innerText = data.status;

                    const act = document.createElement('td');
                    act.className = 'action-data';

                    const btnAct = document.createElement('button');

                    if (data.status == "created" || data.status == "reschedule") {
                        btnAct.setAttribute('status', 'process');
                        btnAct.innerText = "check";
                        act.appendChild(btnAct);

                        stts.innerText = "waiting";
                        stts.className = 'status-waiting';
                        const ctrResAndCenc = document.createElement('div');

                        const imgResc = document.createElement('img');
                        imgResc.src = '../../../assets/icons/reSchedule.png';

                        const imgCancel = document.createElement('img');
                        imgCancel.src = "../../../assets/icons/cancle.png";

                        ctrResAndCenc.appendChild(imgResc);
                        ctrResAndCenc.appendChild(imgCancel);
                        act.appendChild(ctrResAndCenc);

                        imgResc.addEventListener('click', eventResch => {
                            document.getElementById('text-warn').innerText = "apakah anda yakin ingin reschedule antrian ini?";
                            localStorage.setItem('act', 'reschedule');
                            localStorage.setItem('resrv-id', data.id);
                            localStorage.setItem('id-patient', data.patient.id);
                            document.getElementById('confirmModal').style.display = 'block';
                        })

                        imgCancel.addEventListener('click', eventCancel => {
                            document.getElementById('text-warn').innerText = "apakah anda yakin ingin cancel antrian ini?";
                            localStorage.setItem('act', 'cancel');
                            localStorage.setItem('resrv-id', data.id);
                            document.getElementById('confirmModal').style.display = 'block';
                        })

                    } else if (data.status == "process") {
                        btnAct.setAttribute('status', 'finish');
                        act.appendChild(btnAct);
                        btnAct.innerText = "finish";
                        stts.className = 'status-inprogress';

                        stts.innerText = "being checked";
                    } else if (data.status == "cancel") {
                        stts.className = 'status-cancel';
                        stts.innerText = "cancel";
                    } else {
                        stts.innerText = "finish";
                        stts.className = 'status-completed';
                    }

                    btnAct.addEventListener('click', async event => {
                        const stts = event.target.getAttribute('status');
                        const obj = { 'id': data.id, 'status': stts }
                        try {
                            await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/update-status-queues', {
                                method: "PUT",
                                headers: {
                                    "Authorization": "Bearer " + token,
                                },
                                body: JSON.stringify(obj)
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error(`HTTP error! Status: ${res.status}`);
                                    } else {
                                        return res.json();
                                    }
                                })
                                .then(dataRes => {
                                    alert("Berhasil update status antrian");
                                })
                        } catch (error) {
                            showAlert("mohon maaf sepertinya antrian yang ingin anda ubah tidak valid");
                        }
                    })

                    trows.appendChild(queNum);
                    trows.appendChild(patientName);
                    trows.appendChild(docName);
                    trows.appendChild(note);
                    trows.appendChild(resrvDate);
                    trows.appendChild(resrvTime);
                    trows.appendChild(stts);
                    trows.appendChild(act);
                    tableData.appendChild(trows);
                })
            })
    }catch(error){
        return showAlert('sepertinya di hari ini tidak ada antrian');
    }
}

document.getElementById("confirmYes").addEventListener("click", async function () {
        const action = localStorage.getItem('act');
        const token = localStorage.getItem('token');
        const reservId = localStorage.getItem('resrv-id');
        const patientId = localStorage.getItem('id-patient');
        document.getElementById("confirmModal").style.display = "none";

        if (action == 'reschedule') {
            localStorage.removeItem('act');
            const dateCard = document.getElementById("date-card");

            dateCard.classList.add('add-date');
            document.getElementById('dateInput').addEventListener('change', async e => {
                const dayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                const dateValue = document.getElementById('dateInput');
                const doctorId = localStorage.getItem('doctor-id');
                const cntr = document.getElementById('time-reservation-cntr');

                cntr.innerHTML = "";
                let date = new Date(dateValue.value);
                try {
                    await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/opening-time/${doctorId}/${dayString[date.getDay()]}`, {
                        headers: {
                            'Authorization': token,
                        }
                    })
                        .then(response => {
                            if (response.status > 299) {
                                throw new Error('error')
                            } else {
                                return response.json()
                            }
                        })
                        .then(response => {
                            response.data.map((e) => {
                                const timeReservas = document.createElement('div');
                                timeReservas.className = "practice-time";
                                timeReservas.value = e;
                                const strSplit = e.split("T")
                                const scheduleTime = strSplit[1].replace(/:00Z/, "");

                                const optionTime = document.createElement('input');
                                optionTime.type = 'radio';
                                optionTime.name = 'opt-time';
                                optionTime.className = 'opt-time';
                                optionTime.value = scheduleTime;

                                const dateBtn = document.getElementById('dateBtn');

                                timeReservas.innerText = scheduleTime;

                                cntr.appendChild(timeReservas);
                                timeReservas.appendChild(optionTime);

                                optionTime.addEventListener('change', e => {
                                    if (e.target.checked) {
                                        document.querySelectorAll('.practice-time').forEach(div => {
                                            div.classList.remove('active');
                                        });

                                        timeReservas.classList.add('active');
                                        dateBtn.removeAttribute('disabled');
                                        const queTime = dateValue.value + " " + e.target.value + ":00";

                                        dateBtn.addEventListener('click', async e => {
                                            const obj = {
                                                'id': reservId,
                                                'patientId': patientId,
                                                'queueDate': queTime,
                                                'queueTime': queTime,
                                            }
                                            try {
                                                await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/reschedules', {
                                                    method: "PUT",
                                                    headers: {
                                                        "Authorization": "Bearer " + token,
                                                    },
                                                    body: JSON.stringify(obj)
                                                })
                                                    .then(res => {
                                                        if (!res.ok) {
                                                            throw new Error('error')
                                                        } else {
                                                            return res.json()
                                                        }
                                                    })
                                                    .then(resData => {
                                                        showAlert("reschedule berhasil");
                                                        dateCard.classList.remove('add-date');
                                                    })
                                            } catch (error) {
                                                showAlert("mohon maaf sepertinya data antrian tidak valid")
                                            }
                                        })
                                    }
                                })
                            })
                        })
                } catch (error) {
                    return showAlert('mohon maaf sepertinya di hari ini dokter yang kamu pilih tidak ada jadwal. cobalah pilih hari sesuai dengan jadwal dokter anda.');
                }
            })

        } else {
            localStorage.removeItem('act');
            const reqObj = {
                'id': reservId,
            }
            try {
                await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/cancel", {
                    method: "PUT",
                    body: JSON.stringify(reqObj),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    }
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('error')
                        }
                        return res.json()
                    })
                    .then(data => {
                        document.getElementById("confirmModal").style.display = "none";
                        showAlert('antrian berhasil di cancel');
                    })
            } catch (error) {
                return showAlert("mohon maaf seprtinya antrian yang anda ingin cancel tidak valid");
            }
        }
    })

    // Dialog Script
    document.getElementById("confirmNo").addEventListener("click", function () {
        // Batalkan tindakan
        alert("Penghapusan dibatalkan");
        localStorage.removeItem('act');
        document.getElementById("confirmModal").style.display = "none";
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

    document.getElementById("cancel-btn").addEventListener('click', e => {
        const dateCard = document.getElementById("date-card");
        dateCard.classList.remove('add-date');
    })


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
                        window.location.href = "../../../index.html";
                    }, 5000)
                }
            })
    }