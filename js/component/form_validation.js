import { showOrderYourCart } from "./bill_foods.js";
import { Cart } from "./cart.js";
import { searchFeature } from "./search.js";
import { clearLocalStorage, Set_Up_UserOption } from "./setup_user_option.js";

export function btnFormValidation() {
  const btnSignIn = document.querySelector(".btn-sign-in");
  const formSignIn = document.querySelector("#user-menu");
  const btnCloseSignIn = document.querySelector(".sign-in_form .close_btn");
  const formSignUp = document.querySelector(".sign-up_form");
  const btnCloseSignUp = document.querySelectorAll(".sign-up_form .close_btn");
  const showPassword = document.querySelectorAll(".btn-toggle_pass");
  const showSignUp = document.querySelectorAll(".btn-show-sign_up");
  const btnLogOut = document.querySelector(".btn-logout");
  const btnCart = document.querySelector(".btn-cart-user");
  const showCart = document.querySelector("#cart");
  const btnSearch = document.querySelector(".btn-show-search_form");
  const searchBar = document.querySelector("#search-bar");
  const btnCloseSearch = document.querySelector("#close-search-bar");
  const btnUserInfo = document.querySelector(".btn-user-info");
  const userInfomation = document.querySelector("#user-infomation");

  if (btnLogOut) {
    btnLogOut.addEventListener("click", function () {
      clearLocalStorage();
      Set_Up_UserOption();
      btnFormValidation();
      window.location.href = "index.html";
    });
  }

  // show sign in form
  if (btnSignIn) {
    btnSignIn.addEventListener("click", function () {
      formSignIn.style.display = "block";
    });
  }

  // close sign in form
  btnCloseSignIn.addEventListener("click", function () {
    formSignIn.style.display = "none";
    formSignUp.style.display = "none";
  });

  // show sign up form
  showSignUp.forEach((show) => {
    show.addEventListener("click", function () {
      formSignUp.style.display = "block";
    });
  });

  // close sign up form
  btnCloseSignUp.forEach((show) => {
    show.addEventListener("click", function () {
      formSignUp.style.display = "none";
    });
  });

  // show password
  showPassword.forEach((show) => {
    show.addEventListener("click", function (e) {
      e.preventDefault();
      // toggle password visibility
      const input = show.nextElementSibling;

      input.type = input.type === "password" ? "text" : "password";

      // change icon when show/hide password
      if (input.type == "password") {
        show.innerHTML = `<i class="ph ph-eye"></i>`;
      } else {
        show.innerHTML = `<i class="ph ph-eye-closed"></i>`;
      }
    });
  });

  if (btnCart) {
    btnCart.addEventListener("click", function () {
      Cart();
      showOrderYourCart();
      showCart.style.display = "block";
    });
  }

  // search
  btnSearch.addEventListener("click", function (e) {
    e.preventDefault();
    searchBar.style.display = "flex";
    searchFeature();
  });

  btnCloseSearch.addEventListener("click", function () {
    searchBar.style.display = "none";
  });

  // show user info
  if (btnUserInfo) {
    btnUserInfo.addEventListener("click", function () {
      userInfomation.style.display = "block";
    });
  }

  userInfomation.addEventListener("click", (e) => {
    userInfomation.style.display = "none";
  });
}
