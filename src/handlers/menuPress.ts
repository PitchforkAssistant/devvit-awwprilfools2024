import {Context, MenuItemOnPressEvent} from "@devvit/public-api";
import {submitPostFormKey} from "../main.js";

export async function formActionPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(submitPostFormKey);
}
