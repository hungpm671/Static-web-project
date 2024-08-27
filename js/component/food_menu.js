// Config Axios client
const foods = axios.create({
  baseURL: "https://66be374d74dfc195586ee7a3.mockapi.io/foods/",
});

// Foods
async function getFoods() {
  const res = await foods.get("product-list");
  return res.data;
}

export function foodMenu() {
  const emblaNode = document.querySelector(".embla_menu");
  const options = { loop: false };
  const emblaApi = EmblaCarousel(emblaNode, options);
}

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
    .map((food) => {
      return `
      <div class="col-12 col-sm-6 col-md-4 all-food">
              <div class="food-item overflow-hidden">
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
                    <div class="food-price">${food.price}₫</div>
                    <button
                      class="btn-cart d-flex align-items-center justify-content-center bg-warning border-0 text-white"
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
}

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
}
