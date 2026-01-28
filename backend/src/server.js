const express = require("express");
const cors = require("cors");

const facultyAuthRoutes = require("./routes/facultyAuth.routes");
const studentAuthRoutes = require("./routes/studentAuth.routes");
const adminAuthRoutes = require("./routes/adminAuth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth/faculty", facultyAuthRoutes);
app.use("/auth/student", studentAuthRoutes);
app.use("/auth/admin", adminAuthRoutes);

// Admin protected routes
app.use("/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
