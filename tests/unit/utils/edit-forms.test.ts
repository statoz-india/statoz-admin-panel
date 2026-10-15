import { describe, expect, it } from "vitest";
import type { Event } from "@/app/models/events.model";
import type { FutureChoice } from "@/app/models/futures.model";
import {
  buildEditEventPayload,
  canEditEvent,
  eventToForm,
  validateEditEventForm,
  type EditEventDetailsForm,
} from "@/app/utils/event-edit";
import {
  buildEditChoicesPayload,
  canEditFutureChoices,
  choiceToFormRow,
  type EditChoiceFormRow,
} from "@/app/utils/future-choices";
import {
  buildEditFuturePayload,
  canEditFuture,
  convertToISTISO,
  isoToDatetimeLocal,
  validateEntryWindow,
} from "@/app/utils/future-edit";

describe("future-edit", () => {
  describe("canEditFuture", () => {
    it.each(["SETTLEMENT_DONE", "DELETED", "CANCELLED", " settlement_done ", "cancelled"])("locks %j", (status) => {
      expect(canEditFuture(status)).toBe(false);
    });

    it.each(["UPCOMING", "ACTIVE", "FINISHED", "WINNING_OPTION_UPDATED"])("allows %s", (status) => {
      expect(canEditFuture(status)).toBe(true);
    });
  });

  describe("convertToISTISO", () => {
    it("pins a datetime-local value to IST", () => {
      expect(convertToISTISO("2026-08-08T19:30")).toBe("2026-08-08T19:30:00.000+05:30");
    });

    it("leaves empty and date-only values alone", () => {
      expect(convertToISTISO("")).toBe("");
      expect(convertToISTISO("2026-08-08")).toBe("2026-08-08");
    });

    it("means the same instant as the IST wall-clock time", () => {
      expect(new Date(convertToISTISO("2026-08-08T19:30")).toISOString()).toBe("2026-08-08T14:00:00.000Z");
    });
  });

  describe("isoToDatetimeLocal", () => {
    it("shows an instant as IST wall-clock time", () => {
      expect(isoToDatetimeLocal("2026-08-08T14:00:00.000Z")).toBe("2026-08-08T19:30");
    });

    it("shows IST midnight as 00:00 of the next day", () => {
      expect(isoToDatetimeLocal("2026-08-08T18:30:00.000Z")).toBe("2026-08-09T00:00");
    });

    it("returns empty for missing or invalid input", () => {
      expect(isoToDatetimeLocal(undefined)).toBe("");
      expect(isoToDatetimeLocal("")).toBe("");
      expect(isoToDatetimeLocal("not a date")).toBe("");
    });

    it("round-trips with convertToISTISO", () => {
      const local = "2026-12-31T23:45";
      expect(isoToDatetimeLocal(convertToISTISO(local))).toBe(local);
    });
  });

  describe("validateEntryWindow", () => {
    it("requires both times", () => {
      expect(validateEntryWindow("", "2026-08-08T10:00")).toBe("Entry start and close times are required.");
      expect(validateEntryWindow("2026-08-08T10:00", "  ")).toBe("Entry start and close times are required.");
    });

    it("rejects unparseable times", () => {
      expect(validateEntryWindow("yesterdayT", "2026-08-08T10:00")).toBe("Invalid entry start or close time.");
    });

    it("requires close to be strictly after start", () => {
      expect(validateEntryWindow("2026-08-08T10:00", "2026-08-08T10:00")).toBe(
        "Entry close time must be after entry start time.",
      );
      expect(validateEntryWindow("2026-08-08T10:00", "2026-08-08T09:59")).toBe(
        "Entry close time must be after entry start time.",
      );
    });

    it("accepts a valid window", () => {
      expect(validateEntryWindow("2026-08-08T10:00", "2026-08-08T10:01")).toBeNull();
    });
  });

  describe("buildEditFuturePayload", () => {
    it("trims the name and converts the entry window to IST", () => {
      expect(
        buildEditFuturePayload({
          eventName: "  IPL 2026 Winner  ",
          eventDescription: " keep as is ",
          eventImage: "https://img/1.png",
          eventDescriptionImage: "",
          entryStartTime: "2026-03-01T10:00",
          entryCloseTime: "2026-05-30T19:30",
        }),
      ).toEqual({
        eventName: "IPL 2026 Winner",
        eventDescription: " keep as is ",
        eventImage: "https://img/1.png",
        eventDescriptionImage: "",
        entryStartTime: "2026-03-01T10:00:00.000+05:30",
        entryCloseTime: "2026-05-30T19:30:00.000+05:30",
      });
    });
  });
});

