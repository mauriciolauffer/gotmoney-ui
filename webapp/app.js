import "@ui5/webcomponents/dist/ShellBar.js";
import "@ui5/webcomponents/dist/ShellBarItem.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/menu2.js";
import "@ui5/webcomponents-icons/dist/customer.js";
import "@ui5/webcomponents-icons/dist/leads.js";
import "@ui5/webcomponents-icons/dist/folder.js";
import "@ui5/webcomponents-icons/dist/tag.js";
import "@ui5/webcomponents-icons/dist/appointment.js";
import { navigateTo } from "./router.js";

const content = document.getElementById("content");

content.innerHTML = `
  <ui5-shellbar
    primary-title="GotMoney App"
    logo="./images/pig-32x32.png">
    <ui5-shellbar-item id="btIndex" icon="home" text="Home"></ui5-shellbar-item>
    <ui5-shellbar-item id="btAccounts" icon="folder" text="Accounts"></ui5-shellbar-item>
    <ui5-shellbar-item id="btCategories" icon="tag" text="Categories"></ui5-shellbar-item>
    <ui5-shellbar-item id="btTransactions" icon="appointment" text="Transactions"></ui5-shellbar-item>
    <ui5-shellbar-item id="btHome" icon="home" text="Home" style="display: none;"></ui5-shellbar-item>
    <ui5-shellbar-item id="btMenu" icon="menu2" text="Menu" style="display: none;"></ui5-shellbar-item>
    <ui5-shellbar-item id="btLogin" slot="startButton" icon="customer" text="Login"></ui5-shellbar-item>
    <ui5-shellbar-item id="btSignup" slot="startButton" icon="leads" text="Signup"></ui5-shellbar-item>
  </ui5-shellbar>
  <div id="app-content"></div>
`;

document.getElementById("btIndex").addEventListener("click", () => {
  navigateTo("/");
});

document.getElementById("btAccounts").addEventListener("click", () => {
  navigateTo("/accounts");
});

document.getElementById("btCategories").addEventListener("click", () => {
  navigateTo("/categories");
});

document.getElementById("btTransactions").addEventListener("click", () => {
  navigateTo("/transactions");
});

navigateTo("/");
