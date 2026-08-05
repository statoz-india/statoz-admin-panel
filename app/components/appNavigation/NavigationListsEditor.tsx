"use client";

import type {
  NavigationConfig,
  NavList,
} from "@/app/interface/app-navigation.interface";
import {
  MATCH_TAB_ENTRY,
  NAV_LIST_META,
  NAV_LISTS,
  SHOP_NAVBAR_ENTRY,
} from "@/app/interface/app-navigation.interface";
import OrderedListEditor from "./OrderedListEditor";

interface NavigationListsEditorProps {
  config: NavigationConfig;
  onChange: (config: NavigationConfig) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * The navigation lists. Edited together because the backend has no partial
 * update — every save sends all lists, whether default or override.
 */
export default function NavigationListsEditor({
  config,
  onChange,
  disabled = false,
  className = "grid gap-6 md:grid-cols-2",
}: NavigationListsEditorProps) {
  // The shop screen is reached through the navbar, so shop tabs are dead
  // config if SHOP isn't there. The backend doesn't check this.
  const shopUnreachable = !config.navbar.includes(SHOP_NAVBAR_ENTRY);
  // Matches tabs live under the MATCH main tab.
  const matchesUnreachable = !config.tabs.includes(MATCH_TAB_ENTRY);

  const warningFor = (field: NavList): string | null => {
    if (field === "shopTabs" && shopUnreachable) {
      return `${SHOP_NAVBAR_ENTRY} is not in the navbar, so the Shop screen is unreachable and these tabs will never render.`;
    }
    if (field === "matchesTabs" && matchesUnreachable) {
      return `${MATCH_TAB_ENTRY} is not in the main tabs, so these matches tabs will never render.`;
    }
    return null;
  };

  return (
    <div className={className}>
      {NAV_LISTS.map((field) => {
        const meta = NAV_LIST_META[field];
        return (
          <OrderedListEditor
            key={field}
            label={meta.label}
            hint={meta.hint}
            items={config[field]}
            onChange={(items) => onChange({ ...config, [field]: items })}
            suggestions={meta.suggestions}
            warning={warningFor(field)}
            placeholder={`Add to ${meta.label.toLowerCase()}`}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
}
