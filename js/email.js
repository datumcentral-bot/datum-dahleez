/**
 * Datum Dahleez Store - Email Notifications
 * Professional email integration for orders, quotes, and support
 */

class EmailNotifier {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendContactForm(contactForm);
            });
        }

        // Quote request form
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendQuoteRequest(quoteForm);
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribeNewsletter(newsletterForm);
            });
        }
    }

    sendContactForm(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        // Store contact request
        const contacts = JSON.parse(localStorage.getItem('datum_dahleez_contacts') || '[]');
        contacts.push(data);
        localStorage.setItem('datum_dahleez_contacts', JSON.stringify(contacts));

        // In production, send email via Formspree or similar service
        console.log('Contact form submitted:', data);
        alert('Thank you for contacting us! We will get back to you within 24 hours.');
        form.reset();
    }

    sendQuoteRequest(form) {
        const formData = new FormData(form);
        const data = {
            company: formData.get('company'),
            contactName: formData.get('contactName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            projectType: formData.get('projectType'),
            budget: formData.get('budget'),
            description: formData.get('description'),
            date: new Date().toISOString()
        };

        // Store quote request
        const quotes = JSON.parse(localStorage.getItem('datum_dahleez_quotes') || '[]');
        quotes.push(data);
        localStorage.setItem('datum_dahleez_quotes', JSON.stringify(quotes));

        // In production, send email via Formspree or similar service
        console.log('Quote request submitted:', data);
        alert('Thank you for your quote request! Our team will contact you within 48 hours with a detailed proposal.');
        form.reset();
    }

    subscribeNewsletter(form) {
        const formData = new FormData(form);
        const email = formData.get('email');

        // Store subscription
        const subscribers = JSON.parse(localStorage.getItem('datum_dahleez_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('datum_dahleez_subscribers', JSON.stringify(subscribers));
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
        } else {
            alert('You are already subscribed!');
        }
    }

    sendOrderConfirmation(order) {
        // In production, send email notification
        console.log('Order confirmation:', order);
    }

    sendQuoteResponse(quote, response) {
        // In production, send email notification
        console.log('Quote response:', quote, response);
    }
}

// Initialize email notifier
const emailNotifier = new EmailNotifier();
