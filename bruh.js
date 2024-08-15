const fs = require('fs');
const ical = require('ical');

// Read the .ics file
const icsFilePath = './ics/hsmse-calendar.ics';
const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');

// Parse the .ics file
const events = ical.parseICS(icsFileContent);

// Get the date to check (from command line argument or use today's date)
const inputDate = process.argv[2] || new Date().toISOString().split('T')[0];

let isBday = false;

// Iterate over the events to find the event for the input date
for (const eventKey in events) {
    const event = events[eventKey];

    if (event.start && event.start.toISOString().split('T')[0] === inputDate) {
        // Check if the event summary indicates an A or B day
        if (event.summary.includes('B Day')) {
            isBday = true;
            break;
        } else if (event.summary.includes('A Day')) {
            isBday = false;
            break;
        }
    }
}

// Output whether it's a B day or not
console.log(`Is it a B Day on ${inputDate}? ${isBday ? 'Yes' : 'No'}`);