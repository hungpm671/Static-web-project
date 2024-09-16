import { getFoods, getUsers } from "../api.js";
import { addToCart, btnAddToCartWhenSeenInfo } from "./add_to_cart.js";
import { ToastMessage } from "./toast_message.js";

// classify food
export function foodMenu() {
  const emblaNode = document.querySelector(".embla_menu");
  const options = { loop: false, draggable: false };
  const emblaApi = EmblaCarousel(emblaNode, options);
}

// render food
function renderFood(foodArray = [], category) {
  let classify = category.toLowerCase();
  // Filter foods by category
  const filteredFoods = foodArray.filter((food) => {
    if (classify == "all") {
      return true;
    } else {
      return food.classify == classify;
    }
  });

  const html = filteredFoods
    .map((food, index) => {
      const foodIndex = foodArray.findIndex(
        (item) => item.food_id === food.food_id
      );
      return `
      <div class="col-12 col-sm-6 col-md-4 all-food">
              <div class="food-item overflow-hidden" data-food_id="${
                food.food_id
              }" data-id="${foodIndex}">
                <div class="food-thumb d-flex">
                  <img
                    class="food-img object-fit-cover"
                    src="${food.image}"
                    alt="${food.name}"
                  />
                </div>
                <div class="food-content text-white">
                  <h5 class="food-title">${food.name}</h5>
                  <p class="food-detail">${food.description}</p>
                  <div
                    class="food-options d-flex align-items-center justify-content-between"
                  >
                    <div class="food-price">${Number(food.price).toLocaleString(
                      "vi-VN"
                    )}₫</div>
                    <button
                      class="btn-cart btn-toast_msg d-flex align-items-center justify-content-center bg-warning border-0 text-white"
                    >
                      <i class="ph ph-shopping-cart fs-4"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
    `;
    })
    .join("");

  $(".food-list .row").html(html);

  showAll();
  addToCart();
  toggleFoodInfomation(foodArray);
  ToastMessage();
}

// Toggle see more/see less
function showAll() {
  const btnOrder = document.querySelector(".btn-show-all .btn-order");

  if ($(".food-list .all-food").length > 6) {
    $(".food-list .all-food").slice(0, 6).addClass("show");
    btnOrder.style.display = "flex";
    btnOrder.innerText = "See More";
  } else {
    $(".food-list .all-food")
      .slice(0, $(".food-list .all-food").length)
      .addClass("show");
    btnOrder.style.display = "none";
  }

  btnOrder.addEventListener("click", () => {
    const allfoods = document.querySelectorAll(".all-food");
    allfoods.forEach((food) => {
      food.classList.toggle("show-all");
    });

    btnOrder.innerText =
      btnOrder.innerText == "See More" ? "See Less" : "See More";
  });
}

// Filter foods by category
let category = "all";
function selectFood() {
  const emblaMenuItem = document.querySelectorAll(".embla-menu-item");

  emblaMenuItem.forEach((item) =>
    item.addEventListener("click", function () {
      const active = document.querySelector(".embla-menu-item.active");
      active.classList.remove("active");
      item.classList.add("active");
      category = item.innerText;
      getFoods().then((data) => renderFood(data, category));
    })
  );
}

export function foodList() {
  getFoods().then((data) => renderFood(data, category));
  selectFood();

  const btnNavToggle = document.querySelector(".navbar-toggler");
  btnNavToggle.innerHTML = `<i class="ph ph-list"></i>`;
}

