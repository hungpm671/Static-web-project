export function ToastMessage(
  title = "Success",
  message = "Cart updated successfully"
) {
  const btnCart = document.querySelectorAll(".btn-toast_msg");
  btnCart.forEach((btn) => {
    const toastLiveExample = document.getElementById("liveToast");

    const toastHeader = document.querySelector(".toast-header strong");
    toastHeader.textContent = title;

    const toastBody = document.querySelector(".toast-body");
    toastBody.textContent = message;

    if (btn) {
      const toastBootstrap =
        bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      btn.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }
  });
}
