export function ToastMessage() {
  const btnCart = document.querySelectorAll(".btn-toast_msg");
  btnCart.forEach((btn) => {
    const toastLiveExample = document.getElementById("liveToast");

    if (btn) {
      const toastBootstrap =
        bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      btn.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }
  });
}
