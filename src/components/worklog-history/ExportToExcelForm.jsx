import { useEffect, useRef, useState } from "react";
import { useToast } from '../../context/ToastContext';

import * as htmlToImage from "html-to-image";

import DateRangePicker from "../util/DateRangePicker";

import { generateWorkbook } from "../../utils/reports/generateWorkbook";
import { useSelectFilteredWorklogs } from "../../api/useSelectFilteredWorklogs";
import { subDays } from "date-fns";

import DowntimeByIssueTypeChart from "../dashboard/DowntimeByIssueTypeChart";
import DowntimeByWorkstationChart from "../dashboard/DowntimeByWorkstationChart";

export default function ExportToExcel({onSuccess}) {
    const { showToast } = useToast();

    const [worklogs, setWorklogs] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    const downtimeByIssueTypeChartRef = useRef(null);
    const downtimeByWorkstationWalnutChartRef = useRef(null);
    const downtimeByWorkstationMainChartRef = useRef(null);

    const [exportExcelForm, setExportExcelForm] = useState({
        report_type: '',
        mainLocation: true,
        walnutLocation: true,
        dateRange: {
            range: 'month',
            startDate: subDays(new Date(), 30),
            endDate: new Date()
        },
        status: 'all',
        workstationIds: [],
        equipmentIds: [],
        createdBy: [],
        includeCharts: false,
        includeRawData: false
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        // console.log(name, value, type, checked);

        setExportExcelForm(prev => ({
            ...prev,
            [name]: 
                type === 'checkbox' 
                    ? checked 
                    : value
        }));
    }

    const handleExport = async (e) => {
        e.preventDefault();

        if(!exportExcelForm.mainLocation && !exportExcelForm.walnutLocation) {
            showToast('Please select a location.', "error");
            return;
        }

        const filters = {
            startDate: exportExcelForm.dateRange.startDate?.toISOString(),
            endDate: exportExcelForm.dateRange.endDate?.toISOString(),
            main: exportExcelForm.mainLocation,
            walnut: exportExcelForm.walnutLocation
        };
        // console.log(filters);

        const filteredWorklogs = await useSelectFilteredWorklogs(filters);

        if(filteredWorklogs.length === 0) {
            showToast('No records available.', 'error')
        }
       
        setWorklogs(filteredWorklogs);

        setIsExporting(true);
    }

    useEffect(() => {
        // if(!isExporting ||
        //     !worklogs.length ||
        //     !downtimeByIssueTypeChartRef.current ||
        //     !downtimeByWorkstationWalnutChartRef.current ||
        //     !downtimeByWorkstationMainChartRef.current
        // ) {
        //     return;
        // }        
        if(!isExporting || !worklogs.length) {
            setIsExporting(false);
            return;
        }

        const exportWorkbook = async () => {
            try {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(resolve)
                    })
                })

                // const charts = {};
                // if(exportExcelForm.includeCharts) {
                //     charts['downtimeByIssueTypeChartImage'] = await htmlToImage.toPng(downtimeByIssueTypeChartRef.current);
                //     charts['downtimeByWorkstationWalnutChartImage'] = await htmlToImage.toPng(downtimeByWorkstationWalnutChartRef.current);
                //     charts['downtimeByWorkstationMainChartImage'] = await htmlToImage.toPng(downtimeByWorkstationMainChartRef.current);
                // }

                await generateWorkbook(worklogs, exportExcelForm.dateRange, (exportExcelForm.includeCharts) ? charts: {}, exportExcelForm.includeRawData);
            } catch(error) {
                console.error(error);
            } finally {
                setIsExporting(false);
            }
        }

        exportWorkbook();
    }, [isExporting, worklogs, exportExcelForm]);

    return (
        <>
            <form onSubmit={handleExport}>
                {/* <label className="mb-0">Location</label> */}
                <div className="d-flex">
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={exportExcelForm.mainLocation}
                            name="mainLocation"
                            onChange={handleChange}
                            className="mr-1"
                        /> 
                        Main St
                    </label>
                
                    
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={exportExcelForm.walnutLocation}
                            name="walnutLocation"
                            onChange={handleChange}
                            className="mr-1"
                        />
                        Walnut St
                    </label>
                </div>

                <label>Date Range</label>
                <DateRangePicker 
                    value={exportExcelForm.dateRange}
                    onChange={(dateRange) => 
                        setExportExcelForm(prev => ({
                            ...prev,
                            dateRange
                        }))
                    }
                />

                <div className="d-flex">
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={exportExcelForm.includeRawData}
                            name="includeRawData"
                            onChange={handleChange}
                            className="mr-1"
                        /> 
                        Include Raw Worklogs
                    </label>
                
                    
                    <label className="mr-3">
                        <input 
                            type="checkbox"
                            checked={exportExcelForm.includeCharts}
                            name="includeCharts"
                            onChange={handleChange}
                            className="mr-1"
                        />
                        Include Charts
                    </label>
                </div>

                <div className="actions">
                    <button type='submit' className="primary" disabled={isExporting}>{isExporting ? 'Generating...' : 'Generate Report'}</button>
                </div>
            </form>
            {/* <div style={{display: 'none'}}> */}
            {/* <div style={{position: 'absolute', left: '-999px', top: 0}}> */}
            {/* <div >?z */}
                {/* <DowntimeByIssueTypeChart ref={downtimeByIssueTypeChartRef} logs={worklogs}/>
                <DowntimeByWorkstationChart ref={downtimeByWorkstationWalnutChartRef} logs={worklogs} locationSite='walnut' />
                <DowntimeByWorkstationChart ref={downtimeByWorkstationMainChartRef} logs={worklogs} locationSite='main' /> */}
            {/* </div> */}
        </>
    )
}