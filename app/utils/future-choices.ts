import type {
  EditFutureChoiceBody,
  FutureChoice,
} from "@/app/models/futures.model";
import { canEditFuture } from "@/app/utils/future-edit";

export function canEditFutureChoices(futureStatus: string): boolean {
  return canEditFuture(futureStatus);
}

export type EditChoiceFormRow = {
  _id: string;
  choiceName: string;
  choiceDescription: string;
  choiceImage: string;
  initialCoinsOnChoice: number;
  teamId: string;
  isVisible: boolean;
  placeholderColor: string;
  textColor: string;
};

export function choiceToFormRow(choice: FutureChoice): EditChoiceFormRow {
  return {
    _id: choice._id,
    choiceName: choice.choiceName ?? "",
    choiceDescription: choice.choiceDescription ?? "",
    choiceImage: choice.choiceImage ?? "",
    initialCoinsOnChoice: choice.initialCoinsOnChoice ?? 0,
    teamId: choice.teamDetails?._id ?? "",
    isVisible: choice.isVisible ?? true,
    placeholderColor: choice.placeholderColor ?? "",
    textColor: choice.textColor ?? "",
  };
}

export function buildEditChoicesPayload(
  rows: EditChoiceFormRow[],
): EditFutureChoiceBody[] {
  return rows.map((c) => {
    const payload: EditFutureChoiceBody = {
      _id: c._id,
      choiceName: c.choiceName.trim(),
      isVisible: c.isVisible,
    };
    if (c.choiceDescription.trim()) {
      payload.choiceDescription = c.choiceDescription.trim();
    } else {
      payload.choiceDescription = "";
    }
    if (c.choiceImage.trim()) {
      payload.choiceImage = c.choiceImage.trim();
    } else {
      payload.choiceImage = "";
    }
    payload.teamDetails = c.teamId.trim() ? c.teamId.trim() : null;
    if (c.placeholderColor.trim()) {
      payload.placeholderColor = c.placeholderColor.trim();
    }
    if (c.textColor.trim()) {
      payload.textColor = c.textColor.trim();
    }
    if (Number.isFinite(c.initialCoinsOnChoice)) {
      payload.initialCoinsOnChoice = c.initialCoinsOnChoice;
    }
    return payload;
  });
}