// when clicking on the menu item
function toggleFoodInfomation(foodArray) {
  const foods = document.querySelectorAll(".food-list .all-food");

  const dishInfomation = document.querySelector("#dish-infomation");
  const dishInfo = document.querySelector(".dish-info");

  foods.forEach((food) => {
    const foodImg = food.querySelector(".food-thumb");
    foodImg.addEventListener("click", () => {
      const foodItem = food.querySelector(".food-item");
      const dataId = foodItem.getAttribute("data-food_id");
      const foodIndex = foodItem.getAttribute("data-id");

      dishInfomation.style.display = "block";

      renderFoodInfo(dataId, foodIndex);
    });
  });

  dishInfomation.addEventListener("click", (e) => {
    dishInfomation.style.display = "none";
    dishInfo.innerHTML = "";
  });

  dishInfo.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

export function getFoodInfo(foods = [], id, index) {
  const dishInfomation = document.querySelector(".dish-info");
  const foodItem = foods.find((food) => food.food_id === id);

  const html = `
        <div class="dish-content">
          <div class="row">
            <div class="col-12 col-lg-6 d-flex">
              <img
                class="img-thumb"
                src="${foodItem.image}"
                alt="${foodItem.name}"
              />
            </div>

            <div class="col-12 col-lg-6">
              <div class="d-flex align-items-center gap-3 mb-3">
                <h2 class="font-edu fw-bold m-0">${foodItem.name}</h2>
                <div class="rating color-primary-color">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star"></i>
                </div>
              </div>

              <span class="fw-bold">Classify: <span class="text-danger">${
                foodItem.classify
              }</span></span>

              <hr />

              <h4 class="text-danger">${Number(foodItem.price).toLocaleString(
                "vi-VN"
              )}₫</h4>

              <p>
                <span class="fw-bold">Ingredients:</span>
                ${foodItem.ingredients.join(", ")}
              </p>

              <p>
                ${foodItem.description}
              </p>

              <div class="dish-input-quantity d-flex align-items-center gap-2 mb-3">
                <button class="btn-decrease bg-transparent">-</button>
                <input
                  type="number"
                  value="1"
                  class="dish-input-counter text-end border-radius-8"
                  min="1"
                  max="100"
                />
                <button class="btn-increase bg-transparent">+</button>

                <select name="select" class="select-size p-2 border-0">
                  ${foodItem.category
                    .map((cate, index) => {
                      return `<option value="${index + 1}">${cate}</option>`;
                    })
                    .join("")}
                </select>
              </div>
            
              <!-- add to cart -->
              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn-add-to-cart btn-toast_msg border-0 bg-second-color text-white border-radius-8 d-flex align-items-center gap-1"
                >
                  <i class="ph ph-shopping-cart"></i> Add to Cart
                </button>
                
                <button
                  class="btn-buy-now border-0 bg-primary-color text-white border-radius-8 d-flex align-items-center gap-1"
                >
                  <i class="ph ph-person-simple-run"></i> Buy Now
                </button>
              </div>
            </div>
          </div>

          <hr />

          <div class="dish-review">
            <h3 class="font-edu fw-bold">Reviews (${
              foodItem.rating.length
            })</h3>

            <div class="btn-tap-to-rate d-flex align-items-center gap-2 mb-2">
              <span>Tap to rate:</span>
              <div class="rating star d-flex gap-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
            </div>

            <textarea
              name="review"
              id="textarea-review"
              placeholder="Please evaluate the dish in a polite and respectful manner."
              class="w-100 border-radius-8"
            ></textarea>
            
            <button
              class="btn-send-review border-0 bg-primary-color text-white border-radius-8"
            >
              Send
            </button>
          </div>
        </div>

        <!-- reviewer -->
        <div class="about-reviewer"></div>`;

  dishInfomation.innerHTML = html;

  ToastMessage();
  ratingReviewClick();
  updatedReview(foodItem);
  userComment(index);
  changeQuantity();
  btnAddToCartWhenSeenInfo(id);
}

// reviewer feedback
export function renderFoodInfo(dataId, foodIndex) {
  getFoods().then((foods) => getFoodInfo(foods, dataId, foodIndex));
}

// comments
function userComment(index) {
  const foodURL = `https://66be374d74dfc195586ee7a3.mockapi.io/foods/product-list/${
    Number(index) + 1
  }`;
  const storedUser = localStorage.getItem("user");

  const sendReview = document.querySelector(".btn-send-review");

  sendReview.addEventListener("click", () => {
    const review = document.getElementById("textarea-review").value;

    const rateStarLength = document.querySelectorAll(
      ".btn-tap-to-rate .rating i.active"
    );

    const date = new Date();

    if (storedUser) {
      const userId = JSON.parse(storedUser).user_id;

      getFoods().then((foods) => {
        const ratingFood = [...foods[index].rating];
        const findIndex = ratingFood.findIndex(
          (food) => food.user_id === userId
        );

        if (findIndex === -1) {
          ratingFood.push({
            user_id: userId,
            content: review,
            date: `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`,
            rate: rateStarLength.length,
          });
        } else {
          ratingFood[findIndex].content = review;
          ratingFood[findIndex].date = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          ratingFood[findIndex].rate = rateStarLength.length;
        }

        axios
          .put(foodURL, {
            rating: ratingFood,
          })
          .then((response) => {
            updatedReview(response.data);
          })
          .catch((error) => {
            console.error("There was an error updating the cart:", error);
          });
      });
    }
  });
}

// reload comments
async function updatedReview(foods) {
  const dishReview = document.querySelector(".about-reviewer");
  const reversedDishReview = foods.rating.reverse();

  const htmlPromises = reversedDishReview.map(async (rate) => {
    const username = await showName(rate.user_id);
    return `
      <div class="reviewer-dish d-flex py-3 gap-3">
        <div class="reviewer-avatar d-flex fs-1 mt-2">
          <i class="ph ph-user-circle"></i>
        </div>
        <div class="reviewer-content flex-grow-1 p-2 border-radius-8">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="reviewer-name fw-bold">${username}</span>
              <div class="reviewer-rating rating">
                ${showRatingStar(rate.rate)}
              </div>
            </div>
            <span class="reviewer-date">${rate.date}</span>
          </div>
          <p class="mt-2">${rate.content}</p>
        </div>
      </div>`;
  });

  const html = (await Promise.all(htmlPromises)).join("");

  dishReview.innerHTML = html;

  const reviewLength = document.querySelector(".dish-review h3");
  reviewLength.textContent = `Reviews (${foods.rating.length})`;
}

// button rate star
function ratingReviewClick() {
  const stars = document.querySelectorAll(".rating i");

  stars.forEach((item, index) => {
    item.addEventListener("click", () => {
      stars.forEach((star, indexStar) => {
        index >= indexStar
          ? star.classList.add("active")
          : star.classList.remove("active");
      });
    });
  });
}

// show rating
function showRatingStar(selectedStar) {
  let starsHTML = "";
  for (let i = 0; i < 5; i++) {
    if (i < selectedStar) {
      starsHTML += `<i class="bi bi-star-fill active"></i>`;
    } else {
      starsHTML += `<i class="bi bi-star-fill"></i>`;
    }
  }
  return starsHTML;
}

// show user name
async function showName(id) {
  try {
    const users = await getUsers();
    const user = users.find((user) => user.user_id === id);
    return user ? user.name : "User not found";
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "User not found";
  }
}

////////////////////////////// Feature //////////////////////////
function changeQuantity() {
  const btnMinus = document.querySelector(".dish-input-quantity .btn-decrease");
  const btnPlus = document.querySelector(".dish-input-quantity .btn-increase");
  const inputQuantity = document.querySelector(
    ".dish-input-quantity input[type='number']"
  );
  btnMinus.addEventListener("click", () => {
    const currentQuantity = Number(inputQuantity.value);
    if (currentQuantity > 1) {
      inputQuantity.value = currentQuantity - 1;
    }
  });

  btnPlus.addEventListener("click", () => {
    const currentQuantity = Number(inputQuantity.value);
    if (currentQuantity < 100) {
      inputQuantity.value = currentQuantity + 1;
    }
  });
}
