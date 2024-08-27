export function reviewStore() {
  let owl = $(".owl-carousel");
  owl.owlCarousel({
    items: 1,
    loop: true,
    dots: false,
    nav: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    autoplaySpeed: 1500,
    center: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      786: {
        margin: 0,
      },
      992: {
        items: 2,
        margin: 0,
      },
      1200: {
        items: 2,
        center: false,
        margin: 10,
      },
    },
  });
}
