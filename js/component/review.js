import { getReviews } from "../api.js";
import {
  ratingReviewClick,
  showAvatar,
  showName,
  showRatingStar,
} from "./food_infomation.js";

// carousel reviewer
export function reviewStore() {
  let owl = $(".owl-carousel");
  owl.owlCarousel({
    items: 1,
    loop: true,
    dots: false,
    nav: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    autoplaySpeed: 1500,
    center: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      786: {
        margin: 0,
      },
      992: {
        items: 2,
        margin: 0,
      },
      1200: {
        items: 2,
        center: false,
        margin: 10,
      },
    },
  });
}

export function formReview() {
  const confirmInformation = document.querySelector("#confirm-information");
  if (confirmInformation) {
    confirmInformation.innerHTML = `
          <div
            class="store-review d-flex flex-column container bg-white p-2 border-radius-8"
          >
            <div class="store-star rating d-flex justify-content-between fs-2">
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
              <i class="bi bi-star-fill"></i>
            </div>
            <small class="review-warning text-danger"></small>
            <div class="store-form d-flex flex-column">
              <textarea
                name="textarea-review"
                id="textarea-review-store"
                placeholder="Nhận xét của bạn"
                class="border-radius-8 p-2 mt-2"
              ></textarea>
              <input
                type="submit"
                value="Xác nhận"
                class="mt-2 bg-primary-color border-0 text-white border-radius-8 p-2"
              />
            </div>
          </div>`;
    ratingReviewClick();
    postStoreReview(confirmInformation);
  }
}

function postStoreReview(confirmInformation) {
  const btnPostRev = document.querySelector(".store-form input[type='submit']");
  const reviewWarning = document.querySelector(".review-warning");
  if (btnPostRev) {
    btnPostRev.addEventListener("click", () => {
      const review = document.getElementById("textarea-review-store").value;
      const rateStarLength = document.querySelectorAll(
        ".store-star i.active"
      ).length;

      if (rateStarLength == 0) {
        if (reviewWarning) {
          reviewWarning.textContent = "Please select a rating level";
        }
        return;
      }

      const date = new Date();

      const reviewURL = `https://66be374d74dfc195586ee7a3.mockapi.io/foods/review-store`;

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).user_id;

        getReviews().then((reviews) => {
          const findUserReview = reviews.find((r) => r.user_id === userId);

          if (!findUserReview) {
            const newReview = {
              user_id: userId,
              content: review,
              date: `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()}`,
              rate: rateStarLength,
            };

            axios
              .post(reviewURL, newReview)
              .then((response) => {
                console.log("Review added:", response.data);
                confirmInformation.innerHTML = "";
                confirmInformation.style.display = "none";
              })
              .catch((error) => {
                console.error("Lỗi khi thêm review:", error);
              });
          } else {
            findUserReview.content = review;
            findUserReview.rate = rateStarLength;
            findUserReview.date = `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;

            axios
              .put(`${reviewURL}/${findUserReview.id}`, findUserReview)
              .then((response) => {
                console.log("Review updated:", response.data);
                confirmInformation.innerHTML = "";
                confirmInformation.style.display = "none";
              })
              .catch((error) => {
                console.error("Lỗi khi cập nhật review:", error);
              });
          }
        });
      }
    });
  }
}

async function renderReviewer(reviewers) {
  const reviewCarousel = document.querySelector("#review .owl-carousel");
  if (reviewCarousel) {
    const htmlPromises = reviewers.map(async (reviewer) => {
      const username = await showName(reviewer.user_id);
      const userAvatar = await showAvatar(reviewer.user_id);
      return `
            <div class="review-item d-flex justify-content-center">
              <div class="reviewer text-white">
                <div class="d-flex align-items-center">
                  <img
                    class="object-fit-cover w-25"
                    src="${userAvatar}"
                    alt="${username}"
                    width="75"
                    height="75"
                  />
                  <div class="ms-3">
                    <h3 class="font-edu fw-medium fs-6 m-0">${username}</h3>
                    <div class="rating">
                    ${showRatingStar(reviewer.rate)}
                    </div>
                  </div>
                </div>
                <hr />
                <p>
                  ${reviewer.content}
                </p>
              </div>
            </div>`;
    });
    const html = (await Promise.all(htmlPromises)).join("");

    reviewCarousel.innerHTML = html;

    reviewStore();
  }
}

export function getRenderReviewer() {
  getReviews().then(renderReviewer);
}
