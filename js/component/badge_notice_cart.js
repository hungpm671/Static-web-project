import { getUsers } from "../api.js";

export function badgeNoticeCart() {
  getUsers().then((users) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).user_id;
      const user = users.find((user) => user.user_id === userId);

      // Cart
      const badgeNotice = document.querySelectorAll(
        "#header .badge-notice-cart"
      );
      badgeNotice.forEach((badge) => {
        badge.textContent = user.cart.length;
      });

      // Pending
      const filterPending = user.bill.filter((item) => {
        return item.status === "pending" || item.status === "cancellation";
      });
      const badgeNoticePending = document.querySelector(
        ".user-options .badge-notice-pending"
      );
      badgeNoticePending.textContent = filterPending.length || 0;

      // Delivery
      const filterDelivery = user.bill.filter((item) => {
        return item.status === "success";
      });
      const badgeNoticeDelivery = document.querySelector(
        ".user-options .badge-notice-delivery"
      );
      badgeNoticeDelivery.textContent = filterDelivery.length || 0;
    }
  });
}
