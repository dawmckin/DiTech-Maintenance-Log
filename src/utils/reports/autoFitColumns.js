export default function autoFitColumns(worksheet, minWidth = 10, maxWidth = 50, excludedColumns = []) {
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

        col.width = Math.min(maxColWidth + 3, maxWidth);
    });
}