import { globalFunctions } from "./globalFunctions.js";

const userHello = document.querySelector(`.userHello`);
const user = JSON.parse(localStorage.getItem(`User`));
const users = globalFunctions.removeDuplicateObjectFromArray(JSON.parse(localStorage.getItem(`Users`))) || [];
const faveNumber = document.querySelector(`.faveNumber`);
const userMessage = document.querySelector(`.userMessage`);
const userDataForm = document.querySelector(`#userData`);
const signInButton = document.querySelector(`.signInButton`);
const signOutButton = document.querySelector(`.signOutButton`);
const slidingBanner = document.querySelector(`.slidingBanner`);
const signUpButton = document.querySelector(`.signUpButton`);
const delAccButton = document.querySelector(`.delAccButton`);
const faveColor = document.querySelector(`.faveColor`);
const faveColorText = document.querySelector(`.faveColorText`);
const emailInput = document.querySelector(`input[type="email"]`);
const darkModeToggleButton = document.querySelector(`.dModeToggle`);
const passwordInput = document.querySelector(`input[type="password"]`);
const darkMode = JSON.parse(localStorage.getItem(`Dark Mode`)) || false;
const userInputs = document.querySelectorAll(`.userInput`);

// If There Is a Currently Logged In User
if (user) {
    console.log(`Current User`, user);
    emailInput.remove();
    signInButton.remove();
    signUpButton.remove();
    passwordInput.remove();
    userHello.innerHTML = user.email;
    document.body.classList.add(`activeUser`);
    userInputs.forEach(input => input.value = user[input.id] || ``);
    if (user.username) userHello.innerHTML = user.username;
} else {
    faveNumber.remove();
    userMessage.remove();
    delAccButton.remove();
    signOutButton.remove();
    userDataForm.remove();
    userInputs.forEach(input => input.remove());
    console.log(`Users`, users);
}

// If There Are No Users
if (!users.length) {
    signInButton.remove();
} else {
    users.forEach(usr => {
        slidingBanner.innerHTML = `${slidingBanner.innerHTML} ----- ${usr.username ? usr.username : usr.email}, the ${usr.bio}, is ${usr.status}.`;
        slidingBanner.title = `${slidingBanner.title} ----- ${usr.username ? usr.username : usr.email}'s Favorite Number: ${usr.number}`;
    });
};

// Dark Mode
if (darkMode == true) {
    document.body.classList.add(`darkMode`);
    localStorage.setItem(`Dark Mode`, true);
    darkModeToggleButton.innerHTML = `Light Mode`;
} else if (darkMode == false) {
    document.body.classList.remove(`darkMode`);
    localStorage.setItem(`Dark Mode`, false);
    darkModeToggleButton.innerHTML = `Dark Mode`;
}

darkModeToggleButton.addEventListener(`click`, event => {
    document.body.classList.toggle(`darkMode`);
    if (document.body.classList.contains(`darkMode`)) {
        localStorage.setItem(`Dark Mode`, true);
        darkModeToggleButton.innerHTML = `Light Mode`;
    } else {
        localStorage.setItem(`Dark Mode`, false);
        darkModeToggleButton.innerHTML = `Dark Mode`;
    }
});

function updateUser(logUser) {
    Object.assign(user, ...([...userInputs].map(input => {
        return {[input.id]: input.value}
    })));
    users.splice(users.indexOf(users.filter(usr => usr.id == user.id)[0]), 1, user);
    if (logUser) console.log(`Updated User`, user);
    if (user.username) userHello.innerHTML = user.username;
    localStorage.setItem(`User`, JSON.stringify(user));
    localStorage.setItem(`Users`, JSON.stringify(users));
}

// Registration
signUpButton.addEventListener(`click`, event => {
    let newUser = {
        id: users.length + 1,
        email: emailInput.value,
        password: passwordInput.value,
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
    updateUser(true);
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

userInputs.forEach(input => {
    input.addEventListener(`input`, event => {
        updateUser(true);
    })
})