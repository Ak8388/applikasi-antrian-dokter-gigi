function main() {
    DisplayMyQueue("")
}

main();

function DisplayMyQueue(status){
    if(status!=""){
        e.preventDefault()
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/view`, {
            headers: {
                "Authorization": "Bearer " + token,
            }
        })
            .then(res => res.json())
            .then(res => {
                const tBody = document.getElementById('queue-table-body');
                tBody.innerHTML = "";
    
                let index = 0;
                res.Data.map(data => {
                    const trows = document.createElement('tr');
                    index++;
                    const no = document.createElement('td');
                    no.innerText = index;
    
                    const name = document.createElement('td');
                    name.innerText = data.patient.name;
    
                    const doctor = document.createElement('td');
                    doctor.innerText = data.doctor.name;
    
                    const date = document.createElement('td');
                    let date1 = data.queueDate;
                    let date2 = date1.split("T");
                    date.innerText = date2[0];
    
                    const dateTime = document.createElement('td');
                    let dateTime1 = data.queueTime.replace("Z", "");
                    let dateTime2 = dateTime1.split("T");
                    dateTime.innerText = dateTime2[1];
    
                    const status = document.createElement('td');
                    status.innerText = data.status;
    
                    tBody.appendChild(trows);
                    trows.appendChild(no);
                    trows.appendChild(name);
                    trows.appendChild(doctor);
                    trows.appendChild(date);
                    trows.appendChild(dateTime);
                    trows.appendChild(status);
    
                    const act = document.createElement('td');
                    act.className = 'action-data';
                    trows.appendChild(act);
    
                    if (data.status == "created") {
                        const reSchedule = document.createElement('img');
                        reSchedule.src = "../../../assets/icons/reSchedule.png";
    
                        const cancle = document.createElement('img');
                        cancle.src = "../../../assets/icons/cancle.png";
    
                        act.appendChild(reSchedule);
                        act.appendChild(cancle);
    
                        reSchedule.addEventListener('click', e => {
                            localStorage.setItem('doctor-id', data.doctor.id);
                            localStorage.setItem('reserv-id', data.id);
                            localStorage.setItem('act', "reSch");
                            document.getElementById('text-warn').innerText = "Reschedule jadwal dikenakan biaya 50% dari biaya pendaftaran. Apakah anda yakin ingin Reschedule jadwal?"
                            document.getElementById("confirmModal").style.display = "block";
                        })
    
                        cancle.addEventListener('click', e => {
                            localStorage.setItem('reserv-id', data.id);
                            const today = new Date();
                            const date = data.queueDate.split('T');
                            const date2 = new Date(date[0]);
                            date2.setHours(0, 0, 0, 0);
                            if (today < date2) {
                                console.log(data.id);
                                localStorage.setItem('idUser', data.patient.id);
                                localStorage.setItem('qDate', date[0]);
                                localStorage.setItem('act', "cancelBeforeResrv");
                                document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya antrian akan di potong sebesar 10%. Apakah anda yakin ingin cancel antrian ini?";
                                document.getElementById("confirmModal").style.display = "block";
                            } else {
                                localStorage.setItem('act', "cancel");
                                document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya tidak akan di kembalikan. Apakah anda yakin ingin cancel antrian ini?";
                                document.getElementById("confirmModal").style.display = "block";
                            }
                        })
    
                    }
    
                    if (data.status == "reschedule") {
                        const cancle = document.createElement('img');
                        cancle.src = "../../../assets/icons/cancle.png";
                        act.appendChild(cancle);
    
                        cancle.addEventListener('click', e => {
                            localStorage.setItem('reserv-id', data.id);
                            const today = new Date();
                            const date = data.queueDate.split('T');
                            const date2 = new Date(date[0]);
                            date2.setHours(0, 0, 0, 0);
                            if (today < date2) {
                                localStorage.setItem('idUser', data.patient.id);
                                localStorage.setItem('qDate', date[0]);
                                localStorage.setItem('act', "cancelBeforeResrv");
                                document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya antrian akan di potong sebesar 10%. Apakah anda yakin ingin cancel antrian ini?";
                                document.getElementById("confirmModal").style.display = "block";
                            } else {
                                localStorage.setItem('act', "cancel");
                                document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya tidak akan di kembalikan. Apakah anda yakin ingin cancel antrian ini?";
                                document.getElementById("confirmModal").style.display = "block";
                            }
                        })
                    }
                })
            })
    
    }else{
        const token = localStorage.getItem('token');
    tokenVerify(token);
    fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/view?status=${status}`, {
        headers: {
            "Authorization": "Bearer " + token,
        }
    })
        .then(res => res.json())
        .then(res => {
            const tBody = document.getElementById('queue-table-body');
            tBody.innerHTML='';
            let index = 0;
            res.Data.map(data => {
                console.log(data);
                const trows = document.createElement('tr');
                index++;
                const no = document.createElement('td');
                no.innerText = index;

                const name = document.createElement('td');
                name.innerText = data.patient.name;

                const doctor = document.createElement('td');
                doctor.innerText = data.doctor.name;

                const date = document.createElement('td');
                let date1 = data.queueDate;
                let date2 = date1.split("T");
                date.innerText = date2[0];

                const queueNumber = document.createElement('td');
                queueNumber.textContent = data.queueNumber;

                const dateTime = document.createElement('td');
                let dateTime1 = data.queueTime.replace("Z", "");
                let dateTime2 = dateTime1.split("T");
                dateTime.innerText = dateTime2[1];

                const status = document.createElement('td');
                status.innerText = data.status;

                tBody.appendChild(trows);
                trows.appendChild(no);
                trows.appendChild(name);
                trows.appendChild(doctor);
                trows.appendChild(date);
                trows.appendChild(queueNumber);
                trows.appendChild(dateTime);
                trows.appendChild(status);

                const act = document.createElement('td');
                act.className = 'action-data';
                trows.appendChild(act);

                if (data.status == "created") {
                    const reSchedule = document.createElement('img');
                    reSchedule.src = "../../../assets/icons/reSchedule.png";

                    const cancle = document.createElement('img');
                    cancle.src = "../../../assets/icons/cancle.png";
                    act.appendChild(reSchedule);
                    act.appendChild(cancle);

                    reSchedule.addEventListener('click', e => {
                        localStorage.setItem('doctor-id', data.doctor.id);
                        localStorage.setItem('reserv-id', data.id);
                        localStorage.setItem('act', "reSch");
                        document.getElementById('text-warn').innerText = "Reschedule jadwal dikenakan biaya 50% dari biaya pendaftaran. Apakah anda yakin ingin Reschedule jadwal?"
                        document.getElementById("confirmModal").style.display = "block";
                    })

                    cancle.addEventListener('click', e => {
                        localStorage.setItem('reserv-id', data.id);
                        const today = new Date();
                        const date = data.queueDate.split('T');
                        const date2 = new Date(date[0]);
                        date2.setHours(0, 0, 0, 0);
                        if (today < date2) {
                            localStorage.setItem('idUser', data.patient.id);
                            console.log(data.id);

                            localStorage.setItem('qDate', date[0]);
                            localStorage.setItem('act', "cancelBeforeResrv");
                            document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya antrian akan di potong sebesar 10%. Apakah anda yakin ingin cancel antrian ini?";
                            document.getElementById("confirmModal").style.display = "block";
                        } else {
                            localStorage.setItem('act', "cancel");
                            document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya tidak akan di kembalikan. Apakah anda yakin ingin cancel antrian ini?";
                            document.getElementById("confirmModal").style.display = "block";
                        }

                    })
                }

                if (data.status == "reschedule") {
                    const cancle = document.createElement('img');
                    cancle.src = "../../../assets/icons/cancle.png";
                    act.appendChild(cancle);

                    cancle.addEventListener('click', e => {
                        localStorage.setItem('reserv-id', data.id);
                        const today = new Date();
                        const date = data.queueDate.split('T');
                        const date2 = new Date(date[0]);
                        date2.setHours(0, 0, 0, 0);
                        if (today < date2) {
                            console.log(data.id);

                            localStorage.setItem('idUser', data.patient.id);
                            localStorage.setItem('qDate', date[0]);
                            localStorage.setItem('act', "cancelBeforeResrv");
                            document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya antrian akan di potong sebesar 10%. Apakah anda yakin ingin cancel antrian ini?";
                            document.getElementById("confirmModal").style.display = "block";
                        } else {
                            localStorage.setItem('act', "cancel");
                            document.getElementById('text-warn').innerText = "jika anda mengcancel antrian maka biaya tidak akan di kembalikan. Apakah anda yakin ingin cancel antrian ini?";
                            document.getElementById("confirmModal").style.display = "block";
                        }
                    })
                }
            })
        })
    }
}

