import { getServerSession } from "next-auth";
import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "User not authenticated",
    });
  }
  const userId = user?._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Accept Messages status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating acceptMessages status");
    return Response.json(
      {
        success: false,
        message: "Error in updation of accept Message status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User Not found",
      },
      { status: 401 }
    );
  }

  try {
    const userId = user?._id;
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message : 'Failed to fetch accept-messages status',
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unable to find User to fetch acceptMessage status", error);
    return Response.json(
      {
        success: false,
        message: "User Not found",
      },
      { status: 500 }
    );
  }
}
