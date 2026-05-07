export default function groupLogsByDate(logs, range) {
    if (!Array.isArray(logs)) return [];
    
    const now = new Date();
    const map = {};
    let highestIssues = 0;

    logs.forEach((log) => {
        const date = new Date(log.start_time);

        let key;
        if(range === "quarterYear" || range === "halfYear" || range === "year") {
            key = `${date.toLocaleString('default', { month: 'short' })}-${date.getYear() - 100}`;
        } else {
            key = `${date.getMonth() + 1}/${date.getDate()}/${date.getYear() - 100}`;
        }

        if(!map[key]) {
            map[key] = {
                Date: key,
                Issues: 0,
                Downtime: 0
            };
        }

        map[key].Issues += 1;
        
        if(map[key].Issues > highestIssues) {
            highestIssues = map[key].Issues
        }


        const start = new Date(log.start_time);
        const end = log.end_time ? new Date(log.end_time) : now;
        const diff = (end - start);
        map[key].Downtime += diff;

    });

    return {groups: Object.values(map).sort((a, b) => new Date(a.Date) - new Date(b.Date)), highestIssues};
}