document.addEventListener('DOMContentLoaded', () => {
    const backHome = document.querySelector('.back-home');

    if (backHome) {
        backHome.addEventListener('mouseenter', () => {
            backHome.style.opacity = '0.85';
        });

        backHome.addEventListener('mouseleave', () => {
            backHome.style.opacity = '1';
        });
    }
});
