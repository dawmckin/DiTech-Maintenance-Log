import formatDuration from "../../format-duration";
import formatShift from "../../format-shift";


export default function addRawWorklogsWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Raw Worklogs');

    worksheet.columns = [
        {header: 'Ticket ID', key: 'ticketId'},
        {header: 'Status', key: 'status'},
        {header: 'Start Time', key: 'startTime'},
        {header: 'End Time', key: 'endTime'},
        {header: 'Shift', key: 'shift'},
        {header: 'Downtime', key: 'downtime'},
        {header: 'Workstation', key: 'workstation'},
        {header: 'Location', key: 'location'},
        {header: 'Equipment ID', key: 'equipmentId'},
        {header: 'Equipment Name', key: 'equipmentName'},
        {header: 'Issue Type', key: 'issueType'},
        {header: 'Issue Description', key: 'issueDescription'},
        {header: 'Work Performed', key: 'workPerformed'},
        {header: 'Created By', key: 'createdBy'}
    ];

    worklogs.forEach(log => {
        worksheet.addRow({
            ticketId: log.ticket_id,
            status: log.issue_status,
            startTime: log.start_time,
            endTime: log.end_time ?? '',
            shift: formatShift(log.start_time),
            downtime: formatDuration(((log.end_time) ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time)),
            workstation: log.workstation_id,
            location: log.workstations?.location_site,
            equipmentId: log.equipment?.plex_equipment_id,
            equipmentName: log.equipment?.equipment_name,
            issueType: log.issue_type,
            issueDescription: log.issue_description,
            workPerformed: log.notes[0]?.note_text,
            createdBy: `${log.users?.first_name} ${log.users?.last_name}`
        });
    });

    worksheet.getRow(1).font = {
        bold: true,
        color: {argb: 'FFFFFFFF'}
    };

    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: '1F2937'}
    }

    worksheet.views = [
        {
            state: 'frozen',
            ySplit: 1
        }
    ]
}