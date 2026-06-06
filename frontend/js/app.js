
const patientForm = document.getElementById("patientForm");

if (patientForm) {
    patientForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const driveId = params.get("driveId");

        if (!driveId) {
            alert("Error: No healthcare drive selected. Please select a drive from the home page.");
            return;
        }

        const patient = {
            drive: driveId,
            patientName: document.getElementById("patientName").value,
            age: document.getElementById("patientAge").value,
            healthConcern: document.getElementById("healthConcern").value
        };

        try {
            const response = await fetch(
                "https://fourth-sem-micro-project.onrender.com/register-patient",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(patient)
                }
            );

            const result = await response.json();
            alert(result.message);

            if (response.status === 201) {
                patientForm.reset(); 
            }
        } catch (error) {
            console.error(error);
            alert("Could not connect to backend server.");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(
                "https://fourth-sem-micro-project.onrender.com/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                }
            );

            const result = await response.json();

            if (result.success) {
                localStorage.setItem("ngo", result.ngoName);
                localStorage.setItem("ngoId", result.ngoId);
                alert("Login Successful");
                window.location.href = "dashboard.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Could not connect to backend server.");
        }
    });
}

const driveForm = document.getElementById("driveForm");

if (driveForm) {
    driveForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const drive = {
            ngo: localStorage.getItem("ngoId"),
            title: document.getElementById("driveTitle").value,
            location: document.getElementById("driveLocation").value,
            institution: document.getElementById("driveInstitution").value,
            date: document.getElementById("driveDate").value,
            month: new Date(document.getElementById("driveDate").value).toLocaleString("default", {
                month: "long"
            }),
            description: document.getElementById("driveDescription").value
        };

        try {
            const response = await fetch(
                "https://fourth-sem-micro-project.onrender.com/create-drive",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(drive)
                }
            );

            const result = await response.json();
            alert(result.message);
            driveForm.reset();
        } catch (error) {
            console.error(error);
            alert("Could not connect to backend server.");
        }
    });
}

const drivesContainer = document.getElementById("drivesContainer");

if (drivesContainer) {
    const params = new URLSearchParams(window.location.search);
    const filterType = params.get("filter");
    const dropdown = document.getElementById("filterDropdown");
    const filterTitle = document.getElementById("filterTitle");
    const filterBtn = document.getElementById("applyFilter");
    
    if (dropdown && filterTitle) {
        if (filterType === "institution") {
            filterTitle.textContent = "Browse By Institution";
            dropdown.innerHTML = `
                <option value="">Select Institution</option>
                <option value="BVEC">BVEC</option>
                <option value="NIT Silchar">NIT Silchar</option>
                <option value="Assam University">Assam University</option>
            `;
        } else if (filterType === "location") {
            filterTitle.textContent = "Browse By Location";
            dropdown.innerHTML = `
                <option value="">Select Location</option>
                <option value="Silchar">Silchar</option>
                <option value="Karimganj">Karimganj</option>
                <option value="Hailakandi">Hailakandi</option>
            `;
        } else if (filterType === "month") {
            filterTitle.textContent = "Browse By Month";
            dropdown.innerHTML = `
                <option value="">Select Month</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
            `;
        } else {
            dropdown.style.display = "none";
            if (filterBtn) filterBtn.style.display = "none";
            filterTitle.textContent = "All Healthcare Drives";
        }
    }

    async function loadDrives(url = "https://fourth-sem-micro-project.onrender.com/drives") {
        try {
            const response = await fetch(url);
            const drives = await response.json();
            renderDrives(drives);
        } catch (error) {
            console.error(error);
            drivesContainer.innerHTML = "<p>Failed to load healthcare drives.</p>";
        }
    }

    function renderDrives(drives) {
        drivesContainer.innerHTML = "";

        if (drives.length === 0) {
            drivesContainer.innerHTML = "<p>No healthcare drives found.</p>";
            return;
        }

        drives.forEach((drive) => {
            const card = document.createElement("div");
            card.classList.add("drive-card");
            card.innerHTML = `
                <h3>${drive.title}</h3>
                <p><strong>Location:</strong> ${drive.location}</p>
                <p><strong>Date:</strong> ${drive.date}</p>
                <p><strong>Institution:</strong> ${drive.institution || "N/A"}</p>
                <p>${drive.description}</p>
                <a href="volunteer.html?driveId=${drive._id}"><button>Join as Volunteer</button></a>
                <a href="patient.html?driveId=${drive._id}"><button>Register as Patient</button></a>
            `;
            drivesContainer.appendChild(card);
        });
    }

    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            const value = dropdown.value;
            let url = "https://fourth-sem-micro-project.onrender.com/drives";
            if (value && filterType) {
                url += `?${filterType}=${encodeURIComponent(value)}`;
            }
            loadDrives(url);
        });
    }

    loadDrives();
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const ngoName = document.getElementById("ngoName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(
                "https://fourth-sem-micro-project.onrender.com/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ngoName, email, password })
                }
            );

            const result = await response.json();
            alert(result.message);

            if (result.success) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error(error);
            alert("Could not connect to backend server.");
        }
    });
}