document.getElementById('status-filter').addEventListener('change', e => {
    DisplayMyQueue(e.target.value)
})

document.getElementById("confirmYes").addEventListener("click", async function () {
    const act = localStorage.getItem('act')
    const token = localStorage.getItem('token');
    const resrvId = localStorage.getItem('reserv-id');

    if (act == "reSch") {
        localStorage.removeItem('act');
        const id = localStorage.getItem('doctor-id');
        const dateCard = document.getElementById("date-card");
        
        
        
        document.getElementById("confirmModal").style.display = "none";

        // Disabled Start
        let disabledDates = [];
        const url = `http://localhost:8888/api-klinik-gigi-vony-nur-santy/days-off?docId=${id}`

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
                    console.log(resData);
                    if (resData.data != null) {
                        resData.data.map(data => {
                            const date = data.dayOff.split("T");
                            disabledDates.push(date[0]);
                        })
                    }
                })
        } catch (err) {
            console.log(url);
            showAlert('mohon maaf sepertinya ada kesalahan dari sisi server');
        }

        flatpickr("#dateInput", {
            disable: disabledDates.map(date => new Date(date)),
            dateFormat: "Y-m-d",
            minDate: "today",
            maxDate: new Date().fp_incr(30), // Maksimal 60 hari ke depan
            defaultDate: "today", // Tanggal default adalah hari ini
            locale: {
                firstDayOfWeek: 1 // Setel hari pertama dalam minggu sebagai Senin
            },
            theme: "material_blue", // Gunakan tema material green
            onChange: function (selectedDates, dateStr, instance) {
                console.log("Tanggal dipilih:", dateStr);
            }
        })
        dateCard.classList.add('add-date');
        // Disabled End

        document.getElementById('dateInput').addEventListener('change', e => {
            const dayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            const dateValue = document.getElementById('dateInput');
            const doctorId = localStorage.getItem('doctor-id');
            const cntr = document.getElementById('time-reservation-cntr');
            cntr.innerHTML = "";

            let date = new Date(dateValue.value);
            console.log(resrvId);

            fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/opening-time/${doctorId}/${dayString[date.getDay()]}`, {
                headers: {
                    'Authorization': token,
                }
            })
                .then(response => {
                    if (response.status > 299) {
                        console.log(response.json());
                        return showAlert('mohon maaf sepertinya di hari ini dokter yang kamu pilih tidak ada jadwal. cobalah pilih hari sesuai dengan jadwal dokter anda.')
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

                                dateBtn.addEventListener('click', e => {
                                    let newObj = {
                                        'transaction_details': {
                                            'order_id': "",
                                            'gross_amount': 10000,
                                        },
                                        'item_details':
                                            [
                                                {
                                                    'id': doctorId,
                                                    'name': 'Denatl Clinic',
                                                    'category': 'Jasa',
                                                    'reservasi_date': queTime,
                                                    'reservasi_time': queTime,
                                                    'to': 'Reschedule',
                                                }
                                            ],
                                        'customer_detail': {
                                            'phone': '',
                                            'idResev': resrvId,
                                        }
                                    }

                                    fetch("http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-reservations", {
                                        method: "POST",
                                        headers: {
                                            "Authorization": "Bearer " + token,
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(newObj),
                                    })
                                        .then(res => {
                                            if (!res.ok) {
                                                showAlert("sepertinya ada pembayaran yang belum anda bayar atau anda sudah mengantri di hari yang sama");
                                            }
                                            return res.json();
                                        })
                                        .then(res => {
                                            localStorage.removeItem('dr-id');
                                            localStorage.removeItem('reserv-id');
                                            localStorage.setItem('url-payment-reschedule', res.data.redirect_url);
                                            localStorage.setItem('order-id-resch', res.data.transaction_details.order_id);
                                            window.location.href = res.data.redirect_url;
                                        })

                                })
                            }
                        })
                    })
                })
        })
    } else if (act == "cancelBeforeResrv") {
        localStorage.removeItem('act');
        document.getElementById("confirmModal").style.display = "none";
        document.getElementById('card-refund-pay').style.display = 'block';
        DisplayMyQueue("")
    } else {
        localStorage.removeItem('act');
        const reqObj = {
            'id': resrvId,
        }
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
                    showAlert("mohon maaf seprtinya antrian yang anda ingin cancel tidak valid")
                    return
                }
                return res.json()
            })
            .then(data => {
                document.getElementById("confirmModal").style.display = "none";
                localStorage.removeItem('reserv-id');
                DisplayMyQueue("")
            })
    }

});

document.getElementById("cancel-btn").addEventListener('click', e => {
    const dateCard = document.getElementById("date-card");
    dateCard.classList.remove('add-date');
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

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
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
                showAlert("maaf sesi anda sudah habis")
                setTimeout(() => {
                    window.location.href = "../../../index.html";
                }, 5000)
            }
        })
}

// card refund script
document.addEventListener('DOMContentLoaded', function () {
    const bankNameInput = document.getElementById('bankName');
    const accountNumberInput = document.getElementById('accountNumber');
    const submitButton = document.getElementById('submitButton');
    const patId = localStorage.getItem('idUser');
    const qdate = localStorage.getItem('qDate');
    const resrvId = localStorage.getItem('reserv-id');
    const token = localStorage.getItem('token');

    bankNameInput.addEventListener('input', function () {
        accountNumberInput.disabled = this.value.trim() === '';
    });

    accountNumberInput.addEventListener('input', function () {
        submitButton.disabled = this.value.trim() === '';
    });

    submitButton.addEventListener('click', async function () {
        const obj = {
            'userId': patId,
            'date': qdate,
            'bankName': bankNameInput.value,
            'bankNumber': accountNumberInput.value,
            'status': 'Created'
        };
        console.log('Sending first request...');
        try {
            const response = await fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund', {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(obj)
            });

            console.log('First request completed.');

            if (!response.ok) { // Jika response status bukan 2xx
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${errorData.message}`);
            }

            const result = await response.json();
            console.log('Payment Refund Result:', result);

            const reqObj = { 'id': resrvId };
            console.log('Sending second request...');
            const cancelResponse = await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/cancel", {
                method: "PUT",
                body: JSON.stringify(reqObj),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                }
            });
            console.log('Second request completed.');
            if (!cancelResponse.ok) { // Jika response status bukan 2xx
                const cancelErrorData = await cancelResponse.json();
                throw new Error(`Error: ${cancelResponse.status} - ${cancelErrorData.message}`);
            }

            const cancelData = await cancelResponse.json();
            console.log('Queue Cancel Result:', cancelData);

            document.getElementById("card-refund-pay").style.display = "none";
            document.getElementById("confirmModal").style.display = "none";
            document.getElementById('icon-close').textContent = '✔';
            document.getElementById('icon-close').style.color = 'green';
            showAlert('Cancel payment berhasil! Untuk refund payment maksimal 7 hari setelah cancel antrian.');
            localStorage.removeItem('idUser');
            localStorage.removeItem('qDate');
            localStorage.removeItem('reserv-id');
            DisplayMyQueue("")
        } catch (error) {
            console.log(error);
            showAlert(`Terjadi kesalahan:${error.error}`);
        }
    });

});

document.getElementById('cncl-btn').addEventListener('click', e => {
    document.getElementById('card-refund-pay').style.display = 'none';
})