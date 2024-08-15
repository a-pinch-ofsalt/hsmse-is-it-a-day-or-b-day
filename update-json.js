const fs = require('fs');
const ical = require('ical');
const path = require('path');

// Function to get the day of the week for a given date
function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to find the next five A or B days from today
function findNextFiveDays() {
    const icsFilePath = path.join(__dirname, './ics/hsmse-calendar.ics');
    const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');
    const events = ical.parseICS(icsFileContent);

    const relevantDays = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Reset time to midnight in UTC
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    for (const eventKey in events) {
        const event = events[eventKey];
        if (event.start) {
            const eventDate = new Date(event.start);
            eventDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight in UTC
            const eventDateStr = eventDate.toISOString().split('T')[0];

            if (eventDateStr >= todayStr && (event.summary.includes('A Day') || event.summary.includes('B Day'))) {
                relevantDays.push({
                    date: eventDateStr,
                    dayOfWeek: getDayOfWeek(eventDateStr),
                    type: event.summary.includes('A Day') ? 'A Day' : 'B Day',
                });
            }
        }

        if (relevantDays.length >= 5) {
            break;
        }
    }

    return relevantDays;
}

// Find the next five A or B days
const nextFiveDays = findNextFiveDays();

// Save the processed data to a JSON file
const outputPath = path.join(__dirname, 'public/nextFiveDays.json');
fs.writeFileSync(outputPath, JSON.stringify(nextFiveDays, null, 2), 'utf-8');
console.log('Data has been processed and saved to nextFiveDays.json');
