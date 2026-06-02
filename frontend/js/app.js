const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const email =
                document.getElementById(
                    "loginEmail"
                ).value;

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;

            const response =
                await fetch(
                    "http://localhost:3000/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                            "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

            const result =
                await response.json();

            if(result.success) {

                localStorage.setItem(
                    "ngo",
                    result.ngoName
                );

                alert("Login Successful");

                window.location.href =
                    "dashboard.html";
            }
            else {

                alert(result.message);
            }
        }
    );
}

const driveForm = document.getElementById("driveForm");

if (driveForm) {

    driveForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const drive = {
            title: document.getElementById("driveTitle").value,
            location: document.getElementById("driveLocation").value,
            institution: document.getElementById("driveInstitution").value,
            date: document.getElementById("driveDate").value,
            month: new Date(
                document.getElementById("driveDate").value
            ).toLocaleString("default", {
                month: "long"
            }),
            description: document.getElementById("driveDescription").value
        };
        
        try {

            const response = await fetch(
                "http://localhost:3000/create-drive",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
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

    const params =
        new URLSearchParams(window.location.search);

    const filterType =
        params.get("filter");

    const dropdown =
        document.getElementById("filterDropdown");

    const filterTitle =
        document.getElementById("filterTitle");

    const filterBtn =
        document.getElementById("applyFilter");

    
    if (dropdown && filterTitle) {

        if (filterType === "institution") {

            filterTitle.textContent =
                "Browse By Institution";

            dropdown.innerHTML = `
                <option value="">Select Institution</option>
                <option value="BVEC">BVEC</option>
                <option value="NIT Silchar">NIT Silchar</option>
                <option value="Assam University">Assam University</option>
            `;
        }

        else if (filterType === "location") {

            filterTitle.textContent =
                "Browse By Location";

            dropdown.innerHTML = `
                <option value="">Select Location</option>
                <option value="Silchar">Silchar</option>
                <option value="Karimganj">Karimganj</option>
                <option value="Hailakandi">Hailakandi</option>
            `;
        }

        else if (filterType === "month") {

            filterTitle.textContent =
                "Browse By Month";

            dropdown.innerHTML = `
                <option value="">Select Month</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
            `;
        }

        else {

            dropdown.style.display = "none";

            if (filterBtn) {
                filterBtn.style.display = "none";
            }

            filterTitle.textContent =
                "All Healthcare Drives";
        }
    }

    async function loadDrives(url = "http://localhost:3000/drives") {

        try {

            const response =
                await fetch(url);

            const drives =
                await response.json();

            renderDrives(drives);

        } catch (error) {

            console.error(error);

            drivesContainer.innerHTML =
                "<p>Failed to load healthcare drives.</p>";
        }
    }

    function renderDrives(drives) {

        drivesContainer.innerHTML = "";

        if (drives.length === 0) {

            drivesContainer.innerHTML =
                "<p>No healthcare drives found.</p>";

            return;
        }

        drives.forEach((drive) => {

            const card =
                document.createElement("div");

            card.classList.add("drive-card");

            card.innerHTML = `
                <h3>${drive.title}</h3>

                <p>
                    <strong>Location:</strong>
                    ${drive.location}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${drive.date}
                </p>

                <p>
                    <strong>Institution:</strong>
                    ${drive.institution || "N/A"}
                </p>

                <p>${drive.description}</p>

                <a href="volunteer.html">
                    <button>Join as Volunteer</button>
                </a>

                <a href="patient.html">
                    <button>Register as Patient</button>
                </a>
            `;

            drivesContainer.appendChild(card);

        });
    }


    if (filterBtn) {

        filterBtn.addEventListener("click", () => {

            const value =
                dropdown.value;

            let url =
                "http://localhost:3000/drives";

            if (value && filterType) {

                url += `?${filterType}=${encodeURIComponent(value)}`;
            }

            loadDrives(url);

        });
    }


    loadDrives();
}


const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const ngoName =
                document.getElementById(
                    "ngoName"
                ).value;

            const email =
                document.getElementById(
                    "email"
                ).value;

            const password =
                document.getElementById(
                    "password"
                ).value;

            const response =
                await fetch(
                    "http://localhost:3000/signup",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                            "application/json"
                        },
                        body: JSON.stringify({
                            ngoName,
                            email,
                            password
                        })
                    }
                );

            const result =
                await response.json();

            alert(result.message);

            if(result.success) {

                window.location.href =
                    "login.html";
            }
        }
    );
}