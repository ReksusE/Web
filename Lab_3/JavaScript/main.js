const API = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    const feedbackLink = document.getElementById('feedback-link');
    const adminLink = document.getElementById('admin-link');
    const authLink = document.getElementById('auth-link');
    const userRole = localStorage.getItem('userRole');
    const currentUserId = localStorage.getItem('currentUserId');

    if (userRole === 'admin') {
        adminLink.style.display = 'inline-flex';
        feedbackLink.style.display = 'none';
    }

    if (currentUserId) {
        authLink.textContent = 'Выход';
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'authorization.html';
        });
    }
});