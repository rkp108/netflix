import dotenv from "dotenv";

dotenv.config({
    path:".env"
})
import mongoose, { connect } from "mongoose";


const databaseConnection = async () => {
   await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected successfully to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error:", err);
  });
}
export default databaseConnection;


