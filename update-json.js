const express = require('express');
const ical = require('ical');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Google Calendar ICS URL
const icsUrl = 'https://calendar.google.com/calendar/ical/publiccalendar%40hsmse.org/public/basic.ics';

// Fetch and parse the ICS file
async function fetchAndParseICS(url) {
    try {
        const response = await axios.get(url);
        const calendarData = response.data;
        return ical.parseICS(calendarData);
    } catch (error) {
        console.error('Error fetching the ICS file:', error);
        return null;
    }
}

function findNextSchoolDays(events, numDays = 2) {
    const today = new Date('2024-10-25');
    let schoolDays = [];
    const sDayRegex = /\bs day\b/i; // Regex to match exactly 's day'

    for (let event of Object.values(events)) {
        if (event.type === 'VEVENT' && event.start >= today) {
            const summary = event.summary.toLowerCase();
            const startDate = new Date(event.start);
            
            console.log(`Event Date: ${startDate}, Summary: ${summary}`);  // Log the event date and summary

            if (sDayRegex.test(summary) || summary.includes('a day') || summary.includes('b day') || summary.includes('c-day')) { // Use regex to match 's day'
                schoolDays.push({ date: startDate, summary: event.summary });

                if (schoolDays.length === numDays) {
                    break;
                }
            }
        }
    }

    return schoolDays;
}

// Save the JSON to a file
async function updateJsonFile() {
    const events = await fetchAndParseICS(icsUrl);
    if (events) {
        const nextDays = findNextSchoolDays(events, 2);
        const filePath = path.join(__dirname, 'next-days.json');
        fs.writeFileSync(filePath, JSON.stringify(nextDays, null, 2));
        console.log('JSON file has been updated:', filePath);
    } else {
        console.error('Failed to update the JSON file.');
    }
}

// Set up a route for testing the update
app.get('/update-json', async (req, res) => {
    await updateJsonFile();
    res.send('JSON file updated!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Call the function to update the JSON file on script execution
updateJsonFile();