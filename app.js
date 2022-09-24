const userDataForm = document.forms.userData;
const userHello = document.querySelector(`.userHello`);
const user = JSON.parse(localStorage.getItem(`User`));
const users = JSON.parse(localStorage.getItem(`Users`)) || [];
const faveNumber = document.querySelector(`.faveNumber`);
const userMessage = document.querySelector(`.userMessage`);
const signInButton = document.querySelector(`.signInButton`);
const signOutButton = document.querySelector(`.signOutButton`);
const signUpButton = document.querySelector(`.signUpButton`);
const delAccButton = document.querySelector(`.delAccButton`);
const emailInput = document.querySelector(`input[type="email"]`);
const darkModeToggleButton = document.querySelector(`.dModeToggle`);
const passwordInput = document.querySelector(`input[type="password"]`);
const numberInput = document.querySelector(`input[type="number"]`);

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

userDataForm.remove();

if (user) {
    console.log(user);
    emailInput.remove();
    signInButton.remove();
    signUpButton.remove();
    passwordInput.remove();
    document.body.classList.add(`activeUser`);
    numberInput.value = user.number || 0;
    userHello.innerHTML = user.email;
} else {
    faveNumber.remove();
    numberInput.remove();
    userMessage.remove();
    // userDataForm.remove();
    delAccButton.remove();
    signOutButton.remove();
}

console.log(`-----------------------`);
console.log(`Users`, users);
console.log(`-----------------------`);
users.forEach(usr => console.log(usr));
console.log(`-----------------------`);

signUpButton.addEventListener(`click`, event => {

    let newUser = {
        id: users.length + 1,
        email: emailInput.value,
        password: passwordInput.value,
        number: numberInput.value || 0,
    };

    if (users.map(usr => usr.email).includes(emailInput.value)) {
        console.log(`Existing User`);
        userMessage.innerHTML = `Existing User, Please Sign In`;
        document.querySelector(`section`).prepend(userMessage);
    } else {
        users.push(newUser);
        localStorage.setItem(`User`, JSON.stringify(newUser));
        localStorage.setItem(`Users`, JSON.stringify(users));
        window.location.reload();
    };
});

signOutButton.addEventListener(`click`, event => {
    users.splice(users.indexOf(users.filter(usr => usr.id == user.id)[0]), 1, {...user, number: numberInput.value});
    localStorage.setItem(`Users`, JSON.stringify(users));
    localStorage.removeItem(`User`);
    window.location.reload();
});

signInButton.addEventListener(`click`, event => {
    if (users.map(usr => usr.email).includes(emailInput.value)) {
        console.log(`Existing User`, users.filter(usr => usr.email == emailInput.value)[0]);
        if (passwordInput.value == users.filter(usr => usr.email == emailInput.value)[0].password) {
            console.log(`Successful Sign In`, users.filter(usr => usr.email == emailInput.value && usr.password == passwordInput.value)[0]);
            localStorage.setItem(`User`, JSON.stringify(users.filter(usr => usr.email == emailInput.value && usr.password == passwordInput.value)[0]));
            window.location.reload();
        } else {
            console.log(`Incorrect Password`);
            userMessage.innerHTML = `Incorrect Password`;
            document.querySelector(`section`).prepend(userMessage);
        }
    } else {
        console.log(`Non Existing User`);
        userMessage.innerHTML = `Non Existing User`;
        document.querySelector(`section`).prepend(userMessage);
    };
});

delAccButton.addEventListener(`click`, event => {
   localStorage.setItem(`Users`, JSON.stringify(users.filter(usr => usr.email != user.email)));
   localStorage.removeItem(`User`);
   window.location.reload();
});

userDataForm.addEventListener(`change`, event => {
    event.preventDefault();
    console.log(event);
    console.log(userDataForm);
    let userFormData = new FormData(userDataForm);
    console.log(`userFormData`, userFormData);
    console.log(event.target.id, event.target.value);
    let userWithData = {
        ...user,
        [event.target.id]: event.target.value,
    };
    console.log(userWithData);
});

darkModeToggleButton.addEventListener(`click`, event => {
    console.log(`Dark Mode Toggle Button Clicked`, event);
    document.body.classList.toggle(`darkMode`);
    if (document.body.classList.contains(`darkMode`)) {
        darkModeToggleButton.innerHTML = `Light Mode`;
    } else {
        darkModeToggleButton.innerHTML = `Dark Mode`;
    }
})