const FilterSearch = ({ search, onChange }) => (
    <div>
        Search: <input className="input" value={search} onChange={onChange} placeholder="Search..." />
    </div>
);

export default FilterSearch;
