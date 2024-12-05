import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/models/User";
import { toast } from "@/hooks/use-toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const date:Date = new Date(message.createdAt)
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      if (response.data.success) {
        toast({
          title: response.data.message,
        });
        onMessageDelete(message._id as string);
      }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to Delete',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Card className="relative p-6">
        <CardHeader>
          <CardTitle>
            {message.content}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="absolute top-0 right-0 m-2 z-10">
                  <Trash2 className="w-5 h-5 bg-red-500 text-white" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure, You want to Delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardTitle>
          <CardDescription className="text-black">{date.toDateString()}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MessageCard;
