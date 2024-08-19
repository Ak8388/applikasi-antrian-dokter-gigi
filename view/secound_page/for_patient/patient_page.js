function main() {
    const token = localStorage.getItem('token');
    console.log(token);
    tokenVerify(token);
}

main()

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
                    window.location.href = "../../index.html";
                }, 5000)
            }
        })
}

function closeCardSetting() {
    // Implementasi untuk menutup card-setting
    document.querySelector('.card-setting').style.display = 'none';
}

function changePassword() {
    // Implementasi untuk mengubah kata sandi
    location.href = '../../auth/reset_password/reset_password.html';
    localStorage.setItem('start-page', '../../secound_page/for_patient/patient_page.html');
}

function updateProfile() {
    // Implementasi untuk memperbarui profil
    location.href = '../../update_profile/update_profile.html';
    localStorage.setItem('start-page', '../secound_page/for_patient/patient_page.html');
}

function logOut() {
    // Implementasi untuk log out
    localStorage.removeItem('token');
    location.href = '../../index.html';
}

function newsSlide() {
    const apiKey = '6704b77987c9d8cfcc7d62346df6b92a';
    const url = `https://gnews.io/api/v4/search?q=tooth%20health&lang=en&country=en&token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            const slider = document.getElementById('sliderr');
            data.articles.map(arr => {
                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = arr.image;
                img.alt = arr.title;

                const title = document.createElement('h3');
                title.textContent = arr.title;

                card.appendChild(img);
                card.appendChild(title);

                card.addEventListener('click', e => {
                    location.href = arr.url;
                })

                slider.appendChild(card);
            });

            let currentIndex = 0;

            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');

            const updateSliderPosition = () => {
                const sliderWidth = slider.clientWidth;
                slider.style.transform = `translateX(-${currentIndex * sliderWidth}px)`;
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === data.articles.length - 1;
            };

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < data.articles.length - 1) {
                    currentIndex++;
                    updateSliderPosition();
                }
            });

            window.addEventListener('resize', updateSliderPosition);
            updateSliderPosition();
        })
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const menuItems = [
        { text: 'Pembayaran', icon: 'fas fa-credit-card', link: './myPayment/my-payment.html' },
        { text: 'Buat Reservasi', icon: 'fas fa-calendar-alt', link: './reservasi/reservasi.html' },
        { text: 'Antrian Ku', icon: 'fas fa-clipboard-list', link: './queue/myQue.html' },
        { text: 'Tentang Klinik', icon: 'fas fa-info-circle', link:'../../about_us_page/about.html'},
        { text: 'Setting', icon: 'fas fa-cog' }
    ];

    try {
        await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/users', {
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
                const cardMenu = document.getElementById('cardMenu');
                document.getElementById('patient-name-text').innerText = "Hi, " + dataRes.data.name + "!";
                menuItems.forEach(item => {
                    const ctrMenu = document.createElement('div');
                    ctrMenu.className = 'cntr-menu';

                    const cntrIcons = document.createElement('div');
                    cntrIcons.className = 'menu-item-nav';

                    if (item.text == "Setting") {
                        cntrIcons.id = 'setting-menu';
                        cntrIcons.addEventListener('click', (e) => {
                            e.preventDefault()
                            document.getElementById('seting-card').style.display = 'block';
                        })
                    }

                    const menuIcon = document.createElement('i');
                    menuIcon.className = item.icon + ' menu-icon';

                    const menuText = document.createElement('span');
                    menuText.className = 'menu-text';
                    menuText.textContent = item.text;

                    cntrIcons.appendChild(menuIcon);
                    ctrMenu.appendChild(cntrIcons);
                    ctrMenu.appendChild(menuText);

                    cardMenu.appendChild(ctrMenu);
                    if (item.text != "Setting") {
                        cntrIcons.addEventListener('click', () => {
                            location.href = item.link;
                        })
                    }
                });
            })

    } catch (error) {
        showAlert('mohon maaf sepertinya ada kesalahan dari sisi server');
    }

    newsSlide();
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    try {
        await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/doctors', {
            headers: {
                "Authorization": "Bearer " + token,
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
                console.log(resData.Data);
                const slider = document.getElementById('slider');

                // Contoh data dinamis yang ingin ditambahkan sebagai slide
                const slideData = resData.Data;

                slideData.forEach((data) => {
                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    // slide.style.backgroundColor = data.color;

                    const photoCntr = document.createElement('div');
                    photoCntr.className = 'cntr-img';

                    const drImg = document.createElement('img');
                    drImg.className = 'dr-img';
                    drImg.src = "../../../"+data.photos;
                    drImg.alt = "dr photos";

                    const drName = document.createElement('h4');
                    drName.textContent = data.name;

                    photoCntr.appendChild(drImg);
                    slide.appendChild(photoCntr);
                    slide.appendChild(drName);
                    slider.appendChild(slide);
                });

                let currentIndex = 0;

                function moveSlider() {
                    currentIndex = (currentIndex + 1) % slideData.length;
                    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                }

                setInterval(moveSlider, 5000); // Ganti slide setiap 5 detik
            })
    } catch (error) {
    }

});

function changeEmail(){
    location.href = '../../auth/change_email/email.html';
}