import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt: Date;
}

const messageSchema = new Schema({
    content : {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        default:Date.now,
        required:true
    }
})

export interface User extends Document{
    username: string;
    password: string;
    email: string;
    isAcceptingMessages: boolean;
    isVerified: boolean;
    verifyCode : string;
    verifyCodeExpiry: Date;
    messages: Message[];
}

const userSchema = new Schema({
    username : {
        type: String,
        required : [true,"Username is required"],
        trim: true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match : [/.+\@.+\..+/,'Enter Valid email Address']
    },
    password : {
        type : String,
        required : [true,'Password is required']
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    isVerified : {
        type : String,
        default : false
    },
    verifyCode : {
        type : String,
        required: [true,'Verification Code is required']
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true,'Expiry Code is required']
    },
    messages : [messageSchema]
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',userSchema))

export default userModel