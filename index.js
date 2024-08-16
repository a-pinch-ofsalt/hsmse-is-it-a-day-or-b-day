// Colors based on your request
const todayColor = '#FF5733';
const tomorrowColor = '#33FF57';
const otherDayColor = '#424242';
const highlightColor = '#ede8ad'; // Yellow color for highlighting

fetch('https://a-pinch-ofsalt.github.io/hsmse-is-it-a-day-or-b-day/nextFiveDays.json')
    .then(response => response.json())
    .then(nextFiveDays => {
        nextFiveDays.forEach(day => {
            // Create a Date object from the string (assuming ISO format in JSON)
            const dateObj = new Date(day.date);

            // Format the date for display, ensuring no time zone shifts occur
            const options = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

            // Insert this formatted date into the DOM
            let dayLabel;
            let headerElement;

            // Determine the label (today, tomorrow, etc.)
            if (dateObj.toDateString() === new Date().toDateString()) {
                dayLabel = 'Today';
                headerElement = document.createElement('h2');
                headerElement.style.color = '#FF5733';  // Example color for "Today"
            } else if (dateObj.toDateString() === new Date(Date.now() + 86400000).toDateString()) {
                dayLabel = 'Tomorrow';
                headerElement = document.createElement('h1');
                headerElement.style.color = '#33FF57';  // Example color for "Tomorrow"
            } else {
                dayLabel = day.dayOfWeek;
                headerElement = document.createElement('h3');
                headerElement.style.color = '#424242';  // Example color for other days
            }

            headerElement.innerHTML = `${dayLabel}, ${formattedDate} is <span style="background-color: yellow;"><b>${day.type}</b></span>!`;
            console.log(`dayLabel = ${dayLabel}, formattedDate = ${formattedDate}`);
            document.querySelector('.info').appendChild(headerElement);
        });
    })
    .catch(error => console.error('Error loading the data:', error));