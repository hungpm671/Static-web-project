export function signIn() {
  const btnSignIn = document.querySelector(".btn-sign-in");
  const formSignIn = document.querySelector("#user-menu");
  const btnCloseSignIn = document.querySelector(".sign-in_form .close_btn");
  const formSignUp = document.querySelector(".sign-up_form");
  const btnCloseSignUp = document.querySelector(".sign-up_form .close_btn");
  const showSignUp = document.querySelector(".sign-in_form .redirect");
  const showPassword = document.querySelectorAll(".btn-toggle_pass");

  // show sign in form
  btnSignIn.addEventListener("click", function () {
    formSignIn.style.display = "block";
  });

  // close sign in form
  btnCloseSignIn.addEventListener("click", function () {
    formSignIn.style.display = "none";
    formSignUp.style.display = "none";
  });

  // show sign up form
  showSignUp.addEventListener("click", function () {
    formSignUp.style.display = "block";
  });

  // close sign up form
  btnCloseSignUp.addEventListener("click", function () {
    formSignUp.style.display = "none";
  });

  // show password
  showPassword.forEach((show) => {
    show.addEventListener("click", function (e) {
      e.preventDefault();

      // toggle password visibility
      const input = show.nextElementSibling;
      input.type = input.type == "password" ? "text" : "password";

      // change icon when show/hide password
      if (input.type == "password") {
        show.innerHTML = `<i class="ph ph-eye"></i>`;
      } else {
        show.innerHTML = `<i class="ph ph-eye-closed"></i>`;
      }
    });
  });
}
