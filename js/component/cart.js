import { getFoods, getUsers } from "../api.js";
import { badgeNoticeCart } from "./badge_notice_cart.js";
import { ToastMessage } from "./toast_message.js";

function render(user) {
  const cartList = document.querySelector(".cart-list");
  getFoods().then((foods) => {
    const filteredFoods = [];

    if (user.cart.length > 0) {
      for (let usercart of user.cart) {
        const findFood = foods.find(
          (food) => food.food_id === usercart.food_id
        );
        filteredFoods.push({
          ...findFood,
          quantity: usercart.quantity,
          selected: usercart.category,
          isChecked: usercart.isChecked,
        });
      }
    }

    const html =
      filteredFoods.length > 0
        ? filteredFoods
            .map((food) => {
              return `
      <div class="cart-item d-flex" data-item="${food.food_id}">
        <input type="checkbox" name="checkbox" class="check-item" ${
          food.isChecked ? "checked" : ""
        }/>
        <img
          src="${food.image}"
          alt="${food.name}"
          width="100"
          height="100"
          class="object-fit-cover ms-3"
        />
        <div class="cart-info d-flex flex-column ms-3 flex-grow-1">
          <span class="font-edu fw-bold">${food.name}</span>
          <select name="select" class="select-size border-0 w-25 mt-2">
            ${food.category
              .map((category, index) => {
                return `<option value="${index + 1}" ${
                  food.selected === index + 1 ? "selected" : ""
                }>${category}</option>`;
              })
              .join("")}      
          </select>
          <div
            class="cart-option mt-3 d-flex justify-content-between align-items-center"
          >
            <div class="price text-danger" data-price="${food.price}">${Number(
                food.price
              ).toLocaleString("vi-VN")}₫</div>
            <div class="quantity d-flex align-items-center">
              <button class="btn-minus border-0">-</button>
              <input
                type="number"
                value="${Number(food.quantity)}"
                min="1"
                max="10"
                class="text-end border-0"
              />
              <button class="btn-plus border-0">+</button>
            </div>
          </div>
        </div>
        
        <div class="cart-remove">
            <button class="btn-remove btn-toast_msg border-0 p-2 d-flex bg-transparent"><i class="ph ph-x"></i></button>
        </div>
      </div>`;
            })
            .join("")
        : "<h2>Empty Cart</h2>";

    cartList.innerHTML = html;
    getUsers().then(totalItemChecked);
    checkedCart();
    changeQuantity();
    removeCartItem();
    ToastMessage("Added to cart successfully", "Cart updated successfully");
    changeCategory();
  });
}

// render your cart list
function renderYourCart(users = []) {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = users.find(
      (user) => user.user_id === JSON.parse(storedUser).user_id
    );

    render(user);
  }
  closeCart();
}

export function Cart() {
  getUsers().then(renderYourCart);
}

// close the cart
function closeCart() {
  const cartDiv = document.querySelector("#cart");
  const cartInfomation = document.querySelector(".cart-infomation");
  const billInfo = document.querySelector("#cart .bill-infomation");

  cartDiv.addEventListener("click", function () {
    cartDiv.style.display = "none";
    billInfo.style.display = "none";
  });

  cartInfomation.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  billInfo.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// select item
function checkedCart() {
  const allChecked = document.querySelector("#check-all");

  // select all items
  allChecked.addEventListener("change", function () {
    const cartItems = document.querySelectorAll(".check-item");
    cartItems.forEach((item) => {
      item.checked = allChecked.checked;
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).user_id;

      getUsers().then((updatedUsers) => {
        const idUser = updatedUsers.findIndex((user) => user.user_id == userId);

        const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
          Number(idUser) + 1
        }`;

        const updatedCart = updatedUsers[idUser].cart.map((item) => {
          return {
            ...item,
            isChecked: allChecked.checked,
          };
        });

        axios
          .put(usersURL, {
            cart: updatedCart,
          })
          .then((response) => {
            render(response.data);
          })
          .catch((error) => {
            console.error("Error updating cart:", error);
          });
      });
    }

    getUsers().then(totalItemChecked);
  });

  // select item
  const cartItems = document.querySelectorAll(".check-item");
  cartItems.forEach((item) => {
    item.addEventListener("change", function () {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).user_id;

        getUsers().then((updatedUsers) => {
          const idUser = updatedUsers.findIndex(
            (user) => user.user_id == userId
          );

          const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
            Number(idUser) + 1
          }`;

          const updatedCart = [];
          const idFood = item.closest(".cart-item").getAttribute("data-item");
          for (let usercart of updatedUsers[idUser].cart) {
            if (usercart.food_id == idFood) {
              usercart.isChecked = item.checked;
            }
            updatedCart.push(usercart);
          }

          axios
            .put(usersURL, {
              cart: updatedCart,
            })
            .then((response) => {
              render(response.data);
              getUsers().then(totalItemChecked);
            })
            .catch((error) => {
              console.error("Error updating cart:", error);
            });
        });
      }
    });
  });
}

