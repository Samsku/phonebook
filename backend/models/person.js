import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    console.log("Url not found");
    process.exit(1);
}

mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model("Person", personSchema);

export default Person;
