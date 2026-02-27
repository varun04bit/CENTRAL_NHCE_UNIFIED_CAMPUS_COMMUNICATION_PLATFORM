
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const studentAuthRoutes = require("./routes/studentAuth.routes");
const facultyAuthRoutes = require("./routes/facultyAuth.routes");
const adminAuthRoutes = require("./routes/adminAuth.routes");
const adminRoutes = require("./routes/admin.routes");
const announcementRoutes = require("./routes/announcement.routes");
const metaRoutes = require("./routes/meta.routes");
const uploadRoutes = require("./routes/upload.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
//const notification = require("./routes/notification.routes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes); //facult or student login
app.use("/auth/student", studentAuthRoutes); //student signup
app.use("/auth/faculty", facultyAuthRoutes); // to update the password
app.use("/auth/admin", adminAuthRoutes); // admin login
app.use("/admin", adminRoutes); //to create the faculty
app.use("/announcements", announcementRoutes); // announcement functions
app.use("/meta", metaRoutes); // import the department and program
app.use("/api",uploadRoutes); // to upload the media 
app.use("/", newsletterRoutes);
//app.use("/notification",notification);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
