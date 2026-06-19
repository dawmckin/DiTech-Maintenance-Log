import { useState } from "react";
import { DateRange } from 'react-date-range';

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

        const now = new Date();
        const nowHour = now.getHours();

        let startDate = new Date();
        let endDate = new Date();

        startDate.setHours(21, 0, 0, 0);
        endDate.setHours(20, 59, 59, 999);

        //ditech day start (9pm prev day / start of 3rd shift)
        switch(range) {
            case 'today':
                (nowHour >= 21 && nowHour < 24) 
                    ? startDate.setDate(now.getDate()) 
                    : startDate.setDate(now.getDate() - 1);
                
                (nowHour >= 21 && nowHour < 24) 
                    ? endDate.setDate(now.getDate() + 1)
                    : endDate.setDate(now.getDate());

                break;
            case 'yesterday':
                (nowHour >= 21 && nowHour < 24)
                    ? startDate.setDate(now.getDate() - 1)
                    : startDate.setDate(now.getDate() - 2);

                (nowHour >= 21 && nowHour < 24)
                    ? endDate.setDate(now.getDate())
                    : endDate.setDate(now.getDate() - 1);

                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);

                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                                
                break;
            case 'quarterYear':
                startDate.setMonth(now.getMonth() - 3);

                break;            
            case 'halfYear':
                startDate.setMonth(now.getMonth() - 6);

                break;            
            case 'year':
                startDate.setMonth(now.getMonth() - 12);
                
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