
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
const announcementAIRoutes = require("./routes/announcementAI.routes");
const metaRoutes = require("./routes/meta.routes");
const uploadRoutes = require("./routes/upload.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
//const notification = require("./routes/notification.routes");
const userRoutes = require("./routes/user.routes");


const app = express();

// app.use(cors());
// app.use(cors({
//   origin: true, // allow mobile apps
//   credentials: true
// }));
const allowedOrigins = [
  process.env.ADMIN_PANEL_URL,   // production admin panel
  "http://localhost:3000",
  "http://localhost:8081"
];

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow mobile apps & Postman (no origin)
    if (!origin) return callback(null, true);

    // 2. Allow known web apps
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Allow Render preview domains (important)
    if (origin.includes("onrender.com")) {
      return callback(null, true);
    }

    // Block others
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Announcement API is running 🚀");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/auth", authRoutes); //facult or student login
app.use("/auth/student", studentAuthRoutes); //student signup
app.use("/auth/faculty", facultyAuthRoutes); // to update the password
app.use("/auth/admin", adminAuthRoutes); // admin login
app.use("/admin", adminRoutes); //to create the faculty
app.use("/announcements", announcementRoutes); // announcement functions
app.use("/announcements", announcementAIRoutes); // AI draft generation
app.use("/meta", metaRoutes); // import the department and program
app.use("/api",uploadRoutes); // to upload the media 
app.use("/", newsletterRoutes);
//app.use("/notification",notification);
// app.use("/notification",notification);
app.use("/users",userRoutes);


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
