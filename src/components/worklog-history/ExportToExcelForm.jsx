import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import DateRangePicker from "../util/DateRangePicker";

import { generateWorkbook } from "../../utils/reports/generateWorkbook";
import { useSelectFilteredWorklogs } from "../../api/useSelectFilteredWorklogs";
import { subDays } from "date-fns";

export default function ExportToExcel({onSuccess}) {
    const [exportExcelForm, setExportExcelForm] = useState({
        report_type: '',
        dateRange: {
            range: 'month',
            startDate: subDays(new Date(), 30),
            endDate: new Date()
        },
        status: 'all',
        workstationIds: [],
        equipmentIds: [],
        createdBy: [],
        includeCharts: true,
        includeRawData: true
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

        const filters = {
            startDate: exportExcelForm.dateRange.startDate?.toISOString(),
            endDate: exportExcelForm.dateRange.endDate?.toISOString()
        };
        // console.log(filters);

        const worklogs = await useSelectFilteredWorklogs(filters);
        // console.log(worklogs);            
        // console.log(exportExcelForm.dateRange);

        await generateWorkbook(worklogs, exportExcelForm.dateRange);
    }

    return (
        <>
            <form onSubmit={handleExport}>
                {/* <label>Report Type <span className="required-input">*</span></label>
                <select 
                    name='report_type' 
                    value={exportExcelForm.report_type || ""}
                    onChange={handleChange}
                >
                    <option value="">--Select--</option>
                    <option value="worklog-detail">Worklog Detail Report</option>
                    <option value="downtime-summary">Downtime Summary</option>
                    <option value="problem-workstations">Problem Workstations</option>
                    <option value="problem-equipment">Problem Equipment</option>
                    <option value="issue-trends">Issue Type Trends</option>
                    <option value="shift-performance">Shift Performance</option>
                </select> */}

                {/* <fieldset>
                    <label>Shift(s)</label>
                    <div className="d-flex flex-wrap">
                        <div className="d-flex mr-3">
                            <input 
                                name='all' 
                                type='checkbox' 
                                checked={exportExcelForm.shift.all} 
                                onChange={handleChange}
                            />
                            <label className="ml-1 my-auto">All</label>
                        </div>

                        <div className="d-flex mr-3">
                            <input 
                                name='first' 
                                type='checkbox' 
                                checked={exportExcelForm.shift.first} 
                                onChange={handleChange}    
                            />
                            <label className="ml-1 my-auto">1st</label>
                        </div>
                        <div className="d-flex mr-3">
                            <input 
                                name='second' 
                                type='checkbox' 
                                checked={exportExcelForm.shift.second} 
                                onChange={handleChange}  
                            />
                            <label className="ml-1 my-auto">2nd</label>
                        </div>
                        <div className="d-flex mr-3">
                            <input 
                                name='third' 
                                type='checkbox' 
                                checked={exportExcelForm.shift.third} 
                                onChange={handleChange}  
                            />
                            <label className="ml-1 my-auto">3rd</label>
                        </div>
                    </div>
                </fieldset> */}

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
                    <button type='submit' className="primary">Generate Report</button>
                </div>
            </form>
        </>
    )
}