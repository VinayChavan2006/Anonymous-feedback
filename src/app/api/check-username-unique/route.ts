import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";
import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format()?.username?._errors || [];
      return Response.json(
        {
          success: false,
          messages:
            userNameErrors.length > 0
              ? userNameErrors.join(", ")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 403 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is valid(unique)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Validating Username", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}
