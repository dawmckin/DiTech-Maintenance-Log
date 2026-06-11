import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { addWorklogDetailsWorksheet } from "./worksheets/worklogDetailsReport";

export async function generateWorkbook(reportData) {
    const workbook = new ExcelJS.Workbook();

    addWorklogDetailsWorksheet(workbook, reportData);

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), `maintenance-report-${Date.now()}.xlsx`);

    workbook.creator = 'Maintenance Portal';
    workbook.created = new Date();

    return workbook;
}