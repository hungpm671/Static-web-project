import { getUsers } from "../api.js";
import { Set_Up_UserOption } from "./setup_user_option.js";

function userOption(users) {
  const userId = JSON.parse(localStorage.getItem("user")).user_id;
  const idUser = users.findIndex((user) => user.user_id === userId);

  renderUserInfo(users[idUser], idUser);
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
}

function editNameUser(idUser) {
  const inputName = document.querySelector(
    "#user-infomation input[type='text']"
  );
  const btnEditName = document.querySelector("#user-infomation .btn-edit-name");
  const userContainer = document.querySelector(
    "#user-infomation .user-info-container"
  );

  btnEditName.addEventListener("click", () => {
    inputName.disabled = false;
    inputName.focus();
  });

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

  userContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}
