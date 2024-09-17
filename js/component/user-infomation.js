import { getUsers } from "../api.js";
import { Set_Up_UserOption } from "./setup_user_option.js";

function userOption(users) {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const userId = JSON.parse(storedUser).user_id;
    const idUser = users.findIndex((user) => user.user_id === userId);

    renderUserInfo(users[idUser], idUser);
  }
}

export function userInfomation() {
  getUsers().then(userOption);
}

function renderUserInfo(user, id) {
  const userInfoHeader = document.querySelector(
    "#user-infomation .user-info-header"
  );
  userInfoHeader.innerHTML = `
      <img
        src="${user.avatar}"
        alt=""
        width="100"
        height="100"
      />
      <div class="d-flex position-relative">
        <input
          type="text"
          class="user-info-name text-center border-0 fw-medium"
          value="${user.name}"
          disabled
        />
        <button
          class="btn-edit-name position-absolute top-0 end-0 bottom-0 bg-transparent border-0 d-flex align-items-center"
        >
          <i class="ph ph-pencil-simple-line"></i>
        </button>
      </div>
      <span>${user.email}</span>`;
  editNameUser(id);
  userFunction(user);
}

function editNameUser(idUser) {
  const inputName = document.querySelector(
    "#user-infomation input[type='text']"
  );
  const btnEditName = document.querySelector("#user-infomation .btn-edit-name");
  const userContainer = document.querySelector(
    "#user-infomation .user-info-container"
  );

  if (btnEditName) {
    btnEditName.addEventListener("click", () => {
      inputName.disabled = false;
      inputName.focus();
    });
  }

  if (inputName) {
    inputName.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        getUsers().then((users) => {
          const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
            Number(idUser) + 1
          }`;

          axios
            .put(usersURL, {
              name: inputName.value,
            })
            .then((response) => {
              console.log(response.data);
              inputName.disabled = true;
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const updatedUser = {
                  ...JSON.parse(storedUser),
                  name: users[idUser].name,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                Set_Up_UserOption();
              }
            })
            .catch((error) => {
              console.error("Error updating cart:", error);
            });
        });
      }
    });
  }

  if (userContainer) {
    userContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

function userFunction(user) {
  const userInfoFooter = document.querySelector(
    ".user-info-container .user-info-footer"
  );

  // bill
  const btnShowBill = document.querySelector(".user-options .btn-show-bill");
  if (btnShowBill) {
    btnShowBill.addEventListener("click", function () {
      if (user.bill.length > 0) {
        userInfoFooter.innerHTML = user.bill
          .map((info) => {
            return `
        <details class="bill-list p-2">
          <summary class="d-flex align-items-center justify-content-between">
            <span class="fw-medium"
              ><i class="bi bi-journal-text me-2"></i>${info.order_id}</span
            >
            <small class="text-secondary">${info.created_at}</small>
          </summary>

          <div class="food-order-info d-flex flex-column">
            <div class="d-flex flex-column">
            ${info.foods
              .map((item) => {
                return `
                <div class="d-flex justify-content-between">
                  <span>${item.name} <small>(${item.size})</small></span>
                  <span><small>(x${item.quantity})</small>
                  ${Number(item.subtotal).toLocaleString("vi-VN")}₫</span>
                </div>`;
              })
              .join("")}
            </div>
            <span class="text-end">${Number(info.total_price).toLocaleString(
              "vi-VN"
            )}₫</span>
            <hr class="my-1" />
            <small class="mt-2"
              >Địa chỉ: ${info.phone} (${info.address})</small
            >
            <hr class="my-1" />
            <small class="mt-1">${
              info.payment_method == "cod"
                ? "Thanh toán khi nhận hàng"
                : "Thẻ tín dụng/Ghi nợ"
            }</small>
          </div>
        </details>`;
          })
          .join("");
      } else {
        userInfoFooter.innerHTML =
          "<h5>Hiện tại bạn chưa có đơn hàng nào trong giỏ hàng. Hãy thêm món ăn vào giỏ để tiếp tục!</h5>";
      }
    });
  }

  // pending
  const btnPendingConfirmationm = document.querySelector(
    ".user-options .btn-pending-confirmationm"
  );
  if (btnPendingConfirmationm) {
    btnPendingConfirmationm.addEventListener("click", () => {
      const filterPending = user.bill.filter((item) => {
        return item.status === "pending";
      });
      if (filterPending.length > 0) {
        userInfoFooter.innerHTML = filterPending
          .map((info) => {
            return `
            <details class="bill-list p-2">
              <summary class="d-flex align-items-center justify-content-between">
                <span class="fw-medium"
                  ><i class="bi bi-journal-text me-2"></i>${info.order_id}</span
                >
                <small class="text-secondary">${info.created_at}</small>
              </summary>
  
              <div class="food-order-info d-flex flex-column">
                <div class="d-flex flex-column">
                ${info.foods
                  .map((item) => {
                    return `
                    <div class="d-flex justify-content-between">
                      <span>${item.name} <small>(${item.size})</small></span>
                      <span><small>(x${item.quantity})</small>
                      ${Number(item.subtotal).toLocaleString("vi-VN")}₫</span>
                    </div>`;
                  })
                  .join("")}
                </div>
                <span class="text-end">${Number(
                  info.total_price
                ).toLocaleString("vi-VN")}₫</span>
                <hr class="my-1" />
                <small class="mt-2"
                  >Địa chỉ: ${info.phone} (${info.address})</small
                >
                <hr class="my-1" />
                <small class="mt-1"><i class="ph ph-pizza rotate-pizza"></i> Đơn hàng đang được xác nhận...</small>
              </div>
            </details>`;
          })
          .join("");
      } else {
        userInfoFooter.innerHTML =
          "<h5>Hiện tại bạn chưa có đơn hàng nào trong giỏ hàng. Hãy thêm món ăn vào giỏ để tiếp tục!</h5>";
      }
    });
  }

  // shipping
  const btnWaitingDelivery = document.querySelector(
    ".user-options .btn-waiting-delivery"
  );
  if (btnWaitingDelivery) {
    btnWaitingDelivery.addEventListener("click", () => {
      const filterDelivery = user.bill.filter((item) => {
        return item.status === "success";
      });
      if (filterDelivery.length > 0) {
        userInfoFooter.innerHTML = filterDelivery
          .map((info) => {
            return `
            <details class="bill-list p-2">
              <summary class="d-flex align-items-center justify-content-between">
                <span class="fw-medium"
                  ><i class="bi bi-journal-text me-2"></i>${info.order_id}</span
                >
                <small class="text-secondary">${info.created_at}</small>
              </summary>
  
              <div class="food-order-info d-flex flex-column">
                <div class="d-flex justify-content-between">
                ${info.foods
                  .map((item) => {
                    return `
                    <div class="d-flex flex-column">
                      <span>${item.name} <small>(${item.size})</small></span>
                      <span><small>(x${item.quantity})</small>
                      ${Number(item.subtotal).toLocaleString("vi-VN")}₫</span>
                    </div>`;
                  })
                  .join("")}
                </div>
                <span class="text-end">${Number(
                  info.total_price
                ).toLocaleString("vi-VN")}₫</span>
                <hr class="my-1" />
                <small class="mt-2"
                  >Địa chỉ: ${info.phone} (${info.address})</small
                >
                <hr class="my-1" />
                <small class="mt-1"><i class="ph ph-pizza rotate-pizza"></i> Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại</small>
              </div>
            </details>`;
          })
          .join("");
      } else {
        userInfoFooter.innerHTML =
          "<h5>Hiện tại bạn chưa có đơn hàng nào trong giỏ hàng. Hãy thêm món ăn vào giỏ để tiếp tục!</h5>";
      }
    });
  }
}
