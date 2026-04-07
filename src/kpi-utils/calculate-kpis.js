export default function calculateKPIs(logs) {
    const now = new Date();
    const COLORS = {
        problem: "#dc3545",
        maintenance: "#0d6efd",
        setup: "#22c55e",
    };

    let totalDowntime = 0;
    let activeIssues = 0;
    let issuesToday = 0;
    let issueCountByType = {};

    logs.forEach((log) => {
        const start = new Date(log.start_time);
        const end = log.end_time ? new Date(log.end_time) : now;

        //total downtime
        if(start) {
            totalDowntime += (end - start);
        }

        //active issues
        if(log.issue_status === 'open') {
            activeIssues++;
        }

        //tickets today
        const isToday = start.getDate() === now.getDate() && 
                        start.getMonth() === now.getMonth() && 
                        start.getFullYear() === now.getFullYear();

        if(isToday) {
            issuesToday++;
        }

        //count issues by type
        const key = log.issue_type || "Unknown";

        if(!issueCountByType[key]) {
            issueCountByType[key] = {
                name: key,
                value: 0
            }
        }

        issueCountByType[key].value += 1;
    });

    return {
        totalDowntime,
        activeIssues,
        issuesToday,
        issueCountByType: Object.values(issueCountByType).map(type => ({
            ...type,
            fill: COLORS[type.name.toLowerCase()]
        }))
        
    }

}