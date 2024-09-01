import { getUsers } from "../api.js";
import { Set_Up_UserOption, setItemLocalStorage } from "./setup_user_option.js";

function formValidation_SignIn(users) {
  const inputName = document.querySelector(".sign-in_form input[type='email']");
  const inputPass = document.querySelector(
    ".sign-in_form input[type='password']"
  );
  const error = document.querySelector(".sign-in_form .error-alert");

  const btnSubmit = document.querySelector(
    ".sign-in_form input[type='submit']"
  );

  const regexPass = /^[a-zA-Z\d]{8,}$/;
  btnSubmit.addEventListener("click", function (e) {
    // Check password validity
    if (!regexPass.test(inputPass.value)) {
      e.preventDefault();
      error.style.display = "block";
      error.innerText =
        "* Password must be at least 8 characters long, without special characters.";
    }

    // Check your account and password
    let flag = false;
    const infoUser = [];
    for (let user of users) {
      if (inputName.value === user.email && inputPass.value === user.password) {
        flag = true;
        infoUser.push(user);
        break;
      }
    }

    if (flag) {
      error.style.display = "none";
      error.innerText = "";
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setItemLocalStorage(infoUser[0]);
      }
    } else {
      e.preventDefault();
      error.style.display = "block";
      error.innerText = "* Invalid email or password.";
    }

    Set_Up_UserOption();
  });
}

export function Sign_In() {
  getUsers().then(formValidation_SignIn);
}
