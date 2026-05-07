export default function filterLogsByRanges(logs, range) {
    const now = new Date();
    const nowHour = now.getHours();
    let start;

    //ditech day start (9pm prev day / start of 3rd shift)
    switch(range) {
        case "today":
            start = new Date();
            if(nowHour >= 21 && nowHour < 24) {
                start.setDate(now.getDate())
            } else {
                start.setDate(now.getDate() - 1)
            }
            start.setHours(21, 0, 0, 0);
            break;
        case "yesterday":
            start = new Date();
            if(nowHour >= 21 && nowHour < 24) {
                start.setDate(now.getDate() - 1);
            } else {
                start.setDate(now.getDate() - 2);
            }
            start.setHours(21, 0, 0, 0);

            const endYesterday = new Date();
            if(nowHour >= 21 && nowHour < 24) {
                endYesterday.setDate(now.getDate());
            } else {
                endYesterday.setDate(now.getDate() - 1);
            }
            endYesterday.setHours(20, 59, 59, 999);

            return logs.filter(log => {
                const date = new Date(log.start_time);
                return date >= start && date <= endYesterday;
            });
        case "week":
            start = new Date();
            start.setDate(now.getDate() - 7);
            start.setHours(21, 0, 0, 0);
            break;
        case "month":
            start = new Date();
            start.setMonth(now.getMonth() - 1);
            start.setHours(21, 0, 0, 0);
            break;
        case "quarterYear":
            start = new Date();
            start.setMonth(now.getMonth() - 3);
            start.setHours(21, 0, 0, 0);
            break;
        case "halfYear":
            start = new Date();
            start.setMonth(now.getMonth() - 6);
            start.setHours(21, 0, 0, 0);
            break;
        case "year":
            start = new Date();
            start.setFullYear(now.getFullYear() - 1);
            start.setHours(21, 0, 0, 0);
            break;
        default:
            return logs;
    }
    
    return logs.filter(log => {
        const date = new Date(log.start_time);
        return date >= start && date <= now;
    });

}