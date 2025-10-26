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
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            // Validate that the form is in correct form
            validator: (v) => /^\d{2,3}-\d+$/.test(v),
            message: (props) => `${props.value} is not a valid phone number!`
        }
    }
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