// update total all cart items
function totalItemChecked(users) {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = users.find(
      (user) => user.user_id === JSON.parse(storedUser).user_id
    );

    getFoods().then((foods) => {
      const filteredFoods = [];

      if (user.cart.length > 0) {
        for (let usercart of user.cart) {
          const findFood = foods.find(
            (food) => food.food_id === usercart.food_id
          );
          filteredFoods.push({
            ...findFood,
            quantity: usercart.quantity,
            isChecked: usercart.isChecked,
          });
        }
      }

      const totalPrice = filteredFoods
        .filter((item) => item.isChecked)
        .reduce((total, item) => total + item.price * item.quantity, 0);

      const totalCart = document.querySelector("#cart .cart-total");
      totalCart.textContent = Number(totalPrice).toLocaleString("vi-VN");
    });
  }
}

// Increase or decrease the quantity
function changeQuantity() {
  const quantities = document.querySelectorAll(".quantity");
  quantities.forEach((quantity) => {
    const btnMinus = quantity.querySelector(".btn-minus");
    const btnPlus = quantity.querySelector(".btn-plus");
    const inputQuantity = quantity.querySelector("input[type='number']");
    btnMinus.addEventListener("click", () => {
      const currentQuantity = Number(inputQuantity.value);
      if (currentQuantity > 1) {
        inputQuantity.value = currentQuantity - 1;
      }

      const idFood = btnMinus.closest(".cart-item");
      updateCartChanged(idFood);
    });

    btnPlus.addEventListener("click", () => {
      const currentQuantity = Number(inputQuantity.value);
      if (currentQuantity < 10) {
        inputQuantity.value = currentQuantity + 1;
      }
      const idFood = btnPlus.closest(".cart-item");
      updateCartChanged(idFood);
    });
  });
}

function updateCartChanged(item) {
  const dataItem = item.getAttribute("data-item");

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userId = JSON.parse(storedUser).user_id;

    getUsers().then((updatedUsers) => {
      const idUser = updatedUsers.findIndex((user) => user.user_id == userId);

      const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
        Number(idUser) + 1
      }`;

      const updatedCart = [];
      for (let userCart of updatedUsers[idUser].cart) {
        if (userCart.food_id == dataItem) {
          userCart.quantity = Number(
            item.querySelector(".quantity input[type='number']").value
          );
        }
        updatedCart.push(userCart);
      }

      axios
        .put(usersURL, {
          cart: updatedCart,
        })
        .then((response) => {
          getUsers().then(totalItemChecked);
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
        });
    });
  }
}

// remove cart item
function removeCartItem() {
  const btnRemove = document.querySelectorAll(".cart-item .btn-remove");
  btnRemove.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      const dataItem = item.getAttribute("data-item");

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).user_id;

        getUsers().then((updatedUsers) => {
          const idUser = updatedUsers.findIndex(
            (user) => user.user_id == userId
          );

          const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
            Number(idUser) + 1
          }`;

          const updatedCart = [];
          for (let userCart of updatedUsers[idUser].cart) {
            if (userCart.food_id == dataItem) {
              continue;
            }
            updatedCart.push(userCart);
          }

          axios
            .put(usersURL, {
              cart: updatedCart,
            })
            .then((response) => {
              badgeNoticeCart();
              render(response.data);
            })
            .catch((error) => {
              console.error("Error updating cart:", error);
            });
        });
      }
    });
  });
}

// change categories
function changeCategory() {
  const selectElements = document.querySelectorAll(".select-size");
  selectElements.forEach((select) => {
    select.addEventListener("change", (e) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).user_id;

        getUsers().then((updatedUsers) => {
          const idUser = updatedUsers.findIndex(
            (user) => user.user_id == userId
          );

          const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
            Number(idUser) + 1
          }`;

          const updatedCart = [];
          const idFood = select.closest(".cart-item").getAttribute("data-item");
          for (let usercart of updatedUsers[idUser].cart) {
            if (usercart.food_id == idFood) {
              usercart.category = Number(e.target.value);
            }
            updatedCart.push(usercart);
          }

          axios
            .put(usersURL, {
              cart: updatedCart,
            })
            .then((response) => {
              render(response.data);
            })
            .catch((error) => {
              console.error("Error updating cart:", error);
            });
        });
      }
    });
  });
}
