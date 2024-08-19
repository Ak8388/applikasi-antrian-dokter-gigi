async function main() {
    const doc = document.getElementById('profile-form');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    let url = "http://localhost:8888/api-klinik-gigi-vony-nur-santy/"

    if (role == "Doctor") {
        url += 'doctors'
    } else {
        url += 'users'
    }

    try {
        await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + token,
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error " + res.body)
                } else {
                    return res.json()
                }
            })
            .then(data => {
                const data2 = data.data;
                console.log(data2);
                if (role == "Doctor") {
                    // Photos element
                    const inpGroupPhot = document.createElement('div');
                    inpGroupPhot.className = 'input-group';

                    const labelPhoto = document.createElement('label');
                    labelPhoto.innerText = 'Photo';
                    labelPhoto.setAttribute('for', 'photo');

                    const inpPhoto = document.createElement('input');
                    inpPhoto.type = 'file';
                    inpPhoto.id = 'photo';
                    // inpPhoto.value = data2.photos;
                    inpPhoto.accept = 'image/';

                    inpGroupPhot.appendChild(labelPhoto);
                    inpGroupPhot.appendChild(inpPhoto);
                    // Des Element
                    const inpGroupDes = document.createElement('div');
                    inpGroupDes.className = 'input-group';

                    const labelDes = document.createElement('label');
                    labelDes.innerText = 'Description';
                    labelDes.setAttribute('for', 'description');

                    const desInput = document.createElement('textarea');
                    desInput.id = 'description';
                    desInput.rows = '3';
                    desInput.value = data2.description;
                    desInput.placeholder = 'Describe yourself';

                    inpGroupDes.appendChild(labelDes);
                    inpGroupDes.appendChild(desInput);
                    // Degree Elemet
                    const inpGroupDeg = document.createElement('div');
                    inpGroupDeg.className = 'input-group';

                    const labelDeg = document.createElement('label');
                    labelDeg.innerText = 'Degree';
                    labelDeg.setAttribute('for', 'degree');

                    const inpDeg = document.createElement('input');
                    inpDeg.type = 'text';
                    inpDeg.id = 'degree';
                    inpDeg.value = data2.degree;
                    inpDeg.placeholder = 'Enter your degree';

                    inpGroupDeg.appendChild(labelDeg);
                    inpGroupDeg.appendChild(inpDeg);
                    // Age Elemet
                    const inpGroupAge = document.createElement('div');
                    inpGroupAge.className = 'input-group';

                    const labelAge = document.createElement('label');
                    labelAge.innerText = 'Age';
                    labelAge.setAttribute('for', 'age');

                    const inpAge = document.createElement('input');
                    inpAge.type = 'number';
                    inpAge.id = 'age';
                    inpAge.value = data2.age;
                    inpAge.placeholder = 'Enter your age';

                    inpGroupAge.appendChild(labelAge);
                    inpGroupAge.appendChild(inpAge);
                    // Apendd Doctor Requirement for element
                    doc.appendChild(inpGroupPhot);
                    doc.appendChild(inpGroupDes);
                    doc.appendChild(inpGroupDeg);
                    doc.appendChild(inpGroupAge);
                }

                // Name Element
                const inpGroupName = document.createElement('div');
                inpGroupName.className = 'input-group';

                const labelName = document.createElement('label');
                labelName.innerText = 'Name';
                labelName.setAttribute('for', 'name');

                const inpName = document.createElement('input');
                inpName.type = 'text';
                inpName.id = 'name';
                inpName.value = data2.name;
                inpName.placeholder = 'Enter your name';

                inpGroupName.appendChild(labelName);
                inpGroupName.appendChild(inpName);

                // Address Element
                const inpGroupAddr = document.createElement('div');
                inpGroupAddr.className = 'input-group';

                const labelAddr = document.createElement('label');
                labelAddr.innerText = 'Address';
                labelAddr.setAttribute('for', 'addr');

                const inpAddr = document.createElement('input');
                inpAddr.type = 'text';
                inpAddr.id = 'addr';
                inpAddr.value = data2.address;
                inpAddr.placeholder = 'Enter your address';

                inpGroupAddr.appendChild(labelAddr);
                inpGroupAddr.appendChild(inpAddr);

                // Button Group
                const btnGroup = document.createElement('div');
                btnGroup.className = 'button-group';

                const btnUpd = document.createElement('button');
                btnUpd.type = 'button';
                btnUpd.innerText = 'Update';
                btnUpd.className = 'btn-update';

                const btnCanc = document.createElement('button');
                btnCanc.type = 'button';
                btnCanc.innerText = 'Cancel';
                btnCanc.className = 'btn-cancel';

                btnGroup.appendChild(btnUpd);
                btnGroup.appendChild(btnCanc);

                // Add element input
                doc.appendChild(inpGroupName);
                doc.appendChild(inpGroupAddr);
                doc.appendChild(btnGroup);

                btnCanc.addEventListener('click', e => {
                    const startPage = localStorage.getItem('start-page');
                    location.href = startPage;
                })

                btnUpd.addEventListener('click', async e => {
                    if (role == "Doctor") {
                        const photos = document.getElementById('photo');
                        const desValue = document.getElementById('description').value;
                        const degValue = document.getElementById('degree').value;
                        const ageValue = document.getElementById('age').value;

                        if (data2.photos == "") {
                            if (photos.files.length === 0) {
                                alert('Please select a file.');
                                return;
                            }
                        }

                        const formData = new FormData();

                        if (photos.files.length > 0) {
                            formData.append('photos', photos.files[0]);
                        }

                        const objData = {
                            "doctor": {
                                'name': inpName.value,
                                'address': inpAddr.value,
                                "role": "",
                                "email": "",
                                "password": "",
                            },
                            "doctorDetail": {
                                "age": ageValue,
                                'description': desValue,
                                'degree': degValue,
                            }
                        }

                        formData.append('json', JSON.stringify(objData));

                        try {
                            await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/doctors/profiles", {
                                headers: { "Authorization": "Bearer " + token },
                                method: "PUT",
                                body: formData
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error("error");
                                    } else {
                                        return res.json();
                                    }
                                })
                                .then(resData => {
                                    document.getElementById('closeIcons').innerText = '✓';
                                    showAlert("update data profile berhasil");
                                    localStorage.setItem('act','update');
                                })
                        } catch (error) {
                            showAlert('mohon masukan data dengan benar');
                        }
                    } else {
                        try {
                            const dataJson = {'name':inpName.value,'address':inpAddr.value}
                            await fetch("http://localhost:8888/api-klinik-gigi-vony-nur-santy/users", {
                                headers: { "Authorization": "Bearer " + token },
                                method: "PUT",
                                body: JSON.stringify(dataJson)
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error("error");
                                    } else {
                                        return res.json();
                                    }
                                })
                                .then(resData => {
                                    document.getElementById('closeIcons').innerText = '✓';
                                    showAlert("update data profile berhasil");
                                    localStorage.setItem('act','update');
                                })
                        } catch (error) {
                            showAlert('mohon masukan data dengan benar');
                        }
                    }
                })
            })
    } catch (error) {

    }
}

main()

function showAlert(text) {
    document.getElementById('text-alert').innerText = text;
    document.getElementById('overlay').classList.add('show');
}

// Function to close the alert
function closeAlert() {
    const startPage = localStorage.getItem('start-page');
    const act = localStorage.getItem('act');

    if(act == 'update'){
        localStorage.removeItem('start-page');
        localStorage.removeItem('act');
        location.href=startPage;
    }

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
                    window.location.href = "../../index.html";
                }, 5000)
            }
        })
}

// document.getElementById('cancelBtn').addEventListener('click', e => {
//     document.getElementById('card-sche').style.display = 'none';
// })