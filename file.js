/**
 * Contact Form Handler (EmailJS integration)
 * Ikechukwu Tony Portfolio
 */
(function() {
    // Initialize EmailJS
    emailjs.init("TVOQWl_otlyxRQaJs");

    const form = document.getElementById('contact-form');
    if (!form) return;

    const success = document.getElementById('form-success');
    const message = document.getElementById('c-message');
    const count = document.getElementById('c-count');

    // Form Validation Rules
    const rules = {
        'c-name': function(v) {
            if (!v) return 'Please enter your name.';
            if (v.length < 2) return 'Name must be at least 2 characters.';
            return '';
        },
        'c-email': function(v) {
            if (!v) return 'Please enter your email address.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. you@example.com.';
            return '';
        },
        'c-phone': function(v) {
            if (v && !/^[+()\d\s-]{7,20}$/.test(v)) return 'Enter a valid phone number or leave it blank.';
            return '';
        },
        'c-subject': function(v) {
            return v ? '' : 'Please choose a reason for contact.';
        },
        'c-message': function(v) {
            if (!v) return 'Please write a message.';
            if (v.length < 10) return 'Message must be at least 10 characters.';
            return '';
        }
    };

    function check(id) {
        const el = document.getElementById(id);
        const err = document.getElementById(id + '-error');
        if (!el || !err) return true;

        const msg = rules[id](el.value.trim());
        err.textContent = msg;
        el.classList.toggle('invalid', !!msg);
        el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
    }

    // Attach real-time validation listeners
    Object.keys(rules).forEach(function(id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('blur', function() { check(id); });
        el.addEventListener('input', function() {
            if (el.classList.contains('invalid')) check(id);
            if (success) success.style.display = 'none';
        });
    });

    // Character counter for text area
    if (message && count) {
        message.addEventListener('input', function() {
            count.textContent = message.value.length + ' / 500';
        });
    }

    // Form Submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let firstBad = null;

        Object.keys(rules).forEach(function(id) {
            if (!check(id) && !firstBad) firstBad = id;
        });

        if (firstBad) {
            if (success) success.style.display = 'none';
            const badElement = document.getElementById(firstBad);
            if (badElement) badElement.focus();
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send form data via EmailJS
        emailjs.sendForm("service_ga3i60j", "template_ys8m6j2", form)
            .then(function() {
                if (success) {
                    success.style.display = 'block';
                    success.textContent = "Thanks! Your message has been received. I'll get back to you soon.";
                }
                form.reset();
                if (count) count.textContent = '0 / 500';
            }, function(error) {
                alert("Failed to send message: " + (error.text || JSON.stringify(error)));
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
})();