const PersonForm = ({ addPerson, handleNameChange, handleNumberChange, newName, newNumber }) => (
    <form onSubmit={addPerson} className="form">
        <div>
            Name: <input className="input" value={newName} onChange={handleNameChange} placeholder="Name..."/>
        </div>
        <div>
            Number: <input className="input" value={newNumber} onChange={handleNumberChange} placeholder="Number..."/>
        </div>
        <button className="add-button" type="submit">Add</button>
    </form>
);

export default PersonForm;
