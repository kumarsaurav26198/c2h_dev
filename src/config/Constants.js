import { Dimensions } from "react-native";

export const base_url = "http://c2h_v2_dev.demoproducts.in/";
export const api_url = "http://c2h_v2_dev.demoproducts.in/api/";
export const img_url = "http://c2h_v2_dev.demoproducts.in/uploads/";
export const chat_icon = img_url + "chat_icons/patient.png";
export const app_name = "Care2Home";

//Auth
export const customer_app_settings = "customer_app_setting";
export const customer_check_phone = "customer/check_phone";
export const customer_login = "customer/login";
export const customer_registration = "customer/register";
export const customer_forget_password = "customer/forget_password";
export const customer_reset_password = "customer/reset_password";

//Common
export const home = "customer/home";
export const get_payment_modes = "customer/get_payment_mode";
export const customer_add_address = "customer/add_address";
export const customer_update_address = "customer/update_address";
export const customer_get_address = "customer/all_addresses";
export const customer_edit_address = "customer/edit_address";
export const customer_delete_address = "customer/delete_address";
export const customer_last_active_address = "customer/get_last_active_address";
export const customer_get_faq = "get_faq";
export const customer_privacy_policy = "get_privacy_policy";
export const customer_get_profile = "customer/get_profile";
export const customer_profile_picture = "customer/profile_picture";
export const customer_profile_picture_update =
  "customer/profile_picture_update";
export const customer_profile_update = "customer/profile_update";
export const customer_get_blog = "customer/get_blog";
export const get_module_banners = "customer/get_module_banners";
export const customer_notification = "get_notifications";

//Doctor
export const get_doctor_categories = "customer/get_doctor_categories";
export const get_online_doctors = "customer/get_online_doctors";
export const get_nearest_doctors = "customer/get_nearest_doctors";
export const create_booking = "customer/create_booking";
export const get_booking_requests = "customer/get_booking_requests";
export const create_consultation = "customer/create_consultation";
export const consultation_list = "customer/get_consultation_requests";
export const consultation_details = "customer/get_consultation_details";
export const doctor_rating = "customer/doctor_rating";
export const hospital_rating = "customer/hospital_rating";
export const check_consultation = "doctor/check_consultation";
export const continue_consultation = "doctor/continue_consultation";
export const time_slots = "customer/get_time_slots";
export const consultation_time_slots = "customer/get_consultation_time_slots"; 
export const start_call = "customer/start_call";

//Pharmacy
export const show_vendor_list = "customer/vendor_list";
export const pharmacy_categories = "customer/vendor_category";
export const pharmacy_sub_categories = "customer/vendor_sub_category";
export const pharmacy_products = "customer/vendor_products";
export const check_promo_code = "customer/check_promo";
export const promo_code = "customer/get_promo";
export const other_charges = "customer/get_taxes";
export const create_pharmacy_order = "customer/pharmacy_order";
export const pharmacy_order_list = "customer/get_order_list";
export const pharmacy_order_details = "customer/get_order_detail";
export const order_rating = "customer/vendor_rating";
export const upload_prescription = "customer/upload_prescription";
export const get_prescription = "doctor/get_prescription";
export const upload_doctor_prescription = "customer/upload_doctor_prescription"; 

//Lab
export const customer_lab_list = "customer/lab_list";
export const customer_lab_detail = "customer/lab_detail";
export const customer_lab_packages = "customer/lab_packages";
export const customer_lab_package_details = "customer/lab_package_detail";
export const customer_lab_place_order = "customer/lab/place_order";
export const customer_lab_pending_orders = "customer/lab/get_lab_orders";
export const customer_lab_completed_orders =
  "customer/lab/get_completed_orders";
export const customer_lab_order_details = "customer/lab/get_order_detail";
export const customer_get_lab_promo = "customer/get_lab_promo";
export const customer_check_lab_promo = "customer/check_lab_promo";

