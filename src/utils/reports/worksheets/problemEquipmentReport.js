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
                totalDowntime: 0
            }
        }

        equipmentSummary[equipmentId].ticketCount++;

        equipmentSummary[equipmentId].totalDowntime += downtime;


    });

    const rows = Object.entries(equipmentSummary).map(([id, data]) => (
        {
            equipmentId: id,
            equipmentName: data.equipmentName,
            ticketCount: data.ticketCount,
            totalDowntime: data.totalDowntime,
            avgDowntime: data.totalDowntime / data.ticketCount
        }
    ));

    rows.sort((a, b) => b.ticketCount - a.ticketCount);

    worksheet.columns = [
        {header: 'Rank', key: 'rank'},
        {header: 'Equipment ID', key: 'equipmentId'},
        {header: 'Equipment Name', key: 'equipmentName'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'}
    ];

    rows.forEach((row, index) => {
        worksheet.addRow({
            rank: index + 1,
            equipmentId: row.equipmentId,
            equipmentName: row.equipmentName,
            ticketCount: row.ticketCount,
            totalDowntime: formatDuration(row.totalDowntime),
            avgDowntime: formatDuration(row.avgDowntime), 
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

        const ticketCount = row.getCell(4).value;

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

    autoFitColumns(worksheet, 10, 60, ['rank']);

    worksheet.getColumn('A').alignment = {
        horizontal: 'center'
    };

    worksheet.getColumn('D').alignment = {
        horizontal: 'center'
    };
}