// login-signup.js

// Login/Signup functionality
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const closeButtons = document.querySelectorAll('.close');

loginBtn.addEventListener('click', openLoginModal);
signupBtn.addEventListener('click', openSignupModal);
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

function openLoginModal() {
    loginModal.style.display = 'block';
}

function openSignupModal() {
    signupModal.style.display = 'block';
}

function closeModal() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
}

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Perform login logic with email and password
    // Replace with your actual login implementation
    console.log('Login:', email, password);
    
    // Reset form and close modal
    loginForm.reset();
    closeModal();
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('signup-user-type').value;
    
    // Perform signup logic with name, email, password, and userType
    // Replace with your actual signup implementation
    console.log('Signup:', name, email, password, userType);
    
    // Reset form and close modal
    signupForm.reset();
    closeModal();
}