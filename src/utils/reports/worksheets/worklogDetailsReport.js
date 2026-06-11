import ExcelJS from "exceljs";
import autoFitColumns from "./autofitColumns";
import formatDateTime from "../../format-date-time";
import formatDuration from "../../format-duration";

export function addWorklogDetailsWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Worklog Details');

    // worksheet.columns = [
    //     {header: 'Status', key: 'status', width: 15},
    //     {header: 'Start Time', key: 'start_time', width: 22},
    //     {header: 'End Time', key: 'end_time', width: 22},
    //     {header: 'Workstation ID', key: 'workstation_id', width: 20},
    //     {header: 'Location', key: 'location_site', width: 20},
    //     {header: 'Equipment ID', key: 'equipment_id', width: 30},
    //     {header: 'Equipment Name', key: 'equipment_name', width: 30},
    //     {header: 'Issue Type', key: 'issue_type', width: 20},
    //     {header: 'Issue Description', key: 'issue_description', width: 50},
    //     {header: 'Work Performed', key: 'notes', width: 50},
    //     {header: 'Created By', key: 'created_by', width: 25},
    //     {header: 'Downtime', key: 'downtime', width: 15}
    // ]
    worksheet.columns = [
        {header: 'Status', key: 'status', width: 10},
        {header: 'Start Time', key: 'start_time'},
        {header: 'End Time', key: 'end_time'},
        {header: 'Workstation ID', key: 'workstation_id'},
        {header: 'Location', key: 'location_site'},
        {header: 'PLEX Equipment ID', key: 'equipment_id'},
        {header: 'Equipment Name', key: 'equipment_name'},
        {header: 'Issue Type', key: 'issue_type'},
        {header: 'Issue Description', key: 'issue_description', width: 50},
        {header: 'Work Performed', key: 'notes', width: 50},
        {header: 'Created By', key: 'created_by'},
        {header: 'Downtime', key: 'downtime'}
    ]

    worklogs.forEach(log => {
        worksheet.addRow({
            status: log.issue_status,
            start_time: formatDateTime(log.start_time),
            end_time: formatDateTime(log.end_time) ?? "",
            workstation_id: log.workstation_id,
            location_site: log.workstations.location_site?.toUpperCase(),
            equipment_id: log.equipment.plex_equipment_id,
            equipment_name: log.equipment.equipment_name,
            issue_type: log.issue_type,
            issue_description: log.issue_description,
            notes: log.notes[0]?.note_text ?? "",
            created_by: `${log.users.first_name} ${log.users.last_name}`,
            downtime: formatDuration(Date.parse(log.end_time) - Date.parse(log.start_time))
        })
    });

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

    autoFitColumns(worksheet, 10, 50, ['status', 'issue_description', 'notes']);

    worksheet.getColumn("issue_description").alignment = {
        wrapText: true,
        vertical: "top"
    };

    worksheet.getColumn("notes").alignment = {
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