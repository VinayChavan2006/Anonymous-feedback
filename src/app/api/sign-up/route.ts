import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from 'bcryptjs'

export async function POST(request:Request) {
    // Connect DB
    await dbConnect();
    try {
        const { username , password , email } = await request.json();
        // Check if verified User already exists with this username
        const verifiedUserByUserName = await userModel.findOne({
            username,
            isVerified:true
        }) 

        if(verifiedUserByUserName){
            return Response.json({
                success: false,
                message: 'Username already exists'
            },{status : 400});
        };

        const existingUserByEmail = await userModel.findOne({
            email,
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message : 'Email is already registered'
                },{status : 400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{

            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            // If user doesnot exist then save a new user
            const newUser = new userModel({
                username,
                password: hashedPassword,
                email,
                isAcceptingMessages: true,
                isVerified: false,
                verifyCode ,
                verifyCodeExpiry: expiryDate,
                messages: []
            })

            // save user 
            await newUser.save()
        }

        // send Verification Email 
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message : emailResponse.message
            },{status : 500})
        }

        return Response.json({
            success: true,
            message : 'User Registered Succesfully.Please verify your email'
        },{status : 201})

    } catch (error) {
        console.error('Error registering user',error);
        return Response.json({
            success:false,
            message : 'Error Registering User'
        },{status : 500})
    }
}