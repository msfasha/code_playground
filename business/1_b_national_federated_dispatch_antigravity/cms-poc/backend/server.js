const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const incidents = [
  {
    id: 1,
    title: "Traffic Accident - Amman",
    type: "Traffic",
    lat: 31.963158,
    lng: 35.930359,
    status: "Active",
    agency: "Public Security Directorate",
    description: "Two-vehicle collision at 7th Circle."
  },
  {
    id: 2,
    title: "Fire - Zarqa Industrial Zone",
    type: "Fire",
    lat: 32.0708,
    lng: 36.0942,
    status: "Contained",
    agency: "Civil Defense",
    description: "Fire at warehouse, 3 units dispatched."
  },
  {
    id: 3,
    title: "Flood - Irbid Suburb",
    type: "Flood",
    lat: 32.5556,
    lng: 35.85,
    status: "Monitoring",
    agency: "Ministry of Public Works",
    description: "Flooded roads near southern Irbid."
  }
];

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