async function loadMyDrives() {
    const container = document.getElementById("myDrives");
    if (!container) return;

    try {
        const response = await fetch("https://fourth-sem-micro-project.onrender.com/my-drives");
        const drives = await response.json();
        container.innerHTML = "";

        drives.forEach(drive => {
            const card = document.createElement("div");
            card.classList.add("drive-card");
            card.innerHTML = `
                <h3>${drive.title}</h3>
                <p>${drive.location}</p>
                <p>${drive.institution}</p>
                <p>${drive.month}</p>
                <button onclick="viewVolunteers('${drive._id}')">View Volunteers</button>
                <button onclick="viewPatients('${drive._id}')">View Patients</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}
loadMyDrives();

const volunteerForm = document.getElementById("volunteerForm");

if (volunteerForm) {
    volunteerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const driveId = params.get("driveId");

        const volunteer = {
            drive: driveId,
            volunteerName: document.getElementById("volunteerName").value,
            contact: document.getElementById("volunteerContact").value,
            skills: document.getElementById("volunteerSkills").value
        };

        try {
            const response = await fetch(
                "https://fourth-sem-micro-project.onrender.com/register-volunteer",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(volunteer)
                }
            );

            const result = await response.json();
            alert(result.message);
            
            if (response.status === 201) {
                volunteerForm.reset();
            }
        } catch (error) {
            console.error(error);
            alert("Could not connect to backend server.");
        }
    });
}

async function viewVolunteers(driveId) {
    document.getElementById("modalTitle").textContent = "Volunteers";
    document.getElementById("modalContent").innerHTML = "<p>Loading...</p>";
    document.getElementById("modalOverlay").style.display = "flex";

    try {
        const response = await fetch(`https://fourth-sem-micro-project.onrender.com/volunteers/${driveId}`);
        const volunteers = await response.json();
        const content = document.getElementById("modalContent");

        if (volunteers.length === 0) {
            content.innerHTML = "<p style='color:#888;'>No volunteers registered yet.</p>";
            return;
        }

        content.innerHTML = volunteers.map(v => `
            <div style="border:1px solid #eee; border-radius:8px; padding:12px; margin-bottom:12px;">
              <p style="margin:0 0 4px; font-weight:500;">${v.volunteerName}</p>
              <p style="margin:0 0 4px; color:#555; font-size:14px;">📞 ${v.contact}</p>
              <p style="margin:0; color:#555; font-size:14px;">🛠 ${v.skills}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error(error);
    }
}

async function viewPatients(driveId) {
    document.getElementById("modalTitle").textContent = "Patients";
    document.getElementById("modalContent").innerHTML = "<p>Loading...</p>";
    document.getElementById("modalOverlay").style.display = "flex";

    try {
        const response = await fetch(`https://fourth-sem-micro-project.onrender.com/patients/${driveId}`);
        const patients = await response.json();
        const content = document.getElementById("modalContent");

        if (patients.length === 0) {
            content.innerHTML = "<p style='color:#888;'>No patients registered yet.</p>";
            return;
        }

        content.innerHTML = patients.map(p => `
            <div style="border:1px solid #eee; border-radius:8px; padding:12px; margin-bottom:12px;">
              <p style="margin:0 0 4px; font-weight:500;">${p.patientName}</p>
              <p style="margin:0 0 4px; color:#555; font-size:14px;">Age: ${p.age}</p>
              <p style="margin:0; color:#555; font-size:14px;">Concern: ${p.healthConcern}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error(error);
    }
}

function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
}

document.getElementById("modalOverlay")?.addEventListener("click", function(e) {
    if (e.target === this) closeModal();
});