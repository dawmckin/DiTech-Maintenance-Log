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

export async function generateWorkbook(reportData, dateRange = {}) {
    const today = new Date();

    const todayFormatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const startDate = `${dateRange.startDate.getFullYear()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getDate()}`;
    const endDate = `${dateRange.endDate.getFullYear()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getDate()}`;

    const workbook = new ExcelJS.Workbook();

    addExecutiveSummaryWorksheet(workbook, reportData, dateRange);
    // addWorklogDetailsWorksheet(workbook, reportData);
    // addDowntimeSummaryWorksheet(workbook, reportData);
    // addProblemEquipmentWorksheet(workbook, reportData);
    // addProblemWorkstationsWorksheet(workbook, reportData);
    // addShiftPerformanceWorksheet(workbook, reportData);
    // addTechnicianActivityWorksheet(workbook, reportData);
    // addRawWorklogsWorksheet(workbook, reportData);

    const buffer = await workbook.xlsx.writeBuffer();

    // console.log(`Maintenance_Report(${todayFormatted})_Reporting(${(startDate === endDate) ? `${startDate}` : `${startDate}~${endDate}`}).xlsx`);
    saveAs(new Blob([buffer]), `Maintenance_Report(${todayFormatted})_Reporting(${(startDate === endDate) ? `${startDate}` : `${startDate}~${endDate}`}).xlsx`);

    workbook.creator = 'Maintenance Portal';
    workbook.created = new Date();

    return workbook;
}