import formatDuration from "../../kpi-utils/format-duration";

export default function ExpandedRow({log, colSpan}) {
    const duration = log.end_time ? new Date(log.end_time) - new Date(log.start_time) : 
                                    new Date() - new Date(log.start_time);

    return (
        <tr className="expanded-row">
            <td colSpan={colSpan}>
                <div className="expanded-content">
                    {/* <p><strong>Created By: </strong>{log.created_by}</p>
                    <p><strong>Downtime: </strong>{duration}</p>
                    <p><strong>Notes: </strong>{log.notes}</p> */}
                                        <p><strong>Created By: </strong>Dalton Mckinney</p>
                    <p><strong>Downtime: </strong>3h 12m</p>
                    <p><strong>Notes: </strong>Blah blah blah.</p>
                </div>
            </td>
        </tr>
    )

}