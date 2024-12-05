'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VerificationPage = () => {
  // Toast
  const { toast } = useToast();

  // Routing
  const router = useRouter();

  // Get Params '/verify/username'
  const params = useParams();

  // create a form
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues : {
      code : ""
    }
  });

  useEffect(()=>{
    const getUserByUsername = async()=>{
      const response = await axios.post('/api/get-user',{
        username: params.username
      })
      if(response.data.success){
        form.setValue('code',response.data.code)
      }
    }
    getUserByUsername()
  },[params.username,form])

  // onSubmit
  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      if (response.data.success) {
        toast({
          title: "Successfull",
          description: "OTP Verified Successfully.",
        });
        router.replace('/sign-in')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const ErrorMsg = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: ErrorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerificationPage;
