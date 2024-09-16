import { getUsers } from "../api.js";
import { badgeNoticeCart } from "./badge_notice_cart.js";
import { Cart } from "./cart.js";
import { ToastMessage } from "./toast_message.js";

const customerName = document.querySelector("#cart .input-name");
const customerPhone = document.querySelector("#cart .input-phone");
const customerAddress = document.querySelector("#cart .input-address");
const customerHouse = document.querySelector("#cart .input-house_number");

const btnOrder = document.querySelector("#cart .btn-order");
const billInfo = document.querySelector("#cart .bill-infomation");
const closeBill = document.querySelector("#cart .btn-close-bill");

const btnOrderComplete = document.querySelector("#cart .btn-order-complete");

const cartDiv = document.querySelector("#cart");

// show order form
export function showOrderYourCart() {
  btnOrder.addEventListener("click", function () {
    checkInputValidity();
  });

  // close order
  closeBill.addEventListener("click", function () {
    billInfo.style.display = "none";
  });
}

// get information about the order
function getOrderInformation() {
  getCustomerInformation();
}

// get information about the customer
function getCustomerInformation() {
  const customerInfo = document.querySelector(
    ".bill-infomation .customer-infomation"
  );
  customerInfo.innerHTML = `
    <small class="customer-name">${customerName.value}</small>
    <small class="customer-phone">${customerPhone.value}</small>
    <small class="customer-address">
        ${customerHouse.value}, ${customerAddress.value}</small`;
}

// get information about the cart customer
function getFoodIsSelected() {
  const cartItems = document.querySelectorAll(".cart-list .cart-item");
  const foods = [];
  cartItems.forEach((item) => {
    if (item.querySelector(".check-item").checked) {
      foods.push({
        food_id: item.getAttribute("data-item"),
        name: item.querySelector(".cart-item .cart-info span").textContent,
        image: item.querySelector(".cart-item img").src,
        size: item.querySelector(".cart-item .cart-info .select-size").options[
          item.querySelector(".cart-item .cart-info .select-size").selectedIndex
        ].textContent,
        quantity: Number(
          item.querySelector(".quantity input[type='number']").value
        ),
        price: Number(
          item.querySelector(".cart-option .price").getAttribute("data-price")
        ),
      });
    }
  });

  const orderList = document.querySelector(".order-information .order-list");
  if (orderList) {
    orderList.innerHTML = foods
      .map((food) => {
        return `
        <div class="order-item d-flex align-items-center">
          <img
            src="${food.image}"
            alt="${food.name}"
          />
          <div
            class="order-detail text-end d-flex flex-column flex-grow-1"
          >
            <h5 class="order-name m-0">${food.name} <small class="fw-normal">(${
          food.size
        })</small></h5>
            <small class="order-quantity">x<span>${food.quantity}</span></small>
            <small class="order-price text-danger">${Number(
              food.price * food.quantity
            ).toLocaleString("vi-VN")}₫</small>
          </div>
        </div>`;
      })
      .join("");
  }

  const totalPrice = foods.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  const orderSummary = document.querySelector(".order-summary");
  orderSummary.innerHTML = `
      <summary class="d-flex justify-content-between text-dark fw-medium">
        Thành tiền <span>${Number(totalPrice + 15000).toLocaleString(
          "vi-VN"
        )}₫</span>
      </summary>
      <small class="order-total d-flex justify-content-between">
        Tổng tiền hàng <span>${Number(totalPrice).toLocaleString(
          "vi-VN"
        )}₫</span>
      </small>
      <small class="order-shipping d-flex justify-content-between">
        Phí vận chuyển <span>15.000₫</span>
      </small>
      <small class="order-voucher d-flex justify-content-between">
      Voucher <span>0₫</span></small>`;

  document.querySelector(".payment-reminder").textContent = `${Number(
    totalPrice + 15000
  ).toLocaleString("vi-VN")}₫`;

  const selectedRadio = document.querySelector('input[name="group1"]:checked');
  document.querySelector(".order-paymend").textContent =
    selectedRadio.nextElementSibling.textContent;

  sendOrderInfoToMail(foods);
}

