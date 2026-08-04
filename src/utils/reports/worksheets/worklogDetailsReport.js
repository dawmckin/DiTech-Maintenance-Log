import autoFitColumns from "../autoFitColumns";
import formatDateTime from "../../format-date-time";
import formatDuration from "../../format-duration";
import formatShift from "../../format-shift";

export default function addWorklogDetailsWorksheet(workbook, worklogs, toolingIssue = false) {
    const worksheet = workbook.addWorksheet(toolingIssue ? 'Tooling Issues' : 'Worklog Details');

    worksheet.columns = [
        {header: 'Status', key: 'status', width: 10},
        {header: 'Ticket ID', key: 'ticket_id', width: 12},
        {header: 'Start Time', key: 'start_time'},
        {header: 'End Time', key: 'end_time'},
        {header: 'Downtime', key: 'downtime'},
        {header: 'Shift', key: 'shift', width: 8},
        {header: 'Workstation', key: 'workstation_id'},
        {header: 'Location', key: 'location_site'},
        {header: 'PLEX Equipment ID', key: 'equipment_id'},
        {header: 'Equipment Name', key: 'equipment_name'},
        {header: 'Issue Type', key: 'issue_type'},
        {header: 'Issue Description', key: 'issue_description', width: 50},
        {header: 'Work Performed', key: 'notes', width: 50},
        {header: 'Created By', key: 'created_by'}
    ]

    const addRow = (log) => {
        worksheet.addRow({
            status: log.issue_status,
            ticket_id: log.ticket_id,
            start_time: formatDateTime(log.start_time),
            end_time: formatDateTime(log.end_time) ?? "",
            downtime: formatDuration(Date.parse(log.end_time) - Date.parse(log.start_time)),
            shift: formatShift(log.start_time),
            workstation_id: log.workstation_id,
            location_site: log.workstations.location_site?.toUpperCase(),
            equipment_id: log.equipment.plex_equipment_id,
            equipment_name: log.equipment.equipment_name,
            issue_type: log.issue_type,
            issue_description: log.issue_description,
            notes: log.notes?.map(note => note?.note_text).join(", \n\n"),
            created_by: `${log.created_by.first_name} ${log.created_by.last_name}`
        })
    }

    if(toolingIssue) {
        worklogs.filter(log => log.is_tooling_issue === true).forEach(log => {addRow(log)});
    } else {
        worklogs.forEach(log => {addRow(log)});
    }
 

    worksheet.getColumn('status').eachCell({includeEmpty: false}, (cell, rowNumber) => {
        if(rowNumber === 1) return;

        const status = cell.value?.toString().toLowerCase();
        
        if(status === 'completed') {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: '198754'
                }
            }

            cell.font = {
                color: {
                    argb: '198754'
                }
            }
        }

        if(status === 'open') {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: '0d6efd'
                }
            }

            cell.font = {
                color: {
                    argb: '0d6efd'
                }
            }
        }

        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        }

        cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        }
    })

    autoFitColumns(worksheet, 10, 50, ['status', 'shift', 'issue_description', 'notes']);

    worksheet.getColumn("issue_description").alignment = {
        wrapText: true,
        vertical: "top"
    };

    worksheet.getColumn("notes").alignment = {
        wrapText: true,
        vertical: "top"
    };    
    
    worksheet.getColumn("shift").alignment = {
        wrapText: true,
        vertical: "top"
    };

    worksheet.getRow(1).font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }
    };

    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1F2937' }
    }

    worksheet.autoFilter = {
        from: {
            row: 1,
            column: 1
        },
        to: {
            row: 1,
            column: worksheet.columnCount
        }
    }

    worksheet.views = [
        {
            state: 'frozen',
            ySplit: 1
        }
    ]

}