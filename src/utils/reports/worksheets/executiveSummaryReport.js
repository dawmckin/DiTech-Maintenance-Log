import calculateKPIs from "../../calculate-kpis";
import formatDuration from "../../format-duration";

export default function addExecutiveSummaryWorksheet(workbook, worklogs, dateRange = {}) {
    const startDate = `${dateRange.startDate.getMonth() + 1}/${dateRange.startDate.getDate()}/${dateRange.startDate.getFullYear()}`;
    const endDate = `${dateRange.endDate.getMonth() + 1}/${dateRange.endDate.getDate()}/${dateRange.endDate.getFullYear()}`;

    const worksheet = workbook.addWorksheet("Executive Summary");

    const totalTickets = worklogs.length;
    const openTickets = worklogs.filter(log => log.issue_status === 'open').length;
    const completedTickets = worklogs.filter(log => log.issue_status === 'completed').length;
    
    const totalDowntimeMS = calculateKPIs(worklogs, ['totalDowntime']).totalDowntime;
    const totalDowntimeFormatted = formatDuration(totalDowntimeMS);
    const avgDowntimeFormatted = formatDuration(totalDowntimeMS / totalTickets);

    const equipmentCounts = {};

    worklogs.forEach(log => {
        const equipmentId = log.equipment?.plex_equipment_id;
        const equipmentName = log.equipment?.equipment_name;

        if(!equipmentId) return;

        const downtime = (log.end_time ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        equipmentCounts[equipmentId] =  {
                                            name: equipmentName, 
                                            count: (equipmentCounts[equipmentId]?.count || 0) + 1, 
                                            downtime: (equipmentCounts[equipmentId]?.downtime || 0) + downtime
                                        };
    });

    const worstEquipmentByTicketsSorted = Object.entries(equipmentCounts).sort((a,b) => b[1].count - a[1].count);
    const worstEquipmentByTickets = worstEquipmentByTicketsSorted.filter(eq => eq[1].count === worstEquipmentByTicketsSorted[0][1].count);

    const worstEquipmentByDowntimeSorted = Object.entries(equipmentCounts).sort((a,b) => b[1].downtime - a[1].downtime);
    const worstEquipmentByDowntime = worstEquipmentByDowntimeSorted.filter(eq => eq[1].downtime === worstEquipmentByDowntimeSorted[0][1].downtime)
                                                                    .map(eq => [eq[0], {name: eq[1].name, count: eq[1].count, downtime: formatDuration(eq[1].downtime)}]);
    
    const workstationCounts = {};

    worklogs.forEach(log => {
        const workstationId = log.workstation_id;
        const location = log.workstations?.location_site;

        if(!workstationId) return;

        const downtime = (log.end_time ? Date.parse(log.end_time) : Date.now()) - Date.parse(log.start_time);

        workstationCounts[workstationId] =  {
                                            location: location, 
                                            count: (workstationCounts[workstationId]?.count || 0) + 1, 
                                            downtime: (workstationCounts[workstationId]?.downtime || 0) + downtime
                                        };
    });

    const worstWorkstationsByTicketsSorted = Object.entries(workstationCounts).sort((a,b) => b[1].count - a[1].count);
    const worstWorkstationsByTickets = worstWorkstationsByTicketsSorted.filter(ws => ws[1].count === worstWorkstationsByTicketsSorted[0][1].count);

    const worstWorkstationsByDowntimeSorted = Object.entries(workstationCounts).sort((a,b) => b[1].downtime - a[1].downtime);
    const worstWorkstationsByDowntime = worstWorkstationsByDowntimeSorted.filter(ws => ws[1].downtime === worstWorkstationsByDowntimeSorted[0][1].downtime)
                                                                    .map(ws => [ws[0], {location: ws[1].location, count: ws[1].count, downtime: formatDuration(ws[1].downtime)}]);


    // console.log(totalTickets);
    // console.log(openTickets);
    // console.log(completedTickets);

    // console.log(totalDowntimeFormatted);
    // console.log(avgDowntimeFormatted);

    // console.log(equipmentCounts);
    // console.log(worstEquipmentByTicketsSorted);
    // console.log(worstEquipmentByTickets);
    // console.log(worstEquipmentByDowntimeSorted);
    // console.log(worstEquipmentByDowntime);

    // console.log(workstationCounts);
    // console.log(worstWorkstationsByTicketsSorted)
    // console.log(worstWorkstationsByTickets)
    // console.log(worstWorkstationsByDowntimeSorted)
    // console.log(worstWorkstationsByDowntime)

    worksheet.mergeCells('A1:D1');

    worksheet.getCell('A1').value = 'Maintenance Portal Executive Summary';

    worksheet.getRow(1).height = 30;

    worksheet.getCell('A1').font = {
        bold: true,
        size: 18,
        color: {argb: 'FFFFFFFF'}
    };   
    worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: '1F2937'}
    };

    const initializeRows = () => {
        let rows = [];

        rows.push([]);
        rows.push(['Total Tickets', totalTickets]);
        rows.push(['Open Tickets', openTickets]);
        rows.push(['Completed Tickets', completedTickets]);
        rows.push([]);
        rows.push(['Total Downtime', totalDowntimeFormatted]);
        rows.push(['Average Downtime', avgDowntimeFormatted]);
        rows.push([]);
        worstEquipmentByTickets.forEach((eq, index) => {
            if(index === 0) rows.push(['Worst Equipment By Tickets', eq[0], eq[1].name, eq[1].count])
            else rows.push(['', eq[0], eq[1].name, eq[1].count])
        });
        rows.push([]);
        worstEquipmentByDowntime.forEach((eq, index) => {
            if(index === 0) rows.push(['Worst Equipment By Downtime', eq[0], eq[1].name, eq[1].downtime])
            else rows.push(['', eq])
        });
        rows.push([]);     
        worstWorkstationsByTickets.forEach((ws, index) => {
            if(index === 0) rows.push(['Worst Workstations By Tickets', ws[0], ws[1].location.toUpperCase(), ws[1].count])
            else rows.push(['', ws[0], ws[1].location.toUpperCase(), ws[1].count])
        });
        rows.push([]);
        worstWorkstationsByDowntime.forEach((ws, index) => {
            if(index === 0) rows.push(['Worst Workstations By Downtime', ws[0], ws[1].location.toUpperCase(), ws[1].downtime])
            else rows.push(['', ws])
        });
        rows.push([]);
        rows.push(['Reporting Period', startDate, (startDate === endDate) ? '' : endDate]);
        rows.push([]);
        rows.push(['Generated On', new Date().toLocaleString()]);

        return rows;
    }

    worksheet.addRows(
        initializeRows()
    );

    worksheet.eachRow((row, rowNumber) => {
        if(rowNumber < 3) return;
        row.getCell(1).font = {bold: true}
    });

    const rightAlignedColumns = [2,3,4];
    rightAlignedColumns.forEach(col => {
        worksheet.getColumn(col).alignment = {horizontal: 'right'}
    });

    worksheet.getCell('A1').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
    
    worksheet.getColumn(1).width = 32;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 18;
    worksheet.getColumn(4).width = 18;
}