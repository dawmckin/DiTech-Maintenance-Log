export default function addDashboardChartWorksheet(workbook, charts) {
    const worksheet = workbook.addWorksheet('Dashboard Charts');

    worksheet.mergeCells('A1:H1');

    const title = worksheet.getCell('A1');

    title.value = 'Dashboard Charts';

    title.font = {
        size: 18,
        bold: true,
        color: {argb: 'FFFFFFFF'}
    };

    title.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: '1F2937'}
    };

    title.alignment = {
        horizontal: 'center'
    };

    const downtimeByIssueTypeChart = workbook.addImage({base64: charts.downtimeByIssueTypeChartImage, extension: 'png'});

    worksheet.addImage(downtimeByIssueTypeChart, 
        {
            tl: {
                col: 0,
                row: 3
            },
            ext: {
                width: 515,
                height: 240
            }
        }
    );

    const downtimeByWorkstationWalnutChart = workbook.addImage({base64: charts.downtimeByWorkstationWalnutChartImage, extension: 'png'});

    worksheet.addImage(downtimeByWorkstationWalnutChart, 
        {
            tl: {
                col: 0,
                row: 29
            },
            ext: {
                width: 515,
                height: 240
            }
        }
    );    
    
    const downtimeByWorkstationMainChart = workbook.addImage({base64: charts.downtimeByWorkstationMainChartImage, extension: 'png'});

    worksheet.addImage(downtimeByWorkstationMainChart, 
        {
            tl: {
                col: 0,
                row: 16
            },
            ext: {
                width: 515,
                height: 240
            }
        }
    );
}