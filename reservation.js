document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservation-form');
    const responseMessage = document.getElementById('response-message');
    const dateInput = document.getElementById('date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    // Set the minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Dynamically update the min value of end time based on start time
    startTimeInput.addEventListener('input', () => {
        const startTime = startTimeInput.value;
        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const minEndTime = new Date();
            minEndTime.setHours(hours);
            minEndTime.setMinutes(minutes + 60); // Add 60 minutes
            const formattedMinEndTime = minEndTime.toTimeString().split(':').slice(0, 2).join(':');

            endTimeInput.min = formattedMinEndTime;
        } else {
            endTimeInput.removeAttribute('min');
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validate phone number
        const phoneNumber = document.getElementById('phone-number').value;
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        // Validate start time and end time
        const selectedDate = new Date(dateInput.value);
        const now = new Date();
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (!startTime || !endTime) {
            alert('Start time and End time must be selected.');
            return;
        }

        // Check if the selected date is today
        if (selectedDate.toDateString() === now.toDateString()) {
            const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); // Current time in HH:MM format
            if (startTime < currentTime) {
                alert('Start time cannot be earlier than the current time today.');
                return;
            }
        }

        // Ensure end time is greater than start time
        if (endTime <= startTime) {
            alert('End time must be later than the Start time.');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://restuarant-project-backend.onrender.com/api/book-table/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Thank you for your reservation request. We will contact you shortly!');
                form.reset();
                endTimeInput.removeAttribute('min'); // Reset min for end-time after form reset
            } else {
                const error = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
                alert(`Error: ${error.message || 'Failed to submit the form.'}`);
                
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});
