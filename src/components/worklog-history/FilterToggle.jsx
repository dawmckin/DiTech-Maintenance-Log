import "./filter-toggle.css";

export default function FilterToggle({ value, onChange }) {
  return (
    <div className="toggle">
      <button
        className={value === "date" ? "active" : ""}
        onClick={() => onChange("date")}
      >
        Date
      </button>

      <button
        className={value === "workstation" ? "active" : ""}
        onClick={() => onChange("workstation")}
      >
        WS
      </button>

      <div
        className="toggle-slider"
        style={{
          transform: value === "date"
            ? "translateX(0%)"
            : "translateX(100%)"
        }}
      />
    </div>
  );
}