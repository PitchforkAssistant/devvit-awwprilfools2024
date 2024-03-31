import {SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {ERRORS} from "../constants.js";

export async function validateFlairSharesPlaceholder (event: SettingsFormFieldValidatorEvent<string>) {
    if (!event.value) {
        return ERRORS.FLAIR_TEXT_EMPTY;
    }

    if (!event.value.includes("{{shares}}")) {
        return ERRORS.FLAIR_TEXT_NO_PLACEHOLDER;
    }
}
