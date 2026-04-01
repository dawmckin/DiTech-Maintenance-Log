export default function groupLogsByField(logs, field, status) {
    if(!Array.isArray(logs)) return [];
    
    const now = new Date();
    const map = {};

    logs.forEach(log => {
        const key = log[field] || "Unknown";

        const start = new Date(log.start_time);
        const end = log.end_time === "" ? now : new Date(log.end_time);
        const diff = (end - start);

        if(!map[key]) {
            map[key] = {
                Name: key,
                Downtime: 0
            };
        }

        map[key].Downtime += diff;
    });

    return Object.values(map).sort((a, b) => b.Downtime - a.Downtime);
}