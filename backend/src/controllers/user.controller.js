const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCurrentUserEmail = async (req, res) => {
    try{
        const{ id, role } = req.user;

        let user;
        
        if(role === "STUDENT"){
            user = await prisma.student.findUnique({
                where: {id},
                select: {email : true}
            });
        }else if(role === "FACULTY") {
            user = await prisma.faculty.findUnique({
                where: {id},
                select: {email: true}
            });
        }else{
            return res.status(400).json({message : "Invalide role"});
        }

        if(!user){
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({email: user.email});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};
