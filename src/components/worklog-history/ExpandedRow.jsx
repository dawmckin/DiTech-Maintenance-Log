import formatDuration from "../../utils/format-duration";
import "./history-table.css";

export default function ExpandedRow({logData, colSpan, isExpanded}) {
    const duration = logData.end_time ? new Date(logData.end_time) - new Date(logData.start_time) : 
                                        new Date() - new Date(logData.start_time);

    return (
        <tr className="expanded-row">
            <td colSpan={colSpan}>
                <div className={`expanded-wrapper ${isExpanded ? "open" : ""}`}>
                    <div className="expanded-content">
                    
                        <div className="expanded-left">
                            <p className="mt-0"><strong>Created By: </strong>{logData.name}</p>
                            <p><strong>Downtime: </strong>{formatDuration(duration)}</p>
                            <p><strong>Tooling Issue: </strong> 
                                {
                                    (logData.is_tooling_issue !== null) ? 
                                        ((logData.is_tooling_issue === true) ? <span>Yes</span> : <span>No</span>) :
                                        '--'
                                }
                            </p>
                        </div>

                        <div className="expanded-right row">
                            <div className="col-md-5">
                                <p className="notes-title"><strong>Description:</strong></p>
                                <p>{logData?.issue_description}</p>
                            </div>

                            {
                                logData.notes?.length > 0 && (
                                    <div className="col-md-7">
                                        <p className="notes-title"><strong>Notes:</strong></p>
                                        <p>{logData?.notes[0]?.note_text}</p>
                                        {/* <ul className="notes-list ml-3">
                                            {logData.notes?.map((note, index) => (
                                                <li key={index}>
                                                    {note.note_text}
                                                </li>
                                            ))}
                                        </ul> */}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    )

}