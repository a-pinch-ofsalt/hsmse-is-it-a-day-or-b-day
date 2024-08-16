// Colors based on your request
const todayColor = '#FF5733';
const tomorrowColor = '#33FF57';
const otherDayColor = '#424242';
const highlightColor = '#ede8ad'; // Yellow color for highlighting

fetch('https://a-pinch-ofsalt.github.io/hsmse-is-it-a-day-or-b-day/nextFiveDays.json')
    .then(response => response.json())
    .then(nextFiveDays => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        nextFiveDays.forEach(day => {
            let dayLabel;
            let headerElement;
            let dateObj = new Date(day.date);
            let options = { month: 'long', day: 'numeric', year: 'numeric' };
            let formattedDate = dateObj.toLocaleDateString('en-US', options);

            // Determine the correct article and highlight the type of day
            let dayType = day.type === 'A Day' ? `an <span style="background-color: ${highlightColor};"><b>A Day</b></span>` : `a <span style="background-color: ${highlightColor};"><b>B Day</b></span>`;

            // Create header element
            if (day.date === todayStr) {
                dayLabel = 'Today';
                headerElement = document.createElement('h1');
                headerElement.style.color = todayColor;
            } else if (day.date === tomorrowStr) {
                dayLabel = 'Tomorrow';
                headerElement = document.createElement('h1');
                headerElement.style.color = tomorrowColor;
            } else {
                dayLabel = day.dayOfWeek;
                headerElement = document.createElement('h3');
                headerElement.style.color = otherDayColor;
            }

            headerElement.innerHTML = `${dayLabel}, ${formattedDate} is ${dayType}!`;
            document.querySelector('.info').appendChild(headerElement);
        });
    })
    .catch(error => console.error('Error loading the data:', error));