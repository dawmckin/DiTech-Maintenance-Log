import formatDuration from "../../format-duration";
import autoFitColumns from "../autoFitColumns";

export default function addDowntimeSummaryWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Downtime Summary');

    const equipmentSummary = {};

    worklogs.forEach(log => {
        const equipmentId = log.equipment?.plex_equipment_id;

        if(!equipmentId) return;

        const downtime = ((log.end_time ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time));

        if(!equipmentSummary[equipmentId]) {
            equipmentSummary[equipmentId] = {
                equipmentName: log.equipment?.equipment_name,
                ticketCount: 0,
                totalDowntime: 0,
                workstationId: log.workstation_id
            };
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
            avgDowntime: data.totalDowntime / data.ticketCount,
            workstationId: data.workstationId

        }
    ));

    rows.sort((a, b) => b.totalDowntime - a.totalDowntime);

    worksheet.columns = [
        {header: 'Rank', key: 'rank'},
        {header: 'Equipment ID', key: 'equipmentId'},
        {header: 'Equipment Name', key: 'equipmentName'},
        {header: 'Workstation', key: 'workstationId'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'}
    ];

    rows.forEach((row, index) => {
        worksheet.addRow({
            rank: index + 1,
            equipmentId: row.equipmentId,
            equipmentName: `${row.equipmentName}`,
            workstationId: row.workstationId,
            ticketCount: row.ticketCount,
            totalDowntime: formatDuration(row.totalDowntime),
            avgDowntime: formatDuration(row.avgDowntime), 
        });
    });

    worksheet.getRow(1).font = {
        bold: true,
        color: {
            argb: "FFFFFFFF"
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
        to: "G1"
    };

    rows.slice(0, 5).forEach((_, index) => {
        const row = worksheet.getRow(index + 2);

        row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FEE2E2'
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
}