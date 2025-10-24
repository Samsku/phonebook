const NumbersDisplay = ({ persons, onClick }) => (
    <>
        <h2 className="title">Numbers</h2>
        <div>
            {persons.map(person => (
                <p key={person.id}>
                    {person.name} {person.number}
                    <button className="delete-button" style={{ marginLeft: '10px' }} onClick={() => onClick(person.id)}>Delete</button>
                </p>
            ))}
        </div>
    </>
);

export default NumbersDisplay;
