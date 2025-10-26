import express from "express"
import morgan from "morgan"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import Person from "./models/person.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

// Serve frontend static files first
app.use(express.static(path.join(__dirname, "../dist")))

app.get("/info", (req, res) => {
    Person.countDocuments().then(count => {
        res.send(`<p style="font-size: 1.2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: green">Phonebook has info for ${count} people</p>`)
    })
})

app.get("/api/persons", (req, res) =>{
    Person.find({}).then(persons => {
        res.json(persons);
    })
})
app.get("/api/persons/:id", async (req, res, next) => {
    Person.findById(req.params.id)
        .then(note => {
            if (note) res.json(note);
            else res.status(404).end();
        })
        .catch(error => {
            console.log(error);
            next(error);
        })
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name or number missing" });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => {
        res.status(400).json({ error: error.message })
    })
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;
    Person.findByIdAndUpdate(req.params.id, body, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => {
            console.log(error);
            next(error);
        })
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => {
            console.log(error);
            next(error);
        })
})

// Fallback for React Router — serve index.html for non-API GET requests
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    } else {
        next();
    }
});

// Error handler
const errorHandler = (error, req, res, next) => {
    console.error(error)
    res.status(500).json({ error: error.message })
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
