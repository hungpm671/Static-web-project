import { bannerCarousel } from "./component/carousel.js";
import { foodList, foodMenu } from "./component/food_infomation.js";
import { reviewStore } from "./component/review.js";
import { scrollTop } from "./component/scroll_top.js";
import { Sign_In } from "./component/sign_in.js";
import { Set_Up_UserOption } from "./component/setup_user_option.js";
import { Sign_Up } from "./component/sign_up.js";
import { ToastMessage } from "./component/toast_message.js";

function App() {
  bannerCarousel();
  foodMenu();
  foodList();
  reviewStore();
  scrollTop();
  Set_Up_UserOption();
  Sign_In();
  Sign_Up();
  ToastMessage();
}
App();
