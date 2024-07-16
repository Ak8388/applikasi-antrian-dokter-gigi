
function main() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/auth/verify", {
        headers: {
            "Authorization": token,
        }
    })
        .then(response => {
            if (response.status > 299) {
                showAlert("Mohon maaf sesi anda telah berakhir. Mohon untuk login kembali, halaman akan otomatis di alihkan ke halaman login setelah 5 detik")
                setTimeout(e => {
                    location.href = "../../../auth/login/login.html"
                }, 5000)
                return
            } else {
                return response.json()
            }
        })

    fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/doctors", {
        headers: {
            "Authorization": token,
        }
    })
        .then(response => {
            if (response.status > 299) {
                showAlert("mohon maaf sepertinya ada kesalahan server, mohon untuk menunggu bebrapa saat lagi.")
                return
            } else {
                return response.json()
            }
        })
        .then(res => {
            const mn = document.getElementById("mn");
            const drBox = document.createElement("div");
            mn.classList.remove("rmv-mn");
            drBox.id="ctr-list-dr";
            
            res.Data.map((e)=>{
                let newpath = e.photos.replace(/\\/g,"/");
                let newpath2 = "../../../../"+newpath;
                const drCntr = document.createElement("div");
                drCntr.className = "dr-cntr";
                drCntr.setAttribute("dr-id", e.doctorId);
                drCntr.setAttribute("dr-photo", newpath2);
                drCntr.setAttribute("dr-des", e.description);
                drCntr.setAttribute("dr-name", e.name);
                drCntr.setAttribute("dr-address",e.address);
                
                const cntrImg = document.createElement("div");
                cntrImg.className = "ctr-img";

                const drPohots = document.createElement("img");
                drPohots.className = "dr-photo";
                drPohots.src = newpath2;
                
                const cntrDet = document.createElement("div");
                cntrDet.className = "ctr-det";

                const textDr = document.createElement("p");
                textDr.className = "dr-name";
                textDr.innerText = e.name;

                const textDegree = document.createElement("p");
                textDegree.className = "dr-degree";
                textDegree.innerText = e.degree;

                drBox.appendChild(drCntr);
                
                drCntr.appendChild(cntrImg);
                cntrImg.appendChild(drPohots);
                
                drCntr.appendChild(cntrDet);
                cntrDet.appendChild(textDr);
                cntrDet.appendChild(textDegree);
                mn.appendChild(drBox);

                drCntr.addEventListener("click",(event)=>{
                    event.preventDefault()
                    const cntrCard = document.getElementById("cntr-card");

                    mn.classList.add("rmv-mn");
                    cntrCard.classList.add("add-card")

                    const idDoctor =  drCntr.getAttribute("dr-id");
                    const drPhoto = drCntr.getAttribute("dr-photo");
                    const drName = drCntr.getAttribute("dr-name");
                    const drDes = drCntr.getAttribute("dr-des");
                    const drAdd = drCntr.getAttribute("dr-address");
                    localStorage.setItem('dr-id',idDoctor);

                    const DrImage = document.getElementById("dr-img");
                    DrImage.src = drPhoto;

                    const DrName = document.getElementById("drName");
                    DrName.innerText = drName;

                    const DrAddress = document.getElementById("dr-add");
                    DrAddress.innerText = "Alamat : "+drAdd;

                    const DrTable = document.getElementById("table");

                    fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/${idDoctor}`,{
                        headers:{
                            "Authorization":token,
                        }
                    })
                    .then(response=>{
                        if(response.status > 299){
                            showAlert("Maaf sepertinya ada kesalah dari sisi server. Mohon untuk mencoba kembali di lain waktu.")
                            return
                        }else{
                            return response.json()
                        }
                    })
                    .then(res=>{
                        console.log(res);
                        res.Data.map((e)=>{
                            const drTbTr = document.createElement("tr");
                            const drDay = document.createElement("td");
                            const drTimeOpen = document.createElement("td");
                            const drTimeClose = document.createElement("td");

                            const openHours = e.openingHours.split("T");
                            const openHours2 = openHours[1].replace(/:00Z/,"");

                            const closingHours = e.closingHours.split("T");
                            const closingHours2 = closingHours[1].replace(/:00Z/,"");

                            drDay.innerText = e.days;
                            drTimeOpen.innerText = openHours2;
                            drTimeClose.innerText = closingHours2;

                            drTbTr.appendChild(drDay);
                            drTbTr.appendChild(drTimeOpen);
                            drTbTr.appendChild(drTimeClose);
                            DrTable.appendChild(drTbTr);
                        })
                        const desCntr = document.getElementById("des-cntr");
                        const drDesElm = document.createElement("p");
                        drDesElm.innerText = drDes;
                        desCntr.appendChild(drDesElm);
                    })
                })
            })
        })
}

main()

document.getElementById('nxt-btn').addEventListener('click',()=>{
    const cntrCard = document.getElementById("cntr-card");
    const dateCard = document.getElementById("date-card");

    cntrCard.classList.remove('add-card');
    dateCard.classList.add('add-date');
})

document.getElementById('dateInput').addEventListener('change',e=>{
    const dayString = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const dateValue = document.getElementById('dateInput');
    const doctorId = localStorage.getItem('dr-id');
    const token = localStorage.getItem('token');
    const cntr = document.getElementById('time-reservation-cntr');
    cntr.innerHTML="";

    let date = new Date(dateValue.value);
   
    const obj = {'doctorId':doctorId,'queueDate':date}
    fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/opening-time/${doctorId}/${dayString[date.getDay()]}`,{
        headers:{
            'Authorization':token,
        }
    })
    .then(response=>{
        if(response.status>299){
            console.log(response.json());
            return showAlert('mohon maaf sepertinya di hari ini dokter yang kamu pilih tidak ada jadwal. cobalah pilih hari sesuai dengan jadwal dokter anda.')
        }else{
            return response.json()
        }
    })
    .then(response=>{
        response.data.map((e)=>{
            console.log(e);
            const timeReservas = document.createElement('div');
            timeReservas.className = "practice-time";
            timeReservas.value=e;
            const strSplit = e.split("T")
            const scheduleTime = strSplit[1].replace(/:00Z/,"");

            const optionTime = document.createElement('input');
            optionTime.type = 'radio';
            optionTime.name = 'opt-time';
            optionTime.className = 'opt-time';

            timeReservas.innerText=scheduleTime;

            cntr.appendChild(timeReservas);
            timeReservas.appendChild(optionTime);

            optionTime.addEventListener('change',e=>{
                if(e.target.checked){
                    
                }
            })
        })
    })  

})

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    document.getElementById('overlay').classList.remove('show');
}

document.getElementById