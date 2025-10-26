import { useState, useEffect } from 'react'
import axios from 'axios'
import FilterSearch from './components/FilterSearch'
import PersonForm from './components/PersonForm'
import NumbersDisplay from './components/NumbersDisplay'

const Notification = ({ message, error }) => {
    if (!message && !error) return null
    return (
        <div className={error ? "error" : "notification"}>
            {error || message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get("/persons")
            .then(res => setPersons(res.data))
            .catch(() => showError("Failed to load data"))
    }, [])

    const showNotification = (msg) => {
        setMessage(msg)
        setTimeout(() => setMessage(''), 4000)
    }

    const showError = (msg) => {
        setError(msg)
        setTimeout(() => setError(null), 5000)
    }

    const addPerson = (e) => {
        e.preventDefault()
        const existing = persons.find(p => p.name === newName)
        const newPerson = { name: newName, number: newNumber }

        if (existing) {
            axios.put(`/persons/${existing.id}`, newPerson)
                .then(res => {
                    setPersons(persons.map(p => p.id !== existing.id ? p : res.data))
                    showNotification(`Updated ${newName}`)
                })
                .catch(() => showError(`Failed to update ${newName}`))
        } else {
            axios.post("/persons", newPerson)
                .then(res => {
                    setPersons(persons.concat(res.data))
                    showNotification(`Added ${newName}`)
                })
                .catch(err => showError(err.response.data.error))
        }

        setNewName('')
        setNewNumber('')
    }

    const deletePerson = (id) => {
        const personName = persons.find(p => p.id === id).name;
        axios.delete(`/persons/${id}`)
            .then(() => {
                if (window.confirm(`Delete ${personName}?`)) {
                    setPersons(persons.filter(p => p.id !== id))
                    showNotification(`Deleted ${personName}`)
                } else {
                    showError(`${personName} was not deleted!`)
                }
            })
            .catch(() => showError(`Failed to delete ${personName}`))
    }

    const filtered = Array.isArray(persons)
        ? persons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        : []


    return (
        <div className="container">
            <h1 className="title">Phonebook</h1>
            <Notification message={message} error={error} />

            <FilterSearch search={search} onChange={(e) => setSearch(e.target.value)} />

            <PersonForm
                addPerson={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleNameChange={(e) => setNewName(e.target.value)}
                handleNumberChange={(e) => setNewNumber(e.target.value)}
            />

            <NumbersDisplay persons={filtered} onClick={deletePerson} />
        </div>
    )
}

export default App
