import formatDuration from "../../utils/format-duration";
import formatDateTime from "../../utils/format-date-time";
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
                                        {/* <p>{logData?.notes[0]?.note_text}</p> */}
                                        <ul className="notes-list pl-0">
                                            {logData.notes?.map((note, index) => (
                                                <li>
                                                    <div className="row top-meta mb-0">
                                                        <div className="col-md-4">
                                                            <strong>{`${note?.users?.first_name} ${note?.users?.last_name}`}</strong>
                                                            <strong>{`[${formatDateTime(note.created_at)}]`}</strong>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <p className="mb-0">{note.note_text}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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