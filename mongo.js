import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.log("Url not found");
    process.exit(1);
}


const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

const personSchema = new mongoose.Schema({
    name: String, number: String,
})

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 2) {
    console.log("Phonebook:");
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number);
        })
        mongoose.connection.close();
    })
} else if (process.argv.length === 4) {
    const name = process.argv[2];
    const number = process.argv[3];

    const person = new Person({
        name: name, number: number,
    })

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    })
}
