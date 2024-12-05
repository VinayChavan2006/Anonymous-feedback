import { getServerSession } from "next-auth";
import userModel from "@/models/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const messageId = params.messageid;

  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 401 }
    );
  }
  try {
    const updatedResult = await userModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if(updatedResult.modifiedCount == 0){
      Response.json({
        success : false,
        message : 'Message Not Found'
      },{status : 404})
    }

    return Response.json({
      success : true,
      message : 'Message Deleted Successfully'
    },{status : 200})
  } catch (error) {
    console.error('Error Deleting message',error)
    Response.json({
      success : false,
      message : 'Error Deleting Message'
    },{status : 500})
  }
}
