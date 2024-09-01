import { getUsers } from "../api.js";

const formSignUp = document.querySelector(".sign-up_form");
const inputName = formSignUp.querySelector("input[type='text']");
const inputEmail = formSignUp.querySelector("input[type='email']");
const inputPass = formSignUp.querySelector(".password-input");
const inputConfirmPass = formSignUp.querySelector(".confirm-input");
const btnSubmit = formSignUp.querySelector("input[type='submit']");
const error = formSignUp.querySelector(".error-alert");

function randomUserId(users) {
  let randomId;
  do {
    randomId = Math.floor(Math.random() * 10000);
  } while (users.some((user) => user.id === randomId));
  return randomId;
}

function getInfo(users) {
  const user = {
    user_id: randomUserId(users),
    name: inputName.value,
    email: inputEmail.value,
    password: inputPass.value,
    user_access: "user",
    cart: [],
    bill: [],
  };
  return user;
}

function postAxiosUser(users) {
  axios
    .post(
      "https://66cf273a901aab2484211ea3.mockapi.io/users/users",
      getInfo(users)
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function formValidation_SignUp(users) {
  const regexPass = /^[a-zA-Z\d]{8,}$/;
  btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    // Check password validity
    if (!regexPass.test(inputPass.value)) {
      error.style.display = "block";
      error.innerText =
        "* Password must be at least 8 characters long, without special characters.";
    }

    // Confirm password validity
    if (inputConfirmPass.value !== inputPass.value) {
      error.style.display = "block";
      error.innerText = "* Passwords do not match.";
    }

    // Check email exist
    let flag = false;
    for (let user of users) {
      if (inputEmail.value === user.email) {
        flag = true;
        break;
      }
    }
    if (flag) {
      error.style.display = "block";
      error.innerText = "* Email already exists.";
    } else {
      error.style.display = "none";
      error.innerText = "";
      postAxiosUser(users);
      alert("Success!");
      window.location.href = "index.html";
    }
  });
}

export function Sign_Up() {
  getUsers().then(formValidation_SignUp);
}
