import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import addExecutiveSummaryWorksheet  from "./worksheets/executiveSummaryReport";
import addWorklogDetailsWorksheet from "./worksheets/worklogDetailsReport";

export async function generateWorkbook(reportData) {
    const workbook = new ExcelJS.Workbook();

    addExecutiveSummaryWorksheet(workbook, reportData);
    addWorklogDetailsWorksheet(workbook, reportData);

    const buffer = await workbook.xlsx.writeBuffer();

    const today = new Date();

    saveAs(new Blob([buffer]), `Maintenance-Report-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.xlsx`);

    workbook.creator = 'Maintenance Portal';
    workbook.created = new Date();

    return workbook;
}