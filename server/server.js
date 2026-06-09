// import packages and db modls
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const NGO = require("./models/NGO");
const Drive = require("./models/Drive");
const Volunteer = require("./models/Volunteer");
const Patient = require("./models/Patient");

const app = express();

// db conntion stuff
mongoose.connect(
    process.env.MONGODB_URI
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.error(err);
});

// middlewere for json and cross origin api calls
app.use(express.json());
app.use(cors());


// check if server alive
app.get("/", (req, res) => {
    res.send("HealthBridge Backend Running");
});


// get all drives and filter them if query exists
app.get("/drives", async (req, res) => {
    try {
        let drives = await Drive.find();

        const {
            location,
            institution,
            month
        } = req.query;

        // filter by loc, inst, or month
        if (location) {
            drives = drives.filter(
                drive => drive.location === location
            );
        }

        if (institution) {
            drives = drives.filter(
                drive => drive.institution === institution
            );
        }

        if (month) {
            drives = drives.filter(
                drive => drive.month === month
            );
        }

        res.json(drives);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false
        });
    }
});


// save a new driv to db
app.post("/create-drive", async (req, res) => {
    try {
        await Drive.create(req.body);

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

// save volunteer to databse
app.post("/register-volunteer", async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();

        res.status(201).json({
            message: "Volunteer Registered Successfully",
            volunteer
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// save patint data to database
app.post("/register-patient", async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();

        res.status(201).json({
            message: "Patient Registered Successfully",
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// register new ngo account check if email exits
app.post("/signup", async (req, res) => {
    try {
        const {
            ngoName,
            email,
            password
        } = req.body;

        const existingNGO = await NGO.findOne({ email });

        if (existingNGO) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        await NGO.create({
            ngoName,
            email,
            password
        });

        res.json({
            success: true,
            message: "Signup Successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
});


// login authentication hndler
app.post("/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // check clear text creds (temporary fix?)
        const ngo = await NGO.findOne({
            email,
            password
        });

        if (!ngo) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        res.json({
            success: true,
            ngoName: ngo.ngoName,
            ngoId: ngo._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// get all drives for ngo dashboard page
app.get("/my-drives", async (req, res) => {
    try {
        const drives = await Drive.find();
        res.json(drives);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// get volunters for specific drive id
app.get(
    "/volunteers/:driveId",
    async (req, res) => {
        try {
            const volunteers = await Volunteer.find({
                drive: req.params.driveId
            });

            res.json(volunteers);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
});

// fetch patients list by drive id 
app.get(
    "/patients/:driveId",
    async (req, res) => {
        try {
            const patients = await Patient.find({
                drive: req.params.driveId
            });

            res.json(patients);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
});

// start the express servr
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});