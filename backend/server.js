import express from "express"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// API Routes
app.get("/api/persons", (req, res) => res.json(persons))

app.get("/info", (req, res) => {
    const date = new Date()
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body

    if (!name || !number)
        return res.status(400).json({ error: "Name or number missing" })

    if (persons.find(p => p.name === name))
        return res.status(400).json({ error: "Name must be unique" })

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name,
        number
    }

    persons.push(person)
    res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
