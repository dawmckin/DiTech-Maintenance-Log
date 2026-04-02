import formatDuration from "../../kpi-utils/format-duration";
import ExpandedRowData from "./../../mock-data/log-history-expanded.json";
import "./history-table.css";

export default function ExpandedRow({ticketId, colSpan, isExpanded}) {
    const logData = ExpandedRowData[0];
    const duration = logData.end_time ? new Date(logData.end_time) - new Date(logData.start_time) : 
                                        new Date() - new Date(logData.start_time);

    return (
        <tr className="expanded-row">
            <td colSpan={colSpan}>
                <div className={`expanded-wrapper ${isExpanded ? "open" : ""}`}>
                    <div className="expanded-content">
                    
                    <div className="expanded-left">
                        <p className="mt-0"><strong>Created By:</strong> {logData.created_by}</p>
                        <p><strong>Downtime:</strong> {formatDuration(duration)}</p>
                    </div>

                    <div className="expanded-right">
                        <p className="notes-title"><strong>Notes:</strong></p>
                        <ul className="notes-list ml-3">
                        {logData.notes.map((note, index) => (
                            <li key={index}>
                            <strong>({note.user})</strong> - {note.text}
                            </li>
                        ))}
                        </ul>
                    </div>

                    </div>
                </div>
            </td>
        </tr>
    )

}