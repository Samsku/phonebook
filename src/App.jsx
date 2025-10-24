import { useState, useEffect } from 'react';
import axios from 'axios';
import FilterSearch from './components/FilterSearch';
import PersonForm from './components/PersonForm';
import NumbersDisplay from './components/NumbersDisplay';

const Notification = ({ message, error }) => {
    if (!message && !error) return null;
    return (
        <div className={error ? "error" : "notification"}>{error || message}</div>
    )
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        axios.get('http://localhost:3001/api/persons')
            .then(response => setPersons(response.data))
            .catch(error => console.error(error));
    }, []);

    // Add or update person
    const addPerson = (e) => {
        e.preventDefault();
        const existingPerson = persons.find(p => p.name === newName);

        if (existingPerson) {
            axios.put(`http://localhost:3001/api/persons/${existingPerson.id}`, { number: newNumber })
                .then(res => setPersons(persons.map(p => p.id !== existingPerson.id ? p : res.data)))
                .catch(() => {
                    setError(`Person with name ${newName} already exists`);
                    setTimeout(() => setError(''), 5000);
                });
        } else {
            const newPerson = { name: newName, number: newNumber };
            axios.post('http://localhost:3001/api/persons', newPerson)
                .then(res => setPersons(persons.concat(res.data)))
                .catch(err => console.error(err));
        }

        setMessage(`Added ${newName}`);
        setTimeout(() => setMessage(''), 5000);

        setNewName('');
        setNewNumber('');

    };

    // Delete person
    const deletePerson = (id) => {
        const person = persons.find(p => p.id === id);
        if (!person) {
            setError(`Person with name ${person.name} not found`);
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (window.confirm(`Delete ${person.name}?`)) {
            axios.delete(`http://localhost:3001/api/persons/${id}`)
                .then(() => setPersons(persons.filter(p => p.id !== id)))
                .catch(() => {
                    setError(`Person with name ${person.name} not found`);
                    setTimeout(() => setError(''), 5000);
                    setPersons(persons.filter(p => p.id !== id));
                });
        }
    };

    const handleNameChange = (e) => setNewName(e.target.value);
    const handleNumberChange = (e) => setNewNumber(e.target.value);
    const handleSearchChange = (e) => setSearch(e.target.value);

    const filteredPersons = persons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1 className="title">Phonebook</h1>
            <Notification message={message} error={error} />
            <FilterSearch search={search} onChange={handleSearchChange} />
            <PersonForm
                addPerson={addPerson}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                newName={newName}
                newNumber={newNumber}
            />
            <NumbersDisplay persons={filteredPersons} onClick={deletePerson} />
        </div>
    );
};

export default App;
