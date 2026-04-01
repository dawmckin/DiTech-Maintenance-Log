export default function groupLogsByDate(logs, range = 'day') {
    if (!Array.isArray(logs)) return [];
    
    const now = new Date();
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
        const end = log.end_time === "" ? now : new Date(log.end_time);
        const diff = (end - start);
        map[key].Downtime += diff;

    });

    return {groups: Object.values(map).sort((a, b) => new Date(a.Date) - new Date(b.Date)), highestIssues};
}