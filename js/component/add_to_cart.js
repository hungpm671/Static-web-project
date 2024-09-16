import { getFoods, getUsers } from "../api.js";
import { badgeNoticeCart } from "./badge_notice_cart.js";
import { ToastMessage } from "./toast_message.js";

function btnAdd(users = []) {
  const btnCart = document.querySelectorAll(".btn-cart");

  btnCart.forEach((btn) => {
    btn.addEventListener("click", function () {
      const foodItem = btn.closest(".food-item");
      const foodId = foodItem.getAttribute("data-food_id");

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

          const updatedCart = updateCartQuantity(updatedUsers, idUser, foodId);

          axios
            .put(usersURL, {
              cart: updatedCart,
            })
            .then((response) => {
              badgeNoticeCart();
            })
            .catch((error) => {
              console.error("Error updating cart:", error);
            });
        });
      } else {
        alert("You need to be logged in to use this feature");
      }
    });
  });
}

function updateCartQuantity(users, idUser, foodId) {
  let cartYourUser = [...users[idUser].cart];

  const itemExists = cartYourUser.some((item) => item.food_id == foodId);

  if (itemExists) {
    cartYourUser = cartYourUser.map((item) => {
      if (item.food_id == foodId) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
  } else {
    cartYourUser.push({
      food_id: foodId,
      quantity: 1,
      category: 1,
      isChecked: true,
    });
  }

  return cartYourUser;
}

export function addToCart() {
  getUsers().then(btnAdd);
}
// add to cart when user seen dish information
function addToCartWhenSeenInfo(dataId) {
  const dishInputCounter = document.querySelector(".dish-input-counter");
  const selectedItem = document.querySelector(
    ".dish-input-quantity .select-size"
  );

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userId = JSON.parse(storedUser).user_id;

    getUsers().then((updatedUsers) => {
      const idUser = updatedUsers.findIndex((user) => user.user_id == userId);

      const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
        Number(idUser) + 1
      }`;

      let updatedCart = [...updatedUsers[idUser].cart];

      const itemExists = updatedCart.some((item) => item.food_id == dataId);

      if (itemExists) {
        updatedCart = updatedCart.map((item) => {
          if (item.food_id == dataId) {
            return {
              ...item,
              quantity: Number(dishInputCounter.value) + item.quantity,
              category: Number(selectedItem.value),
              isChecked: true,
            };
          }
          return item;
        });
      } else {
        updatedCart.push({
          food_id: dataId,
          quantity: Number(dishInputCounter.value),
          category: Number(selectedItem.value),
          isChecked: true,
        });
      }

      axios
        .put(usersURL, {
          cart: updatedCart,
        })
        .then((response) => {
          ToastMessage(
            "Added to cart successfully",
            "Cart updated successfully"
          );
          badgeNoticeCart();
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
        });
    });
  }
}

export function btnAddToCartWhenSeenInfo(dataId) {
  const btnAddToCart = document.querySelector(
    "#dish-infomation .btn-add-to-cart"
  );
  btnAddToCart.addEventListener("click", function () {
    addToCartWhenSeenInfo(dataId);
  });
}
