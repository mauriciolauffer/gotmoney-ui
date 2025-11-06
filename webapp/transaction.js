import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-icons/dist/add.js";

export function renderTransactionListPage(container) {
  container.innerHTML = `
    <ui5-panel header-text="Transactions">
      <ui5-table>
        <ui5-table-column slot="columns">
          <span style="line-height: 1.4rem; font-weight: bold;">Description</span>
        </ui5-table-column>
        <ui5-table-column slot="columns" min-width="800">
          <span style="line-height: 1.4rem; font-weight: bold;">Due Date</span>
        </ui5-table-column>
        <ui5-table-column slot="columns" min-width="600" popin-text="Amount">
          <span style="line-height: 1.4rem; font-weight: bold;">Amount</span>
        </ui5-table-column>

        <ui5-table-row>
          <ui5-table-cell>Groceries</ui5-table-cell>
          <ui5-table-cell>2025-11-05</ui5-table-cell>
          <ui5-table-cell>$123.45</ui5-table-cell>
        </ui5-table-row>
        <ui5-table-row>
          <ui5-table-cell>Gas</ui5-table-cell>
          <ui5-table-cell>2025-11-04</ui5-table-cell>
          <ui5-table-cell>$56.78</ui5-table-cell>
        </ui5-table-row>
      </ui5-table>
      <div style="display: flex; justify-content: flex-end; padding: 1rem;">
        <ui5-button id="btNew" icon="add">New</ui5-button>
      </div>
    </ui5-panel>
  `;
}
