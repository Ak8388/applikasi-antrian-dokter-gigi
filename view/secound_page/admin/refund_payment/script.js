document.addEventListener("DOMContentLoaded", function () {
    displayRefundData()
});

function displayRefundData(){
    const tableBody = document.querySelector("#refundTable tbody");
    tableBody.innerHTML='';
    const statusFilter = document.getElementById("statusFilter");
    const token = localStorage.getItem('token');

    async function fetchRefundData(status) {
        try {
            let url = "http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund/view-for-admin";
            if (status && status !== "all") {
                url += `?status=${status}`;
            }
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token, // ganti dengan token yang sesuai
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error("Error fetching refund data:", error);
            tableBody.innerHTML = `<tr><td colspan="5">Failed to load data.</td></tr>`;
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.data.forEach((item, index) => {
            const row = document.createElement("tr");

            const noCell = document.createElement("td");
            noCell.textContent = index + 1;
            row.appendChild(noCell);

            const bankNameCell = document.createElement("td");
            bankNameCell.textContent = item.bankName;
            row.appendChild(bankNameCell);

            const bankNumberCell = document.createElement("td");
            bankNumberCell.textContent = item.bankNumber;
            row.appendChild(bankNumberCell);

            const nominalCell = document.createElement("td");
            nominalCell.textContent = item.fund;
            row.appendChild(nominalCell);

            const statusCell = document.createElement("td");
            statusCell.textContent = item.status;
            row.appendChild(statusCell);
            const actionCell = document.createElement('td');
            actionCell.id = 'act-cell';
            if (item.status != "Finish") {
                const edit = document.createElement('img');
                edit.className = 'icons';
                edit.src = '../../../assets/icons/edit.png';

                actionCell.appendChild(edit);
                edit.addEventListener('click', e => {
                    console.log(item.id);
                    localStorage.setItem('ref-id', item.id);
                    document.getElementById('bankName').value = item.bankName;
                    document.getElementById('accountNumber').value = item.bankNumber;
                    document.getElementById('card-refund-pay').style.display = 'block';
                })

                if (item.status == "Created") {
                    const switchStts = document.createElement('button');
                    switchStts.className = 'btn-stts';
                    switchStts.textContent = 'Approve';
                    actionCell.appendChild(switchStts);
                    switchStts.addEventListener('click', async e => {
                        const obj = { 'id': item.id, 'status': 'Approve' }
                        try {
                            await fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund', {
                                method: "PUT",
                                headers: { "Authorization": "Bearer " + token },
                                body: JSON.stringify(obj)
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error('error');
                                    } else {
                                        return res.json();
                                    }
                                })
                                .then(resData => {
                                    document.getElementById('icon-close').textContent = '✓';
                                    document.getElementById('icon-close').style.color = 'white';
                                    showAlert('status successfully changed');
                                    displayRefundData()
                                })
                        } catch (error) {
                            showAlert('sepertinya ada kesalahan dari sisi server');
                        }
                    })
                } else {
                    const switchStts = document.createElement('button');
                    switchStts.className = 'btn-stts';
                    switchStts.setAttribute('val-btn', 'Finish');
                    switchStts.textContent = 'Finish';
                    actionCell.appendChild(switchStts);

                    switchStts.addEventListener('click', async e => {
                        const obj = { 'id': item.id, 'status': 'Finish' }
                        try {
                            await fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund', {
                                method: "PUT",
                                headers: { "Authorization": "Bearer " + token },
                                body: JSON.stringify(obj)
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error('error');
                                    } else {
                                        return res.json();
                                    }
                                })
                                .then(resData => {
                                    document.getElementById('icon-close').textContent = '✓';
                                    document.getElementById('icon-close').style.color = 'white';
                                    showAlert('status successfully changed');
                                    displayRefundData()
                                })
                        } catch (error) {
                            console.log(error);
                            showAlert('sepertinya ada kesalahan dari sisi server');
                        }
                    })
                }
            } else {
                const del = document.createElement('img');
                del.src = '../../../assets/icons/delete.png';
                del.className = 'icons';
                actionCell.appendChild(del);
                localStorage.setItem('id',item.id);
                del.addEventListener('click', async e => {
                    document.getElementById('text-warn').textContent = 'Anda yakin ingin menghapus data ini?';
                    document.getElementById('confirmModal').style.display = 'block';
                })
            }
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    statusFilter.addEventListener("change", function () {
        const selectedStatus = statusFilter.value;
        fetchRefundData(selectedStatus);
    });

    // Initial data load with "all" status
    fetchRefundData("all");
}

document.getElementById('submitButton').addEventListener('click', async e => {
    const token = localStorage.getItem('token');
    const bankName = document.getElementById('bankName').value;
    const bankNumber = document.getElementById('accountNumber').value;
    const id = localStorage.getItem('ref-id');
    const obj = { 'id': id, 'bankName': bankName, 'bankNumber': bankNumber };

    try {
        await fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund/data-refund', {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + token, // ganti dengan token yang sesuai
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                document.getElementById("confirmModal").style.display = "none";
                document.getElementById('card-refund-pay').style.display = 'none';
                const ci = document.getElementById('icon-close');
                ci.textContent = '✔';
                ci.style.color = 'white';
                showAlert('update payment refund data successfully');
                displayRefundData()
            })
    } catch (error) {
        document.getElementById("confirmModal").style.display = "none";
        console.log(error);
        showAlert('terjadi kesalahan. pastikan anda masukan data dengan benar', error);
    }
})

document.getElementById('cncl-btn').addEventListener('click', e => {
    document.getElementById('card-refund-pay').style.display = 'none';
})

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

function closeAlert() {
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById("confirmYes").addEventListener("click", async function () {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const obj = { 'id': id }
    try {
        await fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-refund', {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token },
            body: JSON.stringify(obj)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                document.getElementById('icon-close').textContent = '✓';
                document.getElementById('icon-close').style.color = 'white';
                showAlert('successfully deleed data');
                document.getElementById('confirmModal').style.display = 'block';
                displayRefundData()
            })
    } catch (err) {
        console.log(err);
        showAlert('mohon maaf sepertinya ada kesalahan di sisi server');
    }
})

document.getElementById("confirmNo").addEventListener("click", function () {
    // Batalkan tindakan
    alert("deleted cancel");
    document.getElementById("confirmModal").style.display = "none";
});