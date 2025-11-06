import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/CustomListItem.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-icons/dist/add.js";

export function renderAccountListPage(container) {
  container.innerHTML = `
    <ui5-panel header-text="Accounts">
      <ui5-list id="account-list">
        <ui5-li-custom type="Navigation">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span>My Bank Account</span>
            <span>$1,234.56</span>
          </div>
        </ui5-li-custom>
        <ui5-li-custom type="Navigation">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span>My Credit Card</span>
            <span>-$567.89</span>
          </div>
        </ui5-li-custom>
      </ui5-list>
      <div style="display: flex; justify-content: flex-end; padding: 1rem;">
        <ui5-button id="btNew" icon="add">New</ui5-button>
      </div>
    </ui5-panel>
  `;
}
