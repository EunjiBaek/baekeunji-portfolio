const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const toTop = document.querySelector('.to-top');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 700);
});

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
