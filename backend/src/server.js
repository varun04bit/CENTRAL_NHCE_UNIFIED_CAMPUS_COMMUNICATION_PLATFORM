const express = require("express");
const facultyAuthRoutes = require("./routes/facultyAuth.routes");

const app = express();
app.use(express.json());

app.use("/auth/faculty", facultyAuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
