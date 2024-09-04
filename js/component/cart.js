import { getFoods, getUsers } from "../api.js";

function renderYourCart(users = []) {
  const cartList = document.querySelector(".cart-list");

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
          filteredFoods.push({ ...findFood, quantity: usercart.quantity });
        }
      }

      const html =
        filteredFoods.length > 0
          ? filteredFoods
              .map((food) => {
                return `
        <div class="cart-item d-flex">
          <input type="checkbox" name="checkbox" />
          <img
            src="${food.image}"
            alt="${food.name}"
            width="100"
            height="100"
            class="object-fit-cover ms-3"
          />
          <div class="cart-info d-flex flex-column ms-3 flex-grow-1">
            <span class="font-edu fw-bold">${food.name}</span>
            <select name="select" id="select-size" class="border-0 w-25">
              <option selected>Size Selection</option>
              ${food.category.map((category) => {
                return `<option value="${category}">${category}</option>`;
              })}      
            </select>
            <div
              class="cart-option mt-3 d-flex justify-content-between align-items-center"
            >
              <div class="price text-danger">${Number(
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
        </div>`;
              })
              .join("")
          : "<h2>Empty Cart</h2>";

      cartList.innerHTML = html;
    });
  }

  closeCart();
}

export function Cart() {
  getUsers().then(renderYourCart);
}

function closeCart() {
  const cartDiv = document.querySelector("#cart");
  const cartInfomation = document.querySelector(".cart-infomation");

  cartDiv.addEventListener("click", function () {
    cartDiv.style.display = "none";
  });

  cartInfomation.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
