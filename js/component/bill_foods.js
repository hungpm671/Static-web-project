export function showOrderYourCart() {
  const btnOrder = document.querySelector("#cart .btn-order");
  const billInfo = document.querySelector("#cart .bill-infomation");
  const closeBill = document.querySelector("#cart .btn-close-bill");

  btnOrder.addEventListener("click", function () {
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
  const customerName = document.querySelector("#cart .input-name");
  const customerPhone = document.querySelector("#cart .input-phone");
  const customerAddress = document.querySelector("#cart .input-address");
  const customerHouse = document.querySelector("#cart .input-house_number");

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
}
