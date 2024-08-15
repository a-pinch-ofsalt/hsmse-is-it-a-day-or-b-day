const fs = require('fs');
const ical = require('ical');

// Read the .ics file
const icsFilePath = './ics/hsmse-calendar.ics';
const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');

// Parse the .ics file
const events = ical.parseICS(icsFileContent);

// Function to add days to a date and skip weekends
function addWeekdays(startDate, days) {
    let date = new Date(startDate);
    while (days > 0) {
        date.setDate(date.getDate() + 1);
        // Skip Saturday and Sunday
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            days--;
        }
    }
    return date.toISOString().split('T')[0];
}

// Function to check if a specific date is a B day
function isBdayOnDate(checkDate) {
    for (const eventKey in events) {
        const event = events[eventKey];
        if (event.start && event.start.toISOString().split('T')[0] === checkDate) {
            if (event.summary.includes('B Day')) {
                return true;
            } else if (event.summary.includes('A Day')) {
                return false;
            }
        }
    }
    return null; // No relevant event found for this date
}

// Get today's date
const today = new Date('2024-09-06');

// Check the next five school days
for (let i = 1; i <= 5; i++) {
    const nextDate = addWeekdays(today, i);
    const isBday = isBdayOnDate(nextDate);
    console.log(`Is it a B Day on ${nextDate}? ${isBday !== null ? (isBday ? 'Yes' : 'No') : 'No relevant event found'}`);
}