import { useState } from "react";
import { DateRange } from 'react-date-range';

import './date-range-picker.css';

export default function DateRangePicker() {
    const [range, setRange] = useState("today");
    const [customRange, setCustomRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    return (
        <>
            {/* <div className="col-md-8 d-flex"> */}
            <div className="">
                {/* <select className="col-md-4 ml-auto" value={range} onChange={(e) => setRange(e.target.value)}> */}
                <select className="" value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarterYear">Last 3 Months</option>
                    <option value="halfYear">Last 6 Months</option>
                    <option value="year">Last 12 Months</option>
                    <option value="custom">Custom Range</option>
                </select>
            </div>

            {
                range === 'custom' && (
                    <div className="mt-3">
                        <div className="date-range-wrapper">
                            <DateRange 
                                editableDateInputs={true}
                                moveRangeOnFirstSelection={false}
                                ranges={[customRange]}
                                onChange={(item => {
                                    setCustomRange(item.selection)
                                })}
                            />
                        </div>
                    </div>
                )
            }
        </>

    )
}