//x-ray
export const customer_xray_list = "customer/get_xray_list";

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//Path
export const login_image = require(".././assets/img/login_image.png");
export const confirmed_icon = require(".././assets/img/check.png");
export const rejected_icon = require(".././assets/img/cancel.png");
export const waiting_icon = require(".././assets/img/time-left.png");
export const doctor = require(".././assets/img/doctor.jpg");
export const surgeon = require(".././assets/img/surgeon.jpg");
export const white_logo = require(".././assets/img/white_logo.png");
export const lab = require(".././assets/img/lab.png");
export const tablet = require(".././assets/img/tablet.png");
export const online_consult = require(".././assets/img/online_consult.png");
export const clinic = require(".././assets/img/clinic.png");
export const psychologist = require(".././assets/img/psychologist.png");
export const sexologist = require(".././assets/img/sexologist.png");
export const nutritionist = require(".././assets/img/nutritionist.png");
export const gynaecologist = require(".././assets/img/gynaecologist.png");
export const general_physician = require(".././assets/img/general_physician.png");
export const dermatologist = require(".././assets/img/dermatologist.png");
export const back_img = require(".././assets/img/back_img.png");
export const blood_pressure = require(".././assets/img/blood_pressure.png");
export const cough = require(".././assets/img/cough.png");
export const relation = require(".././assets/img/relation.png");
export const stress = require(".././assets/img/stress.png");
export const slim_body = require(".././assets/img/slim_body.png");
export const stomuch_ache = require(".././assets/img/stomuch_ache.png");
export const headache_img = require(".././assets/img/headache_img.png");
export const discount = require(".././assets/img/discount.png");
export const background_img = require(".././assets/img/background_img.jpg");
export const background = require(".././assets/img/background.png");
export const clock = require(".././assets/img/clock.png");
export const location = require(".././assets/img/location.png");
export const theme_gradient = require(".././assets/img/theme_gradient.png");
export const caller_image = require(".././assets/img/caller_image.jpeg");
export const home_banner5 = require(".././assets/img/home_banner5.webp");
export const home_banner6 = require(".././assets/img/home_banner6.webp");
export const home_banner7 = require(".././assets/img/home_banner7.webp");
export const home_banner8 = require(".././assets/img/home_banner8.webp");
export const promo_apply = require(".././assets/img/apply.png");
export const upload_path = require(".././assets/img/upload_icon.png");
export const add_reminder_icon = require(".././assets/img/add_reminder_icon.png");
export const today_reminder_icon = require(".././assets/img/today_reminder_icon.png");
export const my_reminder_icon = require(".././assets/img/my_reminder_icon.png");
export const success_reminder_icon = require(".././assets/img/success_reminder_icon.png");
export const failed_reminder_icon = require(".././assets/img/failed_reminder_icon.png");
export const login_entry_img = require(".././assets/img/login_entry_img.png");
export const wallet_imge = require(".././assets/img/wallet.png"); 

//lab path
export const correct = require(".././assets/lab/correct.png");
export const certified = require(".././assets/lab/certified.png");
export const offer_img = require(".././assets/lab/offer.png");
export const user_details_img = require(".././assets/lab/user.png");

//tmp Path
export const home_banner4 = require(".././assets/tmp/home_banner4.jpg");
export const home_banner1 = require(".././assets/tmp/home_banner1.jpg");
export const home_banner2 = require(".././assets/tmp/home_banner2.jpg");
export const home_banner3 = require(".././assets/tmp/home_banner3.jpg");
export const medicine = require(".././assets/tmp/medicine.jpg");
export const medicine_image = require(".././assets/tmp/medicine_image.png");
export const headache = require(".././assets/tmp/headache.png");
export const back = require(".././assets/tmp/back.png");
export const corona = require(".././assets/tmp/corona.png");
export const stomach = require(".././assets/tmp/stomach.png");
export const pregnant = require(".././assets/tmp/pregnant.png");
export const pediatrics = require(".././assets/tmp/pediatrics.png");
export const dermatology = require(".././assets/tmp/dermatology.png");
export const profile = require(".././assets/tmp/profile.png");
export const acne = require(".././assets/tmp/acne.png");
export const product_img = require(".././assets/tmp/product_img.jpg");
export const default_img = require(".././assets/tmp/default_img.jpg");
export const wallet = require(".././assets/tmp/wallet.png");
export const wallet_money = require(".././assets/tmp/wallet_money.png");
export const doctor_profile = require(".././assets/tmp/doctor_profile.jpg");
export const tablet_img = require(".././assets/tmp/tablet.png");

//json path
export const confirm_remainder = require(".././assets/json/confirm_remainder.json");

//Color Arrays
export const light_colors = [
  "#e6ffe6",
  "#f9f2ec",
  "#f9ecf2",
  "#ffe6ff",
  "#e6ffee",
  "#ffe6e6",
  "#ffffe6",
  "#ffe6e6",
  "#ffe6f9",
  "#ebfaeb",
  "#ffffe6",
  "#ffe6f0",
  "#fae6ff",
  "#e6ffe6",
  "#fff2e6",
  "#ffe6f0",
  "#e6ffee",
  "#a6abde",
];

//Lottie

//Font Family
export const light = "Metropolis-Light";
export const regular = "CheyenneSans-Regular";
export const bold = "Metropolis-Bold";

//Map
export const GOOGLE_KEY = "ENTER MAP KEY";
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;

//Util
export const month_name = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
