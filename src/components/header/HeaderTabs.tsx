import * as React from "react";

export function HeaderTabs() {
  return (
    <ul className="navbar-nav me-auto" data-header="mainMenu">
      <li className="nav-item active">
        <a
          className="nav-link"
          href="#ordino_dataset_tab"
          id="ordino_dataset_tab-tab"
          role="tab"
          aria-controls="ordino_dataset_tab"
          aria-selected="true"
        >
          Datasets
        </a>
      </li>
      <li className="nav-item ">
        <a
          className="nav-link"
          href="#ordino_sessions_tab"
          id="ordino_sessions_tab-tab"
          role="tab"
          aria-controls="ordino_sessions_tab"
          aria-selected="false"
        >
          Analysis Sessions
        </a>
      </li>
      <li className="nav-item ">
        <a
          className="nav-link"
          href="#ordino_tours_tab"
          id="ordino_tours_tab-tab"
          role="tab"
          aria-controls="ordino_tours_tab"
          aria-selected="false"
        >
          Onboarding Tours
        </a>
      </li>
    </ul>
  );
}