// check input validity before sending
function checkInputValidity() {
  const isValidName = /^[\p{L}\s]+$/u.test(customerName.value);
  const isValidPhone = /^\d{10}$/.test(customerPhone.value);
  const isValidAddress = /^[\p{L}\p{N}\s,.-]+$/u.test(customerAddress.value);
  const isValidHouse = /^[\p{L}\p{N}\s-]+$/u.test(customerHouse.value);

  if (isValidName && isValidPhone && isValidAddress && isValidHouse) {
    const selectedCheckbox = document.querySelectorAll(
      'input[name="checkbox"]:checked'
    );
    if (selectedCheckbox.length > 0) {
      billInfo.style.display = "block";
      getOrderInformation();
      getFoodIsSelected();
    } else {
      alert("Please select food to order");
    }
  } else {
    alert("Please fill in the correct information");
    return false;
  }
}

// send to the email address
function sendOrderInfoToMail(foods) {
  btnOrderComplete.addEventListener("click", () => {
    updateBillUser(foods);
    // Email.send({
    //   Host: "smtp.elasticemail.com",
    //   Username: "hungpham671@gmail.com",
    //   Password: "A7702BB757B843ABC56C410C29A67D37E205",
    //   To: "hungpm671@gmail.com",
    //   From: "hungpm671@gmail.com",
    //   Subject: "✅ Đặt món thành công tại NoBuynostay!",
    //   Body: `
    //     <h2>Cảm ơn bạn đã đặt hàng!</h2>
    //     <p>Chúng tôi rất vui được thông báo rằng đơn hàng của bạn đã được xác nhận và đang được giao.</p>
    //     <p><strong>📞 Vui lòng để ý điện thoại của bạn</strong>, chúng tôi có thể liên hệ nếu cần thêm thông tin hoặc cập nhật về đơn hàng.</p>
    //     <p>Chúng tôi sẽ thông báo khi đơn hàng sẵn sàng để nhận.</p>
    //     <p>Trân trọng,<br>NoBuynostay</p>`,
    // }).then((message) => alert(message));
  });
}

function updateBillUser(foods) {
  getUsers().then((users) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userIndex = users.findIndex(
        (user) => user.user_id === JSON.parse(storedUser).user_id
      );

      if (userIndex) {
        const usersURL = `https://66cf273a901aab2484211ea3.mockapi.io/users/users/${
          Number(userIndex) + 1
        }`;

        const billUser = [
          ...users[userIndex].bill,
          {
            order_id: Date.now(),
            foods: foods.map((food) => {
              return {
                food_id: food.food_id,
                name: food.name,
                size: food.size,
                quantity: food.quantity,
                price: food.price,
                subtotal: food.price * food.quantity,
              };
            }),
            total_price:
              foods.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) +
              15000,
            phone: document.querySelector(".customer-phone").textContent,
            address: document.querySelector(".customer-address").textContent,
            payment_method:
              document.querySelector('input[name="group1"]:checked').value ===
              "option1"
                ? "credit_card"
                : "cod",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "pending",
          },
        ];

        const cartUser = users[userIndex].cart.filter(
          (item) => item.isChecked === false
        );

        axios
          .put(usersURL, {
            cart: cartUser,
            bill: billUser,
          })
          .then((response) => {
            badgeNoticeCart();
            Cart();
            showOrderYourCart();
            ToastMessage(
              "Order placed successfully",
              "Thank you for your order 😍"
            );
            cartDiv.style.display = "none";
            billInfo.style.display = "none";
          })
          .catch((error) => {
            console.error("Error updating cart:", error);
          });
      } else {
        alert("User not found");
      }
    }
  });
}
