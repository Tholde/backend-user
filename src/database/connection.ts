import mongoose from "mongoose";

// mongoose.connect("mongodb://localhost:27017/", {
//     dbName: "vao",
// }).then(() => {
//     console.log("Connected to MongoDB");
// }).catch(err => console.log(err));

export const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/", {
            dbName: "vao",
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};