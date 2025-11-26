import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const user = require("./Databases/userInfo");
const trip = require("./Databases/tripInfo");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Driver Score Backend is running successfully!");
});


app.post("/register", (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    user.create(username, password, email, name, (err, result) => {
        if (err) {
            console.error("Error registering user:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
        res.status(201).json({ message: "User registered successfully." });
    });
});

app.post("/login", (req, res) => {
    const { username } = req.body;
    user.login(username, (err, result) => {
        if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid username." });
        }
        res.status(200).json({ message: "Login successful.", user: result[0] });
    });
});


app.post("/trip", (req, res) => {
    const data = req.body;

    trip.create(data.user_id,
        data.start_lat,
        data.start_long,
        data.end_lat,
        data.end_long,
        data.startTime,
        data.endTime,
        (err, result) => {
            if (err) {
                console.error("Error creating trip:", err);
                return res.status(500).json({ message: "Internal server error." });
            }
            res.send("trip logged sucessfully");
        }
    );
});

app.get("/trips/: user_id", (req, res) => {
    const user_id = req.params.user_id;

    trip.getByUser(user_id, (err, rows) => {
        if (err) {
            console.error("Error fetching trips:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
        res.status(200).json({ trips: rows });
    });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


