const wrapper = document.querySelector('.wrapper'); 
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    wrapper.classList.remove('active');
});
