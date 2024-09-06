import { getFoods, getUsers } from "../api.js";

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
      isChecked: true,
    });
  }

  return cartYourUser;
}

export function addToCart() {
  getUsers().then(btnAdd);
}
