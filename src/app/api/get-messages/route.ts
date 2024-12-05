import { getServerSession } from "next-auth";
import userModel from "@/models/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
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
    const userId = new mongoose.Types.ObjectId(_user._id);
    const user = await userModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
    
    console.log('here in route',user)
    if (!user || user.length === 0) {
      return Response.json({
        success: false,
        message: "Messages not found",
      });
    }

    return Response.json(
      {
        success: true,
        message: "Messages loaded",
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Get Messages : ", error);
    return Response.json(
      {
        success: false,
        message: "Unable to fetch Messages",
      },
      { status: 500 }
    );
  }
}
