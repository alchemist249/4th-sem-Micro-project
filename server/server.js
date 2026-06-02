const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

/* -------------------- DRIVES -------------------- */

function getDrives() {

    const data =
        fs.readFileSync("drives.json");

    return JSON.parse(data);

}

function saveDrives(drives) {

    fs.writeFileSync(
        "drives.json",
        JSON.stringify(drives, null, 2)
    );

}

/* -------------------- NGOS -------------------- */

function getNGOs() {

    const data =
        fs.readFileSync("ngos.json");

    return JSON.parse(data);

}

function saveNGOs(ngos) {

    fs.writeFileSync(
        "ngos.json",
        JSON.stringify(ngos, null, 2)
    );

}
/* -------------------- Volunteers -------------------- */

function getVolunteers() {

    const data =
        fs.readFileSync("volunteers.json");

    return JSON.parse(data);

}

function saveVolunteers(volunteers) {

    fs.writeFileSync(
        "volunteers.json",
        JSON.stringify(volunteers, null, 2)
    );

}

/* -------------------- ROUTES -------------------- */

app.get("/", (req, res) => {

    res.send("HealthBridge Backend Running");

});

/* GET ALL / FILTER DRIVES */

app.get("/drives", (req, res) => {

    let drives = getDrives();

    const {
        location,
        institution,
        month
    } = req.query;

    if (location) {

        drives = drives.filter(
            drive =>
            drive.location === location
        );

    }

    if (institution) {

        drives = drives.filter(
            drive =>
            drive.institution === institution
        );

    }

    if (month) {

        drives = drives.filter(
            drive =>
            drive.month === month
        );

    }

    res.json(drives);

});

/* CREATE DRIVE */

app.post("/create-drive", (req, res) => {

    try {

        const drive = req.body;

        const drives = getDrives();

        drives.push(drive);

        saveDrives(drives);

        res.json({
            success: true,
            message: "Drive Created Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

/* NGO SIGNUP */

app.post("/signup", (req, res) => {

    const {
        ngoName,
        email,
        password
    } = req.body;

    const ngos = getNGOs();

    const existingNGO =
        ngos.find(
            ngo => ngo.email === email
        );

    if (existingNGO) {

        return res.json({
            success: false,
            message: "Email already registered"
        });

    }

    ngos.push({
        ngoName,
        email,
        password
    });

    saveNGOs(ngos);

    res.json({
        success: true,
        message: "Signup Successful"
    });

});

/* NGO LOGIN */

app.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    const ngos = getNGOs();

    const ngo =
        ngos.find(
            ngo =>
                ngo.email === email &&
                ngo.password === password
        );

    if (!ngo) {

        return res.json({
            success: false,
            message: "Invalid Credentials"
        });

    }

    res.json({
        success: true,
        ngoName: ngo.ngoName
    });

});

/* START SERVER */

app.listen(3000, () => {

    console.log("Server running on port 3000");

});