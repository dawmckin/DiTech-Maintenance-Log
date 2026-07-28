import formatDuration from "../../format-duration";
import autoFitColumns from "../autoFitColumns";

export default function addProblemWorkstationsWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Problem Workstations');

    const workstationSummary = {};

    worklogs.forEach(log => {
        const workstationId = log.workstation_id;

        if(!workstationId) return;

        const location = log.workstations?.location_site;

        const downtime = ((log.end_time) ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        if(!workstationSummary[workstationId]) {
            workstationSummary[workstationId] = {
                location,
                ticketCount: 0,
                totalDowntime: 0
            }
        }

        workstationSummary[workstationId].ticketCount++;

        workstationSummary[workstationId].totalDowntime += downtime;
    });

    const rows = Object.entries(workstationSummary).map(([id, data]) => (
        {
            workstationId: id,
            location: data.location,
            ticketCount: data.ticketCount,
            totalDowntime: data.totalDowntime,
            avgDowntime: data.totalDowntime / data.ticketCount,
            impactScore: Math.round(data.ticketCount * data.totalDowntime / (1000 * 60 * 60))
        }
    ));

    rows.sort((a, b) => b.ticketCount - a.ticketCount);

    worksheet.columns = [
        {header: 'Rank', key: 'rank'},
        {header: 'Workstation', key: 'workstationId'},
        {header: 'Location', key: 'location'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'},
        {header: 'Impact Score', key: 'impactScore'}
    ];

    rows.forEach((row, index) => {
        worksheet.addRow({
            rank: index + 1,
            workstationId: Number.parseInt(row.workstationId),
            location: row.location.toUpperCase(),
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
        to: "G1"
    };

    worksheet.eachRow((row, rowNumber) => {
        if(rowNumber === 1) return;

        const ticketCount = row.getCell(4).value;

        if(ticketCount >= 20) {
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

    const centeredCols = ['A', 'D'];

    centeredCols.forEach(col => {
        worksheet.getColumn(col).alignment = {
            horizontal: 'center'
        }
    });

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