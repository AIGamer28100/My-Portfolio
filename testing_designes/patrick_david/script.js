const figure = document.querySelector('.figure');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    figure.style.transition = 'all 0.3s ease-out';
    figure.style.transform = `translate(${x / 20}px, ${y / 20}px)`;
});

document.addEventListener('scroll', () => {
    figure.style.transition = 'all 0.3s ease-out';
    figure.style.transform = `translate(${window.scrollY / 20}px, ${window.scrollY / 20}px)`;
});