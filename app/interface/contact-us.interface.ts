/** Every `contactIssue` the backend accepts. Values are case-sensitive. */
export const CONTACT_ISSUES = [
  "BUG",
  "FEATURE_REQUEST",
  "DATA_MISMATCH",
  "SHOUTOUT",
] as const;

export type ContactIssue = (typeof CONTACT_ISSUES)[number];

export const CONTACT_ISSUE_LABELS: Record<ContactIssue, string> = {
  BUG: "Bug",
  FEATURE_REQUEST: "Feature request",
  DATA_MISMATCH: "Data mismatch",
  SHOUTOUT: "Shoutout",
};

export function isContactIssue(value: unknown): value is ContactIssue {
  return CONTACT_ISSUES.includes(value as ContactIssue);
}

/** Messages per page in the admin list (the backend allows 1–100). */
export const CONTACT_US_PAGE_SIZE = 20;

/** A message from the app's Contact Us form. */
export interface ContactUsMessage {
  _id: string;
  contactIssue: ContactIssue;
  /** Up to 200 characters. */
  summary: string;
  /** Up to 5000 characters; may contain line breaks. */
  details: string;
  /** `null` when the sender's account has since been removed. */
  submittedBy: { _id: string; userName: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

/** `data` of `GET /contact-us`. */
export interface PaginatedContactUs {
  items: ContactUsMessage[];
  page: number;
  limit: number;
  /** Messages matching the filter, across all pages. */
  total: number;
  /** `0` when nothing matches. */
  totalPages: number;
  hasMore: boolean;
}

export interface ListContactUsParams {
  page?: number;
  limit?: number;
  contactIssue?: ContactIssue;
}
