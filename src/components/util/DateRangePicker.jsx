import { useState } from "react";
import { DateRange } from 'react-date-range';
import { startOfDay, endOfDay, subDays, subMonths, sub } from "date-fns";

import './date-range-picker.css';

export default function DateRangePicker({value, onChange}) {
    const handleRangeChange = (selectedRange) => {
        onChange({
            ...value,
            startDate: selectedRange.startDate,
            endDate: selectedRange.endDate
        });
    };

    const handlePresetChange = (e) => {
        const range = e.target.value;

        let startDate = new Date();
        let endDate = new Date();

        switch(range) {
            case 'today':
                startDate = startOfDay(new Date());
                endDate = endOfDay(new Date());
                break;
            case 'yesterday':
                startDate = startOfDay(subDays(new Date(), 1));
                endDate = endOfDay(subDays(new Date(), 1));
                break;
            case 'week':
                startDate = subDays(new Date(), 7);
                break;
            case 'month':
                startDate = subDays(new Date(), 30);
                break;
            case 'quarterYear':
                startDate = subMonths(new Date(), 3);
                break;            
            case 'halfYear':
                startDate = subMonths(new Date(), 6);
                break;            
            case 'year':
                startDate = subMonths(new Date(), 12);
                break;
            default:
                break;
        }

        onChange({
            range,
            startDate,
            endDate
        })
    };

    return (
        <>
            {/* <div className="col-md-8 d-flex"> */}
            <div className="">
                {/* <select className="col-md-4 ml-auto" value={range} onChange={(e) => setRange(e.target.value)}> */}
                <select className="" value={value.range} onChange={handlePresetChange}>
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
                value.range === 'custom' && (
                    <div className="mt-3">
                        <div className="date-range-wrapper">
                            <DateRange 
                                editableDateInputs={true}
                                moveRangeOnFirstSelection={false}
                                ranges={[
                                    {
                                        startDate: value.startDate,
                                        endDate: value.endDate,
                                        key: 'selection'
                                    }
                                ]}
                                onChange={(item) => 
                                    handleRangeChange(item.selection)
                                }
                            />
                        </div>
                    </div>
                )
            }
        </>

    )
}