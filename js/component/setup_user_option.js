import { btnFormValidation } from "./form_validation.js";

export function setItemLocalStorage(infoUser) {
  const user = {
    isLogin: true,
    user_id: infoUser.user_id,
    name: infoUser.name,
  };
  localStorage.setItem("user", JSON.stringify(user));
}
export function clearLocalStorage() {
  localStorage.clear();
}

export function Set_Up_UserOption() {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const jsonUser = JSON.parse(storedUser);
    if (jsonUser.isLogin) {
      dropdownToggle.innerHTML = `<i class="ph ph-user-circle fs-4"></i>
                  <span class="ms-1">${jsonUser.name}</span>`;

      dropdownMenu.innerHTML = `
            <li>
            <a class="dropdown-item d-flex align-items-center" href="#"
                ><i class="ph ph-info"></i>
                <span class="ms-2">Thông tin cá nhân</span>
            </a>
            </li>
            <li>
            <a class="dropdown-item d-flex align-items-center" href="#"
                ><i class="ph ph-basket"></i>
                <span class="ms-2">Giỏ hàng</span>
            </a>
            </li>
            <li>
            <a class="dropdown-item btn-logout d-flex align-items-center" href="#"
                ><i class="ph ph-sign-out"></i>
                <span class="ms-2">Đăng xuất</span>
            </a>
            </li>`;
    } else {
      dropdownToggle.innerHTML = `<i class="ph ph-user-circle fs-4"></i>
                  <span class="ms-1">Đăng nhập</span>`;

      dropdownMenu.innerHTML = `
            <li class="btn-sign-in">
            <a class="dropdown-item d-flex align-items-center" href="#"
                ><i class="ph ph-sign-in"></i>
                <span class="ms-2">Sign in</span>
            </a>
            </li>`;
    }
  } else {
    dropdownToggle.innerHTML = `<i class="ph ph-user-circle fs-4"></i>
        <span class="ms-1">Đăng nhập</span>`;

    dropdownMenu.innerHTML = `
        <li class="btn-sign-in">
        <a class="dropdown-item d-flex align-items-center" href="#"
        ><i class="ph ph-sign-in"></i>
        <span class="ms-2">Sign in</span>
        </a>
        </li>`;
  }
  btnFormValidation();
}
