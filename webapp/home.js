import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents-icons/dist/person-placeholder.js";
import "@ui5/webcomponents-icons/dist/folder.js";
import "@ui5/webcomponents-icons/dist/tag.js";
import "@ui5/webcomponents-icons/dist/appointment.js";
import "@ui5/webcomponents-icons/dist/message-warning.js";
import "@ui5/webcomponents-icons/dist/bar-chart.js";

export function renderHomePage(container) {
  container.innerHTML = `
    <main class="sapUiUfdShellBG sapUiStrongBackgroundColor">
      <div class="sapUiResponsiveMargin">
        <h2>Home</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
          <ui5-card class="sapUiSmallMargin">
            <ui5-card-header slot="header" title-text="Profile"></ui5-card-header>
            <ui5-icon name="person-placeholder" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
          <ui5-card class="sapUiSmallMargin">
            <ui5-card-header slot="header" title-text="Account"></ui5-card-header>
            <ui5-icon name="folder" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
          <ui5-card class="sapUiSmallMargin">
            <ui5-card-header slot="header" title-text="Category"></ui5-card-header>
            <ui5-icon name="tag" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
          <ui5-card class="sapUiSmallMargin">
            <ui5-card-header slot="header" title-text="Transaction"></ui5-card-header>
            <ui5-icon name="appointment" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
          <ui5-card class="sapUiSmallMargin">
            <ui5-card-header slot="header" title-text="Overdue"></ui5-card-header>
            <ui5-icon name="message-warning" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
          <ui5-card class="sapUiSmallMargin" style="display:none;">
            <ui5-card-header slot="header" title-text="Report"></ui5-card-header>
            <ui5-icon name="bar-chart" style="width: 4rem; height: 4rem; margin: 1rem;"></ui5-icon>
          </ui5-card>
        </div>
      </div>
    </main>
  `;
}