describe("future-choices", () => {
  const choice = (overrides: Partial<FutureChoice> = {}): FutureChoice => ({
    _id: "c1",
    choiceId: "CH1",
    choiceName: "CSK",
    choiceCoins: 100,
    initialCoinsOnChoice: 50,
    isVisible: true,
    odds: 2,
    createdAt: "",
    updatedAt: "",
    ...overrides,
  });

  it("follows the future's own edit lock", () => {
    expect(canEditFutureChoices("ACTIVE")).toBe(true);
    expect(canEditFutureChoices("SETTLEMENT_DONE")).toBe(false);
  });

  it("fills form defaults for missing optional fields", () => {
    expect(choiceToFormRow(choice({ isVisible: undefined as unknown as boolean }))).toEqual({
      _id: "c1",
      choiceName: "CSK",
      choiceDescription: "",
      choiceImage: "",
      initialCoinsOnChoice: 50,
      teamId: "",
      isVisible: true,
      placeholderColor: "",
      textColor: "",
    });
  });

  it("reads the linked team's id", () => {
    const row = choiceToFormRow(choice({ teamDetails: { _id: "team-9" } as FutureChoice["teamDetails"] }));
    expect(row.teamId).toBe("team-9");
  });

  const row = (overrides: Partial<EditChoiceFormRow> = {}): EditChoiceFormRow => ({
    _id: "c1",
    choiceName: "  CSK  ",
    choiceDescription: "",
    choiceImage: "",
    initialCoinsOnChoice: 50,
    teamId: "",
    isVisible: false,
    placeholderColor: "",
    textColor: "",
    ...overrides,
  });

  it("sends cleared text fields as empty strings and an unlinked team as null", () => {
    expect(buildEditChoicesPayload([row()])).toEqual([
      {
        _id: "c1",
        choiceName: "CSK",
        isVisible: false,
        choiceDescription: "",
        choiceImage: "",
        teamDetails: null,
        initialCoinsOnChoice: 50,
      },
    ]);
  });

  it("trims and sends filled fields", () => {
    const [payload] = buildEditChoicesPayload([
      row({
        choiceDescription: " Five-time champs ",
        choiceImage: " https://img/csk.png ",
        teamId: " team-9 ",
        placeholderColor: " #FFFF00 ",
        textColor: " #000 ",
      }),
    ]);
    expect(payload).toMatchObject({
      choiceDescription: "Five-time champs",
      choiceImage: "https://img/csk.png",
      teamDetails: "team-9",
      placeholderColor: "#FFFF00",
      textColor: "#000",
    });
  });

  it("omits a non-numeric coin value", () => {
    const [payload] = buildEditChoicesPayload([row({ initialCoinsOnChoice: Number.NaN })]);
    expect(payload).not.toHaveProperty("initialCoinsOnChoice");
  });

  it("keeps 0 coins", () => {
    expect(buildEditChoicesPayload([row({ initialCoinsOnChoice: 0 })])[0].initialCoinsOnChoice).toBe(0);
  });
});

