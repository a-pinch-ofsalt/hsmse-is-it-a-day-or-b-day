const express = require('express');
const path = require('path');
const fs = require('fs');
const ical = require('ical');

const app = express();
const port = 3000;

// Function to get the next five A or B days 
function findNextFiveDays() {
    const icsFilePath = path.join(__dirname, './ics/hsmse-calendar.ics');
    const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');
    const events = ical.parseICS(icsFileContent);

    const relevantDays = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    function getDayOfWeek(dateStr) {
        const date = new Date(dateStr);
        const options = { weekday: 'long', timeZone: 'UTC' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    for (const eventKey in events) {
        const event = events[eventKey];
        if (event.start) {
            const eventDate = new Date(event.start);
            eventDate.setUTCHours(0, 0, 0, 0);
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

// Serve the processed JSON data
app.get('/nextFiveDays.json', (req, res) => {

    const nextFiveDays = findNextFiveDays();
    res.json(nextFiveDays);
});

// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
