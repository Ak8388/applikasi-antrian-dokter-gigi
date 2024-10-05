function main() {
    const token = localStorage.getItem('token');
    tokenVerify(token)
    getDataPayment("")
}

main()

function getDataPayment(status) {
    let url = "";
    const tbody = document.getElementById('paymentHistory');
    tbody.innerHTML="";
    const token = localStorage.getItem("token");
    if (status == "") {
        url = "http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-reservations/find-payment"
    } else {
        url = `http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-reservations/find-payment?status=${status}`
    }

    fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
    })
        .then(res => {
            if (!res.ok) {
                return showAlert("maaf sepertinya ada kesalahan dari server")
            } else {
                return res.json()
            }
        })
        .then(data => {
            console.log(data);
            let index = 0;
            data.data.map(respData => {
                index++;
                const trows = document.createElement('tr');
                trows.className = 'rows-data';

                const no = document.createElement('td');
                no.innerText = index;

                const payDate = document.createElement('td');
                let payDateStr = respData.date.split("T");
                payDate.innerText = payDateStr[0];

                const amount = document.createElement('td');
                amount.innerText = respData.amount;

                const stts = document.createElement('td');
                stts.innerText = respData.status;

                const toStts = document.createElement('td');
                if (respData.to_stts == "Reschedule") {
                    toStts.innerText = "Pembayaran untuk reschedule antrian";
                } else {
                    toStts.innerText = "Pembayaran untuk membuat antrian";
                }

                tbody.appendChild(trows);
                trows.appendChild(no);
                trows.appendChild(payDate);
                trows.appendChild(amount);
                trows.appendChild(stts);
                trows.appendChild(toStts);

                if (respData.status == "Order") {
                    const act = document.createElement('td');
                    act.className = 'action-data';

                    const pay = document.createElement('a');
                    pay.target = '_blank';
                    const payImg = document.createElement('img');

                    payImg.src='../../../assets/icons/pay.png';
                    pay.appendChild(payImg);

                    const cancelPay = document.createElement('img');
                    cancelPay.src = '../../../assets/icons/cancle.png';

                    if (respData.to_stts == "Reschedule") {
                        pay.href = localStorage.getItem('url-payment-reschedule');
                        cancelPay.setAttribute('order-id', localStorage.getItem('order-id-resch'));
                    } else {
                        pay.href = localStorage.getItem('url-payment-create');
                        cancelPay.setAttribute('order-id', localStorage.getItem('order-id-create'));
                    }

                    act.appendChild(pay);
                    act.appendChild(cancelPay);
                    trows.appendChild(act);

                    cancelPay.addEventListener('click', e => {
                        const obj = {'orderId': e.target.getAttribute('order-id') };
                        localStorage.setItem("obj",JSON.stringify(obj));
                        document.getElementById("confirmModal").style.display = "block";
                    })
                }

            })
        })
}

document.getElementById('statusFilter').addEventListener('change', function () {
    const filterValue = this.value;
    getDataPayment(filterValue);
});


// Confirm Alert 
document.getElementById("confirmYes").addEventListener("click", function () {
    const token = localStorage.getItem('token');
    const obj = localStorage.getItem('obj');
    fetch('http://localhost:8081/api-klinik-gigi-vony-nur-santy/payment-reservations/canceled-payment', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: obj
    })
        .then(res => {
            if (!res.ok) {
                return showAlert("mohon maaf sepertinya pambayaran yang ingin anda batalkan tidak valid");
            } else {
                return res.json();
            }
        })
        .then(dataRes => {
            alert("pembatalan pembayaran berhasil");
            document.getElementById("confirmModal").style.display = "none";
            getDataPayment("");
        })

    localStorage.removeItem('obj');
});

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

function tokenVerify(token){
    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/verify",{
        headers:{
            "Authorization":"Bearer "+token,
        }
    })
    .then(res=>{
        if(res.ok){
            return res.json()
        }else{
            showAlert("maaf sesi anda sudah habis") 
            setTimeout(()=>{
                window.location.href="../../index.html";
            },5000) 
        }
    })
}