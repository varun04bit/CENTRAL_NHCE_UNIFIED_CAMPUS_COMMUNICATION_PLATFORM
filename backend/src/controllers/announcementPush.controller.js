//const prisma = require("../prisma/client");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {sendAnnouncementPush} = require("../services/expoPush.service");

exports.handleAnnouncementPush = async(announcementId) => {
    const announcement = await prisma.announcement.findUnique({
        where: {id: announcementId},
    });

    if(!announcement) return;

    if(
        announcement.expiresAt &&
        new Date(announcement.expiresAt) < new Date()
    ){
        return;
    }

    const studentWhere = {
        programId: announcement.programId,
        departmentId: announcement.departmentId,
        pushEnabled: true,
        expoPushToken: {not: null},
    };

    if(announcement.semester !== null){
        studentWhere.semester = announcement.semester;
    }

    const students = await prisma.student.findMany({
        where: studentWhere,
        select: {
            id: true,
            expoPushToken: true,
        },
    });

    if(students.length === 0) return 0;

    const body = 
        announcement.description.length > 120
            ? announcement.description.slice(0, 120) + "..."
            : announcement.description;

    await sendAnnouncementPush({
        students,
        title: announcement.title,
        body,
        data: {
            announcementId: announcement.id,
            programeId: announcement.programId,
            departmentId: announcement.departmentId,
        },
    });
};