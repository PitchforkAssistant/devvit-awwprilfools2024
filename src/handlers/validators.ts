import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {ERRORS} from "../constants.js";
import {cancelExistingJobs, startSingletonJob} from "devvit-helpers";

export async function validateFlairSharesPlaceholder (event: SettingsFormFieldValidatorEvent<string>) {
    if (!event.value) {
        return ERRORS.FLAIR_TEXT_EMPTY;
    }

    if (!event.value.includes("{{shares}}")) {
        return ERRORS.FLAIR_TEXT_NO_PLACEHOLDER;
    }
}

export async function validateDisableUpdates (event: SettingsFormFieldValidatorEvent<boolean>, context: Context) {
    if (event.value) {
        console.log("Disabling userFlairUpdater job");
        await cancelExistingJobs(context.scheduler, "userFlairUpdater");
        return;
    } else {
        console.log("Enabling userFlairUpdater job");
        await startSingletonJob(context.scheduler, "userFlairUpdater", "* * * * *", {});
    }
}
