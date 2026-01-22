const express = require("express");
const cors = require("cors");

const facultyAuthRoutes = require("./routes/facultyAuth.routes");
const studentAuthRoutes = require("./routes/studentAuth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/faculty", facultyAuthRoutes);
app.use("/auth/student", studentAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
