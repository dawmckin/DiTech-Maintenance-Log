export default function calculateKPIs(logs, kpis = []) {
    const now = new Date();
    const nowHour = now.getHours();
    
    const COLORS = {
        problem: "#dc3545",
        maintenance: "#0d6efd",
        setup: "#22c55e",
    };

    let totalDowntime = 0;
    let totalIssues = 0;
    let activeIssues = 0;
    let issuesToday = 0;
    let issueCountByType = {};

    logs.forEach((log) => {
        const start = new Date(log.start_time);
        const end = log.end_time ? new Date(log.end_time) : now;

        //total downtime
        if(kpis.includes('totalDowntime')) {
            if(start) {
                totalDowntime += (end - start);
            }
        }

        //total issues
        if(kpis.includes('totalIssues')) {
            totalIssues++;
        }
        
        //active issues
        if(kpis.includes('activeIssues')) {
            if(log.issue_status === 'open') {
                activeIssues++;
            }
        }

        //tickets today
        if(kpis.includes('issuesToday')) {
            const startToday = new Date();
            const endToday = new Date();

            if(nowHour >= 21 && nowHour < 24) {
                startToday.setDate(now.getDate());
            } else {
                startToday.setDate(now.getDate() - 1);
            }
            startToday.setHours(21, 0, 0, 0);

            if(start >= startToday && start <= now) {
                issuesToday++;
            }
        }

        //count issues by type
        if(kpis.includes('issueCountByType')) {
            const key = log.issue_type || "Unknown";

            if(!issueCountByType[key]) {
                issueCountByType[key] = {
                    name: key,
                    value: 0
                }
            }

            issueCountByType[key].value += 1;
        }
    });

    return {
        totalDowntime,
        totalIssues,
        activeIssues,
        issuesToday,
        issueCountByType: Object.values(issueCountByType).map(type => ({
            ...type,
            fill: COLORS[type.name.toLowerCase()]
        }))
        
    }

}