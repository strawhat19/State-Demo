import { globalFunctions } from "./globalFunctions.js";

const userHello = document.querySelector(`.userHello`);
let user = JSON.parse(localStorage.getItem(`User`));
const users = globalFunctions.removeDuplicateObjectFromArray(JSON.parse(localStorage.getItem(`Users`))) || [];
const emails = globalFunctions.removeDuplicateObjectFromArray(JSON.parse(localStorage.getItem(`Emails`))) || [];
const faveNumber = document.querySelector(`.faveNumber`);
const userMessage = document.querySelector(`.userMessage`);
const userDataForm = document.querySelector(`#userData`);
const signInButton = document.querySelector(`.signInButton`);
const signOutButton = document.querySelector(`.signOutButton`);
const slidingBanner = document.querySelector(`.slidingBanner`);
const signUpButton = document.querySelector(`.signUpButton`);
const delAccButton = document.querySelector(`.delAccButton`);
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

    // Get the current new Date() and reference that
    // If we use new Date() over and over again it will be milliseconds apart
    // Better to call new Date() once and set it to the date variable to reference
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? `PM` : `AM`;
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0`+minutes : minutes;

    // Format Date & Time Created
    let timeCreated = [hours, minutes].join(`_`) + `_` + ampm;
    let dateCreated = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear()
    ].join(`_`);

    // Generate random characters
    let randomString = Math.random().toString(36).substr(2, 9);

    // Verify it is unique by checking the random characters of other users
    if (users.length > 1) {
        // Get the current existing user accounts, extract their ID's and then pop() to get the characters after the last `_`
        let idCharsFromOtherUsers = users.map(usr => usr.id.split(`_`).pop());
        // If the Random Characters have been used by a different user before, regenerate a new random string
        while (idCharsFromOtherUsers.includes(randomString)) {
            randomString = Math.random().toString(36).substr(2, 9);
        }
    }

    // Combine all the Account Creation Parameters to make a New Unique ID
    let uniqueID = `user_${emails.length + 1}_${timeCreated}_${dateCreated}_${randomString}`;

    let newUser = {
        id: uniqueID,
        email: emailInput.value,
        favoriteColor: `#000000`,
        password: passwordInput.value,
    };

    if (users.map(usr => usr.email).includes(emailInput.value)) {
        console.log(`Existing User`);
        userMessage.innerHTML = `Existing User, Please Sign In`;
        document.querySelector(`section`).prepend(userMessage);
    } else {
        users.push(newUser);
        emails.push(newUser.email);
        localStorage.setItem(`User`, JSON.stringify(newUser));
        localStorage.setItem(`Users`, JSON.stringify(users));
        localStorage.setItem(`Emails`, JSON.stringify(emails));
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
    localStorage.removeItem(`User`);
    localStorage.setItem(`Users`, JSON.stringify(users.filter(usr => usr.email != user.email)));
    user = null;
    window.location.reload();
});

userInputs.forEach(input => {
    input.addEventListener(`input`, event => {
        updateUser(true);
    })
})