export default function groupLogsByField(logs, field, status) {
    if(!Array.isArray(logs)) return [];

    const map = {};

    logs.forEach(log => {
        const key = log[field] || "Unknown";

        const start = new Date(log.start_time);
        const end = new Date(log.end_time);
        const diff = (end - start) / 1000;

        if(!map[key]) {
            map[key] = {
                name: key,
                downtime: 0
            };
        }

        map[key].downtime += diff;
    });

    return Object.values(map).sort((a, b) => b.downtime - a.downtime);
}