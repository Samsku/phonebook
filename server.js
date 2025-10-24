import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


const PORT = 3001;

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// Get all contacts
app.get("/api/persons", (req, res) => {
    res.json(persons)
});

app.get("/info", (req, res) => {
    const date = new Date();
    const count = persons.length;
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        return res.json(person)
    }
    res.status(404).end();
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({error: "Name is missing"})
    }
    if (!body.number) {
        return res.status(400).json({error: "Number is missing"})
    }

    const personExists = persons.find(person => person.name === body.name);
    if (personExists) {
        return res.status(400).json({error: "Person exists"})
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    res.json(person);
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
