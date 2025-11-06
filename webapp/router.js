import { renderHomePage } from "./home.js";
import { renderAccountListPage } from "./account.js";
import { renderCategoryListPage } from "./category.js";
import { renderTransactionListPage } from "./transaction.js";

const routes = {
  "/": renderHomePage,
  "/accounts": renderAccountListPage,
  "/categories": renderCategoryListPage,
  "/transactions": renderTransactionListPage,
};

export function navigateTo(path) {
  const container = document.getElementById("app-content");
  const render = routes[path] || routes["/"]; // Fallback to home
  render(container);
}
