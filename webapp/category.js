import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-icons/dist/add.js";

export function renderCategoryListPage(container) {
  container.innerHTML = `
    <ui5-panel header-text="Categories">
      <ui5-list id="category-list">
        <ui5-li type="Navigation">Food</ui5-li>
        <ui5-li type="Navigation">Transportation</ui5-li>
        <ui5-li type="Navigation">Entertainment</ui5-li>
      </ui5-list>
      <div style="display: flex; justify-content: flex-end; padding: 1rem;">
        <ui5-button id="btNew" icon="add">New</ui5-button>
      </div>
    </ui5-panel>
  `;
}
