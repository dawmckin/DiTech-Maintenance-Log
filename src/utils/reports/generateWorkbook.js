import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import addExecutiveSummaryWorksheet  from "./worksheets/executiveSummaryReport";
import addWorklogDetailsWorksheet from "./worksheets/worklogDetailsReport";
import addDowntimeSummaryWorksheet from "./worksheets/downtimeSummaryReport";
import addProblemEquipmentWorksheet from "./worksheets/problemEquipmentReport";
import addProblemWorkstationsWorksheet from "./worksheets/problemWorkstationsReports";
import addShiftPerformanceWorksheet from "./worksheets/shiftPerformanceReport";
import addTechnicianActivityWorksheet from "./worksheets/technicianAcivityReport";
import addRawWorklogsWorksheet from "./worksheets/rawWorklogsReport";
import addDashboardChartWorksheet from "./worksheets/dashboardChartsReport";

export async function generateWorkbook(reportData, dateRange = {}, charts = {}, includeRawWorklogs = false) {
    const today = new Date();

    const todayFormatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const startDate = `${dateRange.startDate.getFullYear()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getDate()}`;
    const endDate = `${dateRange.endDate.getFullYear()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getDate()}`;

    const workbook = new ExcelJS.Workbook();

    addExecutiveSummaryWorksheet(workbook, reportData, dateRange);
    addWorklogDetailsWorksheet(workbook, reportData);
    if(reportData.filter(log => log.is_tooling_issue === true).length > 0) addWorklogDetailsWorksheet(workbook, reportData, true);
    addDowntimeSummaryWorksheet(workbook, reportData);
    addProblemEquipmentWorksheet(workbook, reportData);
    addProblemWorkstationsWorksheet(workbook, reportData);
    addShiftPerformanceWorksheet(workbook, reportData);
    addTechnicianActivityWorksheet(workbook, reportData);
    if(includeRawWorklogs) addRawWorklogsWorksheet(workbook, reportData);
    // if(Object.keys(charts).length > 0) addDashboardChartWorksheet(workbook, charts);

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), `Maintenance_Report(${todayFormatted})_Reporting(${(startDate === endDate) ? `${startDate}` : `${startDate}~${endDate}`}).xlsx`);

    workbook.creator = 'Maintenance Portal';
    workbook.created = new Date();

    return workbook;
}