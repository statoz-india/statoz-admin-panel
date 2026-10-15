// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/components/Sidebar";
import { MatchBannerUrlWithCopy, MatchIdWithCopy } from "@/app/components/matches/MatchCopyChips";
import SeasonMultiSelect from "@/app/components/teams/SeasonMultiSelect";
import { SIDEBAR_MENU_ITEMS } from "@/app/utils/enums/section.enum";

describe("Sidebar", () => {
  const setup = (props: Partial<Parameters<typeof Sidebar>[0]> = {}) => {
    const handlers = { onSectionChange: vi.fn(), onLogout: vi.fn() };
    render(<Sidebar activeSection="users" {...handlers} {...props} />);
    return handlers;
  };

  it("lists every section in order", () => {
    setup();
    const labels = within(screen.getByRole("navigation")).getAllByRole("button").map((b) => b.textContent);
    expect(labels).toEqual(SIDEBAR_MENU_ITEMS.map((i) => i.label));
  });

  it("highlights the active section", () => {
    setup({ activeSection: "payments" });
    expect(screen.getByRole("button", { name: "Payments" }).className).toContain("bg-white");
    expect(screen.getByRole("button", { name: "Users" }).className).not.toContain("bg-white");
  });

  it("switches sections and logs out", async () => {
    const user = userEvent.setup();
    const { onSectionChange, onLogout } = setup();

    await user.click(screen.getByRole("button", { name: "Matches" }));
    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(onSectionChange).toHaveBeenCalledWith("matches");
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("disables logout while logging out", () => {
    setup({ isLoggingOut: true });
    expect(screen.getByRole("button", { name: "Logging out..." })).toBeDisabled();
  });
});

describe("SeasonMultiSelect", () => {
  it("adds a season from the dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SeasonMultiSelect value={["2026"]} onChange={onChange} options={["2026", "2026/27"]} />);

    // A chosen season isn't offered again.
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["-- Add a season --", "2026/27"]);
    await user.selectOptions(screen.getByRole("combobox", { name: "Add a season" }), "2026/27");

    expect(onChange).toHaveBeenCalledWith(["2026", "2026/27"]);
  });

  it("removes a season chip", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SeasonMultiSelect value={["2026", "2026/27"]} onChange={onChange} options={["2026", "2026/27"]} />);

    await user.click(screen.getByRole("button", { name: "Remove season 2026" }));

    expect(onChange).toHaveBeenCalledWith(["2026/27"]);
  });

  it("says when every season is taken or none is chosen", () => {
    const { rerender } = render(<SeasonMultiSelect value={["2026"]} onChange={vi.fn()} options={["2026"]} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("option").textContent).toBe("All available seasons added");

    rerender(<SeasonMultiSelect value={[]} onChange={vi.fn()} options={["2026"]} />);
    expect(screen.getByText(/No seasons/)).toBeInTheDocument();
  });

  it("locks everything when disabled", () => {
    render(<SeasonMultiSelect value={["2026"]} onChange={vi.fn()} options={["2026", "2027"]} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove season 2026" })).toBeDisabled();
  });
});

describe("copy chips", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  });
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("copies a match id and confirms", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<MatchIdWithCopy id="64b7f0c2a1b2c3d4e5f60718" />);

    await user.click(screen.getByRole("button", { name: "Copy id 64b7f0c2a1b2c3d4e5f60718" }));

    expect(writeText).toHaveBeenCalledWith("64b7f0c2a1b2c3d4e5f60718");
  });

  it("opens details from the id when clickable", async () => {
    const user = userEvent.setup();
    const onQuizClick = vi.fn();
    render(<MatchIdWithCopy id="m1" onQuizClick={onQuizClick} />);

    await user.click(screen.getByRole("button", { name: "m1" }));

    expect(onQuizClick).toHaveBeenCalledOnce();
  });

  it("shows a dash for a missing banner URL", () => {
    render(<MatchBannerUrlWithCopy url="   " />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("copies a trimmed banner URL", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<MatchBannerUrlWithCopy url="  https://img.test/banner.png " />);

    await user.click(screen.getByRole("button", { name: "Copy banner URL" }));

    expect(writeText).toHaveBeenCalledWith("https://img.test/banner.png");
  });
});

describe("Button", () => {
  it("renders variants and sizes as data attributes", () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button.className).toContain("bg-destructive");
  });

  it("renders its child instead with asChild", () => {
    render(
      <Button asChild>
        <a href="/x">Go</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("data-slot", "button");
  });
});
