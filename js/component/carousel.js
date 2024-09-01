export function bannerCarousel() {
  const emblaNode = document.querySelector(".embla");
  const options = { loop: true };
  const plugins = [EmblaCarouselAutoplay({ delay: 5000 })];
  const embla = EmblaCarousel(emblaNode, options, plugins);

  const dotsNode = document.querySelector(".embla__dots");
  const dotsArray = [];

  // Tạo dots cho carousel
  const generateDots = () => {
    embla.slideNodes().forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("embla__dot");
      dot.addEventListener("click", () => embla.scrollTo(index));
      dotsNode.appendChild(dot);
      dotsArray.push(dot);
    });
  };

  // Cập nhật trạng thái của dots
  const updateDots = () => {
    const selectedIndex = embla.selectedScrollSnap();
    dotsArray.forEach((dot, index) => {
      dot.classList.toggle("is-selected", index === selectedIndex);
    });
  };

  const pauseAutoplayOnClick = () => {
    embla.slideNodes().forEach((slide) => {
      slide.addEventListener("click", () => {
        plugins[0].stop(); // Dừng autoplay
        setTimeout(() => {
          plugins[0].play(); // Tiếp tục autoplay sau 5 giây
        }, 5000);
      });
    });
  };

  embla.on("select", updateDots);
  embla.on("init", () => {
    generateDots();
    updateDots();
    pauseAutoplayOnClick();
  });
}
