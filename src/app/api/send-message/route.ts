import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await userModel.findOne({ username });
    console.log('isacc',user?.isAcceptingMessages)
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User does not accept messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message", error);
    return Response.json(
      {
        success: false,
        message: "Error Sending Message",
      },
      { status: 500 }
    );
  }
}
