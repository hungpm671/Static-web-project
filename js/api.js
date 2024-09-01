// Config Axios client
const users = axios.create({
  baseURL: "https://66cf273a901aab2484211ea3.mockapi.io/users/",
});
const foods = axios.create({
  baseURL: "https://66be374d74dfc195586ee7a3.mockapi.io/foods/",
});

// Users API
export async function getUsers() {
  const res = await users.get("users");
  return res.data;
}

// Foods API
export async function getFoods() {
  const res = await foods.get("product-list");
  return res.data;
}
