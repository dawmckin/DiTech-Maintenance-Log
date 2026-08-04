import formatDuration from "../../format-duration";
import formatShift from "../../format-shift";


export default function addRawWorklogsWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Raw Worklogs');

    worksheet.columns = [
        {header: 'ticket_id', key: 'ticketId'},
        {header: 'status', key: 'status'},
        {header: 'start_time', key: 'startTime'},
        {header: 'end_time', key: 'endTime'},
        {header: 'shift', key: 'shift'},
        {header: 'downtime', key: 'downtime'},
        {header: 'workstation', key: 'workstation'},
        {header: 'location', key: 'location'},
        {header: 'equipment_id', key: 'equipmentId'},
        {header: 'equipment_name', key: 'equipmentName'},
        {header: 'issue_type', key: 'issueType'},
        {header: 'issue_description', key: 'issueDescription'},
        {header: 'work_performed', key: 'workPerformed'},
        {header: 'created_by', key: 'createdBy'}
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
            workPerformed: log.notes?.map(note => note?.note_text).join(", \n\n"),
            createdBy: `${log.created_by?.first_name} ${log.created_by?.last_name}`
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