const fs = require('fs');
const ical = require('ical');

// Read the .ics file
const icsFilePath = './ics/hsmse-calendar.ics';
const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');

// Parse the .ics file
const events = ical.parseICS(icsFileContent);

// Function to get the day of the week for a given date
function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to find the next five A or B days from today
function findNextFiveDays() {
    const relevantDays = [];
    const today = new Date('2024-09-24');
    today.setUTCHours(0, 0, 0, 0); // Reset time to midnight in UTC
    const todayStr = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // Iterate through all events
    for (const eventKey in events) {
        const event = events[eventKey];
        if (event.start) {
            const eventDate = new Date(event.start);
            eventDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight in UTC
            const eventDateStr = eventDate.toISOString().split('T')[0];
            
            // Check if the event is in the future and is an A Day or B Day
            if (eventDateStr >= todayStr && (event.summary.includes('A Day') || event.summary.includes('B Day'))) {
                relevantDays.push({
                    date: eventDateStr,
                    dayOfWeek: getDayOfWeek(eventDateStr),
                    type: event.summary.includes('A Day') ? 'A Day' : 'B Day'
                });
            }
        }
        
        // Stop once we've collected five future relevant days
        if (relevantDays.length >= 5) {
            break;
        }
    }
    
    return relevantDays;
}

// Find the next five A or B days
const nextFiveDays = findNextFiveDays();

// Output the results
console.log('Next 5 A or B Days:');
nextFiveDays.forEach(day => {
    console.log(`${day.date} (${day.dayOfWeek}): ${day.type}`);
});

