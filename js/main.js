import { bannerCarousel } from "./component/carousel.js";
import { foodList, foodMenu } from "./component/food_menu.js";
import { reviewStore } from "./component/review.js";
import { scrollTop } from "./component/scroll_top.js";
import { signIn } from "./component/sign_in_form.js";

function App() {
  bannerCarousel();
  foodMenu();
  foodList();
  reviewStore();
  signIn();
  scrollTop();
}
App();
