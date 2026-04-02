import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyArHoAvn928iNrxywOAcuOuoG-QJnrKJE0",
    authDomain: "portfolio-6de44.firebaseapp.com",
    projectId: "portfolio-6de44",
    storageBucket: "portfolio-6de44.firebasestorage.app",
    messagingSenderId: "125914680069",
    appId: "1:125914680069:web:5b683b54c0d0b764d1456c",
    measurementId: "G-03JZF47V7R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 1. Track all clickables
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a, button, .sys-card').forEach(elem => {
        elem.addEventListener('click', () => {
            const linkText = elem.innerText || elem.href || 'unknown_element';
            const cleanText = linkText.substring(0, 50).replace(/\n/g, ' ').trim();
            logEvent(analytics, 'element_click', {
                element_type: elem.tagName.toLowerCase(),
                element_text: cleanText,
                link_url: elem.href || 'none'
            });
        });
    });
});

// 2. Track Scroll Depth
let maxScrollPercent = 0;
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
        const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
        
        if (scrollPercent >= 25 && maxScrollPercent < 25) {
            maxScrollPercent = 25;
            logEvent(analytics, 'scroll_depth_reached', { depth_percentage: 25 });
        } else if (scrollPercent >= 50 && maxScrollPercent < 50) {
            maxScrollPercent = 50;
            logEvent(analytics, 'scroll_depth_reached', { depth_percentage: 50 });
        } else if (scrollPercent >= 75 && maxScrollPercent < 75) {
            maxScrollPercent = 75;
            logEvent(analytics, 'scroll_depth_reached', { depth_percentage: 75 });
        } else if (scrollPercent >= 98 && maxScrollPercent < 100) {
            maxScrollPercent = 100;
            logEvent(analytics, 'scroll_depth_reached', { depth_percentage: 100 });
        }
    }
}, { passive: true });

// 3. Track Time Spent
const startTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    // Note: Firebase tracks 'user_engagement' internally, but this is an explicit custom log
    logEvent(analytics, 'time_spent_on_site', {
        duration_seconds: timeSpentSeconds
    });
});
