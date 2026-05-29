import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

import DateRangePicker from "../util/DateRangePicker";

export default function ExportToExcel({onSuccess}) {
    const [exportExcelForm, setExportExcelForm] = useState({
        report_type: '',
        shift: {
            all: false,
            first: false,
            second: false,
            third: false
        },
        range: 'today',
        custom_start: null,
        custom_end: null
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        // console.log(name, value, type, checked);

        //handle checkboxes
        if(type === 'checkbox') {

            //all checkbox
            if(name === 'all') {
                setExportExcelForm(prev => ({
                    ...prev,
                    shift: {
                        ...prev.shift,
                        all: checked,
                        first: checked,
                        second: checked,
                        third: checked
                    }
                }));

                return;
            }

            //individual checkboxes
            const updatedShift = {
                ...exportExcelForm.shift,
                [name]: checked
            }

            //auto toggle all
            updatedShift.all = 
                updatedShift.first && 
                updatedShift.second && 
                updatedShift.third

            setExportExcelForm(prev => ({
                ...prev,
                shift: updatedShift
            }));
            
            return;
        }

        //handle normal inputs
        setExportExcelForm({
            ...exportExcelForm,
            [name]: value
        });
    }

    const handleExport = () => {
        e.preventDefault();

        console.log(exportExcelForm);
    }

    return (
        <>
            <form onSubmit={handleExport}>
                <label>Report Type <span className="required-input">*</span></label>
                <select 
                    name='report_type' 
                    value={exportExcelForm.report_type || ""}
                    onChange={handleChange}
                >
                    <option value="">--Select--</option>
                    <option value="worklogs_by_shift">Worklogs by Shift</option>
                    <option value="problem_workstations">Problem Workstations</option>
                    <option value="problem_equipment">Problem Equipment</option>
                </select>

                <fieldset>
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
                </fieldset>

                <label>Date Range</label>
                <DateRangePicker />

                <div className="actions">
                    <button type='submit' className="primary">Generate Report</button>
                </div>
            </form>
        </>
    )
}