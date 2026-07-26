/**
 * Datum Dahleez Store - Email Notifications
 * Realistic frontend flows for orders, quotes, support, and newsletter
 */

class EmailNotifier {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendContactForm(contactForm);
            });
        }

        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendQuoteRequest(quoteForm);
            });
        }

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

        const contacts = JSON.parse(localStorage.getItem('datum_dahleez_contacts') || '[]');
        contacts.push(data);
        localStorage.setItem('datum_dahleez_contacts', JSON.stringify(contacts));

        const subject = encodeURIComponent(data.subject || 'Contact Request');
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`);
        window.location.href = `mailto:info@datum-dahleez.store?subject=${subject}&body=${body}`;

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

        const quotes = JSON.parse(localStorage.getItem('datum_dahleez_quotes') || '[]');
        quotes.push(data);
        localStorage.setItem('datum_dahleez_quotes', JSON.stringify(quotes));

        const subject = encodeURIComponent('Quote Request - ' + (data.projectType || 'General'));
        const body = encodeURIComponent(`Company: ${data.company}\nContact: ${data.contactName}\nEmail: ${data.email}\nPhone: ${data.phone}\nBudget: ${data.budget}\nDescription: ${data.description}`);
        window.location.href = `mailto:quotes@datum-dahleez.store?subject=${subject}&body=${body}`;

        alert('Thank you for your quote request! Our team will contact you within 48 hours with a detailed proposal.');
        form.reset();
    }

    subscribeNewsletter(form) {
        const formData = new FormData(form);
        const email = formData.get('email');

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
        const subject = encodeURIComponent('Order Confirmation - ' + (order.id || 'DD'));
        const body = encodeURIComponent(`Dear Customer,\n\nYour order has been confirmed.\nOrder ID: ${order.id}\nTotal: Rs. ${order.total ? order.total.toLocaleString() : '0'}\n\nThank you for shopping with Datum Dahleez.`);
        window.location.href = `mailto:${order.customer?.email || 'customer'}?subject=${subject}&body=${body}`;
    }

    sendQuoteResponse(quote, response) {
        const subject = encodeURIComponent('Quote Response - ' + (quote.projectType || 'General'));
        const body = encodeURIComponent(`Dear ${quote.contactName},\n\nThank you for your quote request. Please find our response attached.\n\nBest regards,\nDatum Dahleez Team`);
        window.location.href = `mailto:${quote.email}?subject=${subject}&body=${body}`;
    }
}

window.emailNotifier = new EmailNotifier();
