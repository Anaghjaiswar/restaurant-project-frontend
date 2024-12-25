document.addEventListener('DOMContentLoaded', function() {
    console.log("Contact form script loaded");
    const contactForm = document.querySelector('.contact-form');
    const BASE_URL = "https://restuarant-project-backend.onrender.com/";
    const responseMessage = document.getElementById('form-response-message');

    // handel form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            number: document.getElementById('number').value,
            message: document.getElementById('message').value,
        }

        fetch(`${BASE_URL}api/contact/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    // Display success message
                    responseMessage.textContent = "Thank you for contacting us. We will get back to you shortly.";
                    responseMessage.style.display = 'block';
    
                    // Clear the form
                    contactForm.reset();
                } else {
                    responseMessage.textContent = "There was an error submitting the form. Please try again.";
                    responseMessage.style.display = 'block';
                    responseMessage.style.color = 'red';
                }
            })
            .catch(error => {
                responseMessage.textContent = "There was an error submitting the form. Please try again.";
                responseMessage.style.display = 'block';
                responseMessage.style.color = 'red';
                console.error('Error:', error);
            });

    });
})