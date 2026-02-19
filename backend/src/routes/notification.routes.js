const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

router.post("/register-token", async (req, res) => {
    const {studentId, expoPushToken} = req.body;

    await prisma.student.update({
        where: {id: studentId},
        data: {
            expoPushToken,
            pushEnabled: true,
            pushTokenUpdatedAt: new Data(),
        },
    });
    res.json({message: "Push token register"});
});

module.exports = router;
