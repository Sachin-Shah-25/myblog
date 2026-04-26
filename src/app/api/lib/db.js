import mongoose from 'mongoose'
import dotenv from 'dotenv'
// console.log(process.env ,"loadi hua hai ")
const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
    throw new Error("Unable to to find path ")
}

let cached = global.mongoose || { conn: null, promise: null }
export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI);
    }
    cached.conn = await cached.promise;
    global.mongoose = cached
    console.log("Mongoosed Connected")

    return cached.conn

}
