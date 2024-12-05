import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/emailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'AnonymousFeedback: Verification Code',
            react: VerificationEmail({ username,otp:verifyCode}),
        });
        return {
            success: true,
            message: 'Verification Email sent Succesfully'
        }
    } catch (emailError) {
        console.error('Error in sending Verification Email',emailError);
        return {
            success:false,
            message:'Failed to send Verification Email'
        }
    }
}


