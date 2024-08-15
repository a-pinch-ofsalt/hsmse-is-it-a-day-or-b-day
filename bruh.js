const fs = require('fs');
const ical = require('ical');

// Read the .ics file
const icsFilePath = './ics/hsmse-calendar.ics';
const icsFileContent = fs.readFileSync(icsFilePath, 'utf-8');

// Parse the .ics file
const events = ical.parseICS(icsFileContent);

// Function to find the next five A or B days from today
function findNextFiveDays() {
    let relevantDays = [];
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // Iterate through all events
    for (const eventKey in events) {
        const event = events[eventKey];
        if (event.start) {
            const eventDate = event.start.toISOString().split('T')[0];
            
            // Check if the event is in the future and is an A Day or B Day
            if (eventDate >= today && (event.summary.includes('A Day') || event.summary.includes('B Day'))) {
                relevantDays.push({
                    date: eventDate,
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
    console.log(`${day.date}: ${day.type}`);
});