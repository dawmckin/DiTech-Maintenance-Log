import formatDuration from "../../format-duration";
import autoFitColumns from "../autoFitColumns";

export default function addProblemEquipmentWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Problem Equipment');

    const equipmentSummary = {};

    worklogs.forEach(log => {
        const equipmentId = log.equipment?.plex_equipment_id;

        if(!equipmentId) return;

        const equipmentName = log.equipment?.equipment_name;

        const downtime = ((log.end_time) ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        if(!equipmentSummary[equipmentId]) {
            equipmentSummary[equipmentId] = {
                equipmentName,
                ticketCount: 0,
                totalDowntime: 0,
                workstationId: log.workstation_id
            }
        }

        equipmentSummary[equipmentId].ticketCount++;

        equipmentSummary[equipmentId].totalDowntime += downtime;


    });

    const rows = Object.entries(equipmentSummary).map(([id, data]) => (
        {
            equipmentId: id,
            equipmentName: data.equipmentName,
            workstationId: data.workstationId,
            ticketCount: data.ticketCount,
            totalDowntime: data.totalDowntime,
            avgDowntime: data.totalDowntime / data.ticketCount,
            impactScore: Math.round(data.ticketCount * data.totalDowntime / (1000 * 60 * 60))
        }
    ));

    rows.sort((a, b) => b.ticketCount - a.ticketCount);

    worksheet.columns = [
        {header: 'Rank', key: 'rank'},
        {header: 'Equipment ID', key: 'equipmentId'},
        {header: 'Equipment Name', key: 'equipmentName'},
        {header: 'Workstation', key: 'workstationId'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'},
        {header: 'Impact Score', key: 'impactScore'}
    ];

    rows.forEach((row, index) => {
        worksheet.addRow({
            rank: index + 1,
            equipmentId: row.equipmentId,
            equipmentName: row.equipmentName,
            workstationId: row.workstationId,
            ticketCount: row.ticketCount,
            totalDowntime: formatDuration(row.totalDowntime),
            avgDowntime: formatDuration(row.avgDowntime), 
            impactScore: row.impactScore
        });
    });

    worksheet.getRow(1).font = {
        bold: true,
        color: {
            argb: 'FFFFFFFF'
        }
    };

       worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: '1F2937'
        }
    };

    worksheet.views = [
        {
            state: 'frozen',
            ySplit: 1
        }
    ];

    worksheet.autoFilter = {
        from: "A1",
        to: "F1"
    };

    worksheet.eachRow((row, rowNumber) => {
        if(rowNumber === 1) return;

        const ticketCount = row.getCell(5).value;

        if(ticketCount >= 10) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FEF3C7'
                }
            }
        }
    });

    autoFitColumns(worksheet);

    worksheet.getColumn('A').alignment = {
        horizontal: 'center'
    };

    worksheet.getColumn('E').alignment = {
        horizontal: 'center'
    };

    worksheet.mergeCells('J14:O21');

    const notesCell = worksheet.getCell('J14');

    notesCell.value = "Impact Score = Ticket Count x Total Downtime (Hours)\n\n" +
    "This score helps identify workstations that generate both frequent maintenance activity and significant production downtime. Higher scores indicate areas that may require corrective actions, process improvements, or additional operator training.";
    
    notesCell.alignment = {
        wrapText: true,
        vertical: 'top'
    };

    notesCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'F3F4F6'}
    };

    notesCell.font = {
        italic: true
    };
}