describe("event-edit", () => {
  const event = (overrides: Partial<Event> = {}): Event =>
    ({
      _id: "e1",
      eventId: "EV1",
      tournament: "IPL",
      eventName: "Will it rain?",
      haveThreeOptions: false,
      yesPlaceholder: "Yes",
      noPlaceholder: "No",
      entryStartTime: "2026-08-08T04:30:00.000Z",
      entryCloseTime: "2026-08-08T14:00:00.000Z",
      eventStatus: "ACTIVE",
      ...overrides,
    }) as Event;

  it.each([
    ["SETTLEMENT_DONE", false],
    ["deleted", false],
    ["CANCELLED", false],
    ["ACTIVE", true],
    ["WINNING_OPTION_UPDATED", true],
  ])("canEditEvent(%s) → %s", (status, editable) => {
    expect(canEditEvent(status)).toBe(editable);
  });

  it("turns an event into form values with IST times", () => {
    expect(eventToForm(event())).toMatchObject({
      eventName: "Will it rain?",
      eventDescription: "",
      entryStartTime: "2026-08-08T10:00",
      entryCloseTime: "2026-08-08T19:30",
      yesPlaceholder: "Yes",
      noPlaceholder: "No",
      maybePlaceholder: "Maybe",
      yesPlaceholderColor: "",
    });
  });

  it("defaults missing labels", () => {
    const form = eventToForm(
      event({ yesPlaceholder: undefined, noPlaceholder: undefined, maybePlaceholder: null } as Partial<Event>),
    );
    expect([form.yesPlaceholder, form.noPlaceholder, form.maybePlaceholder]).toEqual(["Yes", "No", "Maybe"]);
  });

  const form = (overrides: Partial<EditEventDetailsForm> = {}): EditEventDetailsForm => ({
    eventName: " Rain? ",
    eventDescription: "desc",
    eventImage: "",
    eventDescriptionImage: "",
    entryStartTime: "2026-08-08T10:00",
    entryCloseTime: "2026-08-08T19:30",
    yesPlaceholder: " Yes ",
    noPlaceholder: " No ",
    maybePlaceholder: " Maybe ",
    yesPlaceholderColor: " ",
    noPlaceholderColor: "#f00",
    maybePlaceholderColor: "#0f0",
    yesTextColor: "",
    noTextColor: "",
    maybeTextColor: "#fff",
    ...overrides,
  });

  it("builds a two-option payload without the maybe fields", () => {
    const payload = buildEditEventPayload(form(), false);
    expect(payload).toEqual({
      eventName: "Rain?",
      eventDescription: "desc",
      eventImage: "",
      eventDescriptionImage: "",
      entryStartTime: "2026-08-08T10:00:00.000+05:30",
      entryCloseTime: "2026-08-08T19:30:00.000+05:30",
      yesPlaceholder: "Yes",
      noPlaceholder: "No",
      yesPlaceholderColor: undefined,
      noPlaceholderColor: "#f00",
      yesTextColor: undefined,
      noTextColor: undefined,
    });
    expect(payload).not.toHaveProperty("maybePlaceholder");
  });

  it("adds the maybe fields for three-option events", () => {
    expect(buildEditEventPayload(form(), true)).toMatchObject({
      maybePlaceholder: "Maybe",
      maybePlaceholderColor: "#0f0",
      maybeTextColor: "#fff",
    });
  });

  it.each([
    [{ eventName: "  " }, false, "Event name is required."],
    [{ yesPlaceholder: "" }, false, "Yes label is required."],
    [{ noPlaceholder: " " }, false, "No label is required."],
    [{ maybePlaceholder: "" }, true, "Maybe label is required for three-option events."],
    [{ entryCloseTime: "2026-08-08T09:00" }, false, "Entry close time must be after entry start time."],
  ])("rejects %j (three options: %s)", (overrides, three, message) => {
    expect(validateEditEventForm(form(overrides), three)).toBe(message);
  });

  it("doesn't need a maybe label for two-option events", () => {
    expect(validateEditEventForm(form({ maybePlaceholder: "" }), false)).toBeNull();
  });
});
