import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import { z } from "zod";

const VerifyCodeQuerySchema = z.object({
  verifyCode: verifyCodeSchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = code === user.verifyCode;
    const isCodeUnexpired = new Date(user.verifyCodeExpiry) >= new Date();

    if (isCodeValid && isCodeUnexpired) {
      // Update user as verified
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeUnexpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code has expired.Please SignUp again.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying User",
      },
      { status: 500 }
    );
  }
}
