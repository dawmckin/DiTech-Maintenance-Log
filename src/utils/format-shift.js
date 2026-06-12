export default function formatShift(startTime) {
    const startHour = new Date(startTime).getHours();

    const firstShift = [6, 14];
    const secondShift = [14, 21];
    const thirdShift = [21, 6];

    if(startHour >= firstShift[0] && startHour < firstShift[1]) {
        return '1st';
    } else if(startHour >= secondShift[0] && startHour < secondShift[1]) {
        return '2nd';
    } else if(startHour >= thirdShift[0] && startHour <= 23 || startHour < thirdShift[1]) {
        return '3rd';
    } else {
        return 'error';
    }
}