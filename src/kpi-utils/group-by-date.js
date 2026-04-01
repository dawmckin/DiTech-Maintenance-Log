export default function groupLogsByDate(logs, range = 'day') {
    if (!Array.isArray(logs)) return [];
    
    const map = {};
    let highestIssues = 0; 

    logs.forEach((log) => {
        const date = new Date(log.start_time);

        let key;
        if(range === "day") {
            key = date.toLocaleDateString();
        } else if(range === "week") {
            const firstDay = new Date(date);
            firstDay.setDate(date.getDate() - date.getDay());
            key = firstDay.toLocaleDateString();
        } else if(range === "month") {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else if(range === "year") {
            key = `${date.getFullYear()}`;
        }

        if(!map[key]) {
            map[key] = {
                date: key,
                issues: 0,
                downtime: 0
            };
        }

        map[key].issues += 1;
        
        if(map[key].issues > highestIssues) {
            highestIssues = map[key].issues
        }

        if(log.end_time) {
            const start = new Date(log.start_time);
            const end = new Date(log.end_time);
            const diff = (end - start) / 1000;
            map[key].downtime += diff;
        }
    });

    return {groups: Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date)), highestIssues};
}