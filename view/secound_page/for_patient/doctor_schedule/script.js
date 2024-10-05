let doctorSchedule = [];

function addSchedule(doctorName, dayOfWeek, startTime, endTime) {
  const doctor = doctorSchedule.find(d => d.doctorName === doctorName);
  if (doctor) {
    doctor.schedules.push({
      dayOfWeek,
      startTime,
      endTime
    });
  } else {
    doctorSchedule.push({
      doctorName,
      schedules: [
        {
          dayOfWeek,
          startTime,
          endTime
        }
      ]
    });
  }
}

async function fetchDoctorsAndSchedules() {
  const token = localStorage.getItem('token');
  try {
    const doctorsResponse = await fetch('http://localhost:8888/api-klinik-gigi-vony-nur-santy/users/doctors', {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (!doctorsResponse.ok) {
      throw new Error('Error fetching doctors');
    }
    const doctorsData = await doctorsResponse.json();

    const schedulePromises = doctorsData.Data.map(async (dataDoc) => {
      const scheduleResponse = await fetch(`http://localhost:8888/api-klinik-gigi-vony-nur-santy/schedules/dr-schedules?drId=${dataDoc.id}`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (!scheduleResponse.ok) {
        throw new Error('Error fetching schedules');
      }
      const scheduleData = await scheduleResponse.json();

      if (scheduleData.Data != null) {
        scheduleData.Data.forEach((dataSec) => {
          const openHours = dataSec.openingHours.split("T");
          const openHours2 = openHours[1].replace(/:00Z/, "");

          const closingHours = dataSec.closingHours.split("T");
          const closingHours2 = closingHours[1].replace(/:00Z/, "");
          addSchedule(dataDoc.name, dataSec.days, openHours2, closingHours2);
        });
      }
    });

    await Promise.all(schedulePromises);
    displayDoctorSchedule(doctorSchedule);
  } catch (err) {
    alert(err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  tokenVerify(token);
  await fetchDoctorsAndSchedules();
});

function displayDoctorSchedule(newObj) {
  const scheduleContainerElement = document.getElementById("ctr");

  newObj.forEach((doctor) => {
     const doctorScheduleElement = document.createElement("div");
     doctorScheduleElement.classList.add("doctor-schedule");
 
     const doctorInfoElement = document.createElement("div");
     doctorInfoElement.classList.add("doctor-info");
     doctorInfoElement.textContent = doctor.doctorName;
 
     const scheduleListElement = document.createElement("div");
     scheduleListElement.classList.add("schedule-list");
     console.log(doctor.schedules);
     
     if(doctor.schedules != null){
       doctor.schedules.forEach((schedule) => {
         const scheduleItemElement = document.createElement("div");
         scheduleItemElement.classList.add("schedule-item");
   
         const scheduleText = `${schedule.dayOfWeek}: ${schedule.startTime} - ${schedule.endTime}`;
         scheduleItemElement.textContent = scheduleText;
   
         scheduleListElement.appendChild(scheduleItemElement);
       });
   
       doctorScheduleElement.appendChild(doctorInfoElement);
       doctorScheduleElement.appendChild(scheduleListElement);
       scheduleContainerElement.appendChild(doctorScheduleElement);
     }
   });
}

document.getElementById('resv-now').addEventListener('click', e => {
  location.href = '../reservasi/reservasi.html';
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
          window.location.href = "../../index.html";
        }, 5000)
      }
    })
}