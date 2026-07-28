export default function autoFitColumns(worksheet, minWidth = 10, maxWidth = 60, excludedColumns = []) {
    worksheet.columns.forEach((col) => {

        if(excludedColumns.includes(col.key)) {
            return;
        }

        let maxColWidth = minWidth;

        col.eachCell({includeEmpty: true}, (cell) => {
            const cellText = 
                cell.value === null 
                    ? "" 
                    : typeof cell.value === 'object' 
                        ? (cell.value.result || cell.value.text || JSON.stringify(cell.value)).toString() 
                        : cell.value.toString();    
            
            maxColWidth = Math.max(maxColWidth, cellText.length);
            cell.alignment = {
                vertical: "top"
            }
        });

        col.width = (col.key === 'rank') ? Math.min(maxColWidth + 2, maxWidth) : Math.min(maxColWidth + 8, maxWidth);
    });
}