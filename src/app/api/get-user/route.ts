import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";



export async function POST(request:Request) {
    // Connect DB
    await dbConnect();
    try {
        const { username } = await request.json();
        // Check if verified User already exists with this username
        const UserByUsername = await userModel.findOne({
            username
        }) 

        if(!UserByUsername){
            return Response.json({
                success: false,
                message: 'Username doesnot exists'
            },{status : 400});
        };
        return Response.json({
            success:true,
            message : 'User details fetched',
            code : UserByUsername.verifyCode
        })

    } catch (error) {
        console.error('Error finding user',error);
        return Response.json({
            success:false,
            message : 'Error finding User'
        },{status : 500})
    }
}