import { getFoods } from "../api.js";
import { renderFoodInfo } from "./food_infomation.js";

function searchResult(foods) {
  const searchInput = document.querySelector("#search-input");
  const findText = document.querySelector(".breadcrumb-item.active");
  const searchResultList = document.querySelector(".search-result-list .row");

  searchInput.addEventListener("input", function () {
    if (searchInput.value.length > 0) {
      document.querySelector("#search-result").style.display = "block";
    } else {
      document.querySelector("#search-result").style.display = "none";
    }

    let searchText = searchInput.value.toLowerCase();
    const filteredFoods = foods.filter((food) =>
      food.name.toLowerCase().includes(searchText)
    );

    findText.textContent = searchText;

    if (filteredFoods.length > 0) {
      const foodList = filteredFoods
        .map((item) => {
          const foodIndex = foods.findIndex(
            (food) => item.food_id === food.food_id
          );
          return `
      <div class="col-12 border-radius-8 overflow-hidden">
        <div
          class="search-result-item position-relative d-flex align-items-center gap-3"
          data-food_id="${item.food_id}"
          data-id="${Number(foodIndex)}"
        >
          <img
            src="${item.image}"
            alt="${item.name}"
          />

          <div class="search-result-content">
            <h5 class="search-result-title">${item.name}</h5>
            <span class="search-result-description"
              >${item.description}</span
            >
          </div>

          <button
            class="btn-show-more_info text-white position-absolute bottom-0 start-0 end-0 border-0 align-items-center pb-2 ps-2"
          >
            <i class="ph ph-magnifying-glass me-2"></i> Read more
          </button>
        </div>
      </div>`;
        })
        .join("");

      searchResultList.innerHTML = foodList;

      seeMoreInfo(foods);
    } else {
      searchResultList.innerHTML = `<h4>No Result</h4>`;
    }
  });
}

export function searchFeature() {
  getFoods().then(searchResult);
}

function seeMoreInfo(foods) {
  const btnMoreInfo = document.querySelectorAll(".btn-show-more_info");
  const dishInfomation = document.querySelector("#dish-infomation");

  btnMoreInfo.forEach((btn) => {
    btn.addEventListener("click", function () {
      const dataId = btn
        .closest(".search-result-item")
        .getAttribute("data-food_id");
      const foodIndex = btn
        .closest(".search-result-item")
        .getAttribute("data-id");

      dishInfomation.style.display = "block";

      renderFoodInfo(dataId, foodIndex);
    });
  });
}
