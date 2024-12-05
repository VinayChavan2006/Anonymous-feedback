import mongoose, { MongooseError } from "mongoose";

type ConnectionObject = {
    isConnected ?: number;
}

const connection:ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log('DB Already connected')
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '',{})
        console.log(db)
        connection.isConnected = db.connections[0].readyState;
        console.log('DB connected')
    } catch (error) {
        console.log('DB connection failed:',error);
        process.exit(1);
    }
}

export default dbConnect