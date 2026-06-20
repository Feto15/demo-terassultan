document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const registrationCard = document.getElementById('registration-card');
    const successCard = document.getElementById('success-card');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Custom Validation
        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid && errorMessage) {
                let fieldName = firstInvalid.getAttribute('name');
                const label = form.querySelector(`label[for="${firstInvalid.id}"]`);
                
                if (label && label.textContent) {
                    fieldName = label.textContent;
                } else if (firstInvalid.name === 'title') {
                    fieldName = 'Title (Mr./Mrs./Ms.)';
                } else if (firstInvalid.name === 'marketing') {
                    fieldName = 'Marketing Preferences';
                } else if (firstInvalid.name === 'category') {
                    fieldName = 'Guest Category';
                } else if (firstInvalid.name === 'discovery') {
                    fieldName = 'Event Discovery';
                }
                
                errorMessage.textContent = `Please complete the field: ${fieldName}`;
                errorMessage.classList.remove('hidden');
                
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
                
                // Trigger shake animation
                errorMessage.classList.remove('shake');
                void errorMessage.offsetWidth;
                errorMessage.classList.add('shake');
            }
            return;
        }

        if (errorMessage) errorMessage.classList.add('hidden');

        // Add loading state to button
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Memproses...</span>';
        submitBtn.style.opacity = '0.8';
        submitBtn.disabled = true;

        // Simulate API call / form submission delay
        setTimeout(() => {
            // Hide registration card
            registrationCard.style.opacity = '0';
            registrationCard.style.transform = 'translateY(-20px) scale(0.95)';
            
            setTimeout(() => {
                registrationCard.classList.add('hidden');
                registrationCard.style.position = 'absolute';
                
                // Scroll back to top so user sees the new dashboard
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Show success card
                successCard.classList.remove('hidden');
                successCard.style.position = 'relative';
                
                // Trigger reflow
                void successCard.offsetWidth;
                
                successCard.style.opacity = '1';
                successCard.style.transform = 'translateY(0) scale(1)';
                
            }, 500); // Wait for fade out animation
            
        }, 1500); // Mock network request
    });
});
