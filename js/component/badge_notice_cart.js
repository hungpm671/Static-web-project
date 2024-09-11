import { getUsers } from "../api.js";

export function badgeNoticeCart() {
  getUsers().then((users) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).user_id;
      const user = users.find((user) => user.user_id === userId);

      const badgeNotice = document.querySelectorAll(
        "#header .badge-notice-cart"
      );
      badgeNotice.forEach((badge) => {
        badge.textContent = user.cart.length;
      });
    }
  });
}
