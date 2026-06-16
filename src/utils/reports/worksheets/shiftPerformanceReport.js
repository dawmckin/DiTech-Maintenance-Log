import formatDuration from "../../format-duration";
import formatShift from "../../format-shift";
import autoFitColumns from "../autoFitColumns";

export default function addShiftPerformanceWorksheet(workbook, worklogs) {
    const worksheet = workbook.addWorksheet('Shift Performance');

    const shiftSummary = {
        "1st": {
            ticketCount: 0,
            totalDowntime: 0
        },
        "2nd": {
            ticketCount: 0,
            totalDowntime: 0
        },
        "3rd": {
            ticketCount: 0,
            totalDowntime: 0
        }
    };

    worklogs.forEach(log => {
        const shift = formatShift(log.start_time);

        const downtime = ((log.end_time) ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        shiftSummary[shift].ticketCount++;

        shiftSummary[shift].totalDowntime += downtime;
    });

    const rows = Object.entries(shiftSummary).map(([shift, data]) => (
        {
            shift,
            ticketCount: data.ticketCount,
            totalDowntime: data.totalDowntime,
            avgDowntime: data.ticketCount ? data.totalDowntime / data.ticketCount : 0,
            impactScore: Math.round(data.ticketCount * (data.totalDowntime / (1000 * 60 * 60)))
        }
    ));

    worksheet.columns = [
        {header: 'Shift', key: 'shift'},
        {header: 'Tickets', key: 'ticketCount'},
        {header: 'Total Downtime', key: 'totalDowntime'},
        {header: 'Average Downtime', key: 'avgDowntime'},
        {header: 'Impact Score', key: 'impactScore'}
    ];

    rows.forEach(row => {
        worksheet.addRow({
            shift: row.shift,
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
        to: "E1"
    };

    autoFitColumns(worksheet);

        worksheet.getColumn('A').alignment = {
        horizontal: 'center'
    };

    worksheet.getColumn('B').alignment = {
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