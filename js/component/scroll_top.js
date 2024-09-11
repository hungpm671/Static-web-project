export function scrollTop() {
  const btnTop = document.querySelector(".back-to-top");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 532) {
      btnTop.style.display = "block";
    } else {
      btnTop.style.display = "none";
    }
  });
}
