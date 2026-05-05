export default function filterLogsByRanges(logs, range) {
    const now = new Date();
    let start;

    switch(range) {
        case "today":
            start = new Date();
            start.setHours(0, 0, 0, 0);
            break;
        case "yesterday":
            start = new Date();
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            console.log(start);

            const endYesterday = new Date();
            endYesterday.setDate(endYesterday.getDate() - 1);
            endYesterday.setHours(23, 59, 59, 999);
            console.log(endYesterday);

            return logs.filter(log => {
                const date = new Date(log.start_time);
                return date >= start && date <= endYesterday;
            });
        case "week":
            start = new Date();
            start.setDate(now.getDate() - 7);
            break;
        case "month":
            start = new Date();
            start.setMonth(now.getMonth() - 1);
            break;
        case "quarter-year":
            start = new Date();
            start.setMonth(now.getMonth() - 3);
            break;
        case "half-year":
            start = new Date();
            start.setMonth(now.getMonth() - 6);
            break;
        case "year":
            start = new Date();
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            return logs;
    }
    
    return logs.filter(log => {
        const date = new Date(log.start_time);
        return date >= start && date <= now;
    });

}