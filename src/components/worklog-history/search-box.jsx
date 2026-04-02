import "./search-box.css";

export default function SearchBox({ value, onChange, placeholder = "Search logs..." }) {
  return (
    <div className="search-box">
      <span className="search-icon"><i className="bi bi-search"></i></span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange({ target: { value: "" } })}>
          ×
        </button>
      )}
    </div>
  );
}