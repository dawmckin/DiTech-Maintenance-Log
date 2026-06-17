import formatDuration from "../../format-duration";
import autoFitColumns from "../autoFitColumns";

export default function addTechnicianActivityWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Technician Activity');

    const technicianSummary = {};

    worklogs.forEach(log => {
        const technician = `${log.users?.first_name} ${log.users?.last_name}`;

        if(!technicianSummary[technician]) {
            technicianSummary[technician] = {
                ticketCount: 0,
                completed: 0,
                open: 0,
                totalDowntime: 0
            }
        }

        technicianSummary[technician].ticketCount++;

        if(log.issue_status === 'completed') {
            technicianSummary[technician].completed++;
        }        
        
        if(log.issue_status === 'open') {
            technicianSummary[technician].open++;
        }

        const downtime = ((log.end_time) ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        technicianSummary[technician].totalDowntime += downtime;
    });

    const rows = Object.entries(technicianSummary).map(([name, data]) => ({
        technician: name,
        ticketCount: data.ticketCount,
        open: data.open,
        completed: data.completed,
        totalDowntime: data.totalDowntime,
        avgDowntime: data.totalDowntime / data.ticketCount,
        activityScore: Math.round(data.ticketCount * (data.totalDowntime / (1000 * 60 * 60)))
    }));

    rows.sort((a, b) => b.activityScore - a.activityScore);

    worksheet.columns = [
        {header: 'Rank', key: 'rank'},
        {header: 'Technician', key: 'technician'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Open', key: 'open'},
        {header: 'Completed', key: 'completed'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'},
        {header: 'Activity Score', key: 'activityScore'}
    ];

    rows.forEach((row, index) => {
        worksheet.addRow({
            rank: index + 1,
            technician: row.technician,
            ticketCount: row.ticketCount,
            open: row.open,
            completed: row.completed,
            totalDowntime: formatDuration(row.totalDowntime),
            avgDowntime: formatDuration(row.avgDowntime),
            activityScore: row.activityScore
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
        to: "H1"
    };

    const highestScore = Math.max(...rows.map(r => r.activityScore));

    worksheet.eachRow((row, rowNumber) => {
        if(rowNumber === 1) return;

        const score = row.getCell(8).value;

        if(score === highestScore) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'D1FAE5'
                }
            }
        }
    });

    autoFitColumns(worksheet, 10, 60, ['rank']);

    worksheet.getColumn('A').alignment = {
        horizontal: 'center'
    };

    worksheet.mergeCells('J14:O21');

    const notesCell = worksheet.getCell('J14');

    notesCell.value = "Activity Score = Completed Tickets x Total Downtime (Hours)\n\n" +
        "This score helps identify technicians handling higher workloads and larger downtime events. It should be used as an activity indicator, not as a direct performance rating.";
    
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