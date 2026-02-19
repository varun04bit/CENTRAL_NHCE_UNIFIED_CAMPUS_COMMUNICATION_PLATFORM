const {Expo} = require("expo-server-sdk");
// const prisma = require("../prisma/client");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const expo = new Expo();

async function sendAnnouncementPush({
    students,
    title,
    body,
    data,
}) {
    const messages = [];

    for(const student of students){
        const token = student.expoPushToken;

        if(!Expo.isExopPushToken(token)) {
            await prisma.student.update({
                data: {
                    expoPushToken: null,
                    pushEnable: false,
                },
            });
            continue;
        }

        messages.push({
            to: token,
            sound: "default",
            title,
            body,
            data,
        });
    }
        
        const chunks = expo.chunkPushNotifications(messages);

        for(const chunk of chunks){
            try{
                const tickets = await expo.sendPushNotificationsAsync(chunk);

                for(let i = 0; i < tickets.length; i++){
                    const ticket = ticket[i];

                    if(
                        ticket.status === "error" &&
                        (ticket.details?.error === "DeviceNotRegistered" ||
                        ticket.details?.error === "InvalidCredentials")
                    ){
                        const failedToken = chunk[i].to;

                        await prisma.student.updateMany({
                            where: {expoPushToken: failedToken},
                            data: {
                                expoPushToken: null,
                                pushEnabled: false,
                            },
                        });
                    }
                }
            }catch (error) {
                console.error("Expo push error : ", error);
            }
        }
    }

module.exports = {sendAnnouncementPush};
