// const express = require("express");
// const cors = require("cors");

// const facultyAuthRoutes = require("./routes/facultyAuth.routes");
// const studentAuthRoutes = require("./routes/studentAuth.routes");
// const authRoutes = require("./routes/auth.routes");//


// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/auth", authRoutes); //
// app.use("/auth/faculty", facultyAuthRoutes);
// app.use("/auth/student", studentAuthRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const studentAuthRoutes = require("./routes/studentAuth.routes");
const facultyAuthRoutes = require("./routes/facultyAuth.routes");
const adminAuthRoutes = require("./routes/adminAuth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);
app.use("/auth/student", studentAuthRoutes);
app.use("/auth/faculty", facultyAuthRoutes);
app.use("/auth/student", studentAuthRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
