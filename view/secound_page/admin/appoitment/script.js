function filterQueue() {
    const filter = document.getElementById('statusFilter').value;
    const items = document.querySelectorAll('.queue-item');

    items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-status') === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function main() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('doc-id');

    tokenVerify(token);
    fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/queues/views/${id}`, {
        headers: {
            "Authorization": 'Bearer ' + token
        }
    })
        .then(res => {
            if (!res.ok) {
                return showAlert('mohon maaf sepertinya ada kesalahan dari sisi server')
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
                    btnAct.setAttribute('status','check');
                    btnAct.innerText = "check";
                    act.appendChild(btnAct);

                    stts.innerText = "waiting";
                    stts.className = 'status-waiting';
                    const ctrResAndCenc = document.createElement('div');

                    const imgResc = document.createElement('img');
                    imgResc.src = '../../../assets/icons/cancle.png';

                    const imgCancel = document.createElement('img');

                    imgCancel.src = "../../../assets/icons/reSchedule.png";
                    ctrResAndCenc.appendChild(imgCancel);
                    ctrResAndCenc.appendChild(imgResc);
                    act.appendChild(ctrResAndCenc);
                } else if (data.status == "process") {
                    btnAct.setAttribute('status','process');
                    act.appendChild(btnAct);
                    btnAct.innerText = "finish";
                    stts.className = 'status-inprogress';
                } else if (data.status == "cancel") {
                    stts.className = 'status-cancel';
                } else {
                    stts.className = 'status-completed';
                }
                btnAct.addEventListener('click',event=>{
                    const stts = event.target.getAttribute('status');
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
}

main()

// Script Alert
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
                showAlert("maaf sesi anda sudah habis");
                setTimeout(() => {
                    window.location.href = "../../../index.html";
                }, 5000)
            }
        })
}