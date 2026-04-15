import "./KPICard.css";

export default function KPICard({title, value, optionalClass=""}) {

    return(
        <div className={`kpi-card ${optionalClass}`}>
            <div className="kpi-title">{title}</div>
            <div className="kpi-value">{value}</div>
        </div>
    )
}