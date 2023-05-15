import {
    BlockElementType,
    ButtonStyle,
    IButtonElement,
    IPlainTextInputElement,
    TextObjectType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitContextualBarViewParam, IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";

import {
    IHttpResponse,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { AppSetting } from "../config/Settings";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export function SelectVisitorModal(
    modify: IModify,
    term: string,
    visitors: any,
    triggerId?: string
): IUIKitModalViewParam {
    const blocks = modify.getCreator().getBlockBuilder();
    if (visitors.length == 0) {
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(`No visitors found. Try a new search`),
        })
        // TODO: Add here option do do search again
    } else {
        var showing_message = `Showing *${visitors.length }* visitors for term _${term}_`
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(showing_message),
        })
        blocks.addDividerBlock();
    }
    // TODO: Add last chat infos
    visitors.forEach(element => {
        console.log("element", element["phone"])
        blocks.addSectionBlock({    
            text: blocks.newPlainTextObject(`${element["name"]}: ${element["username"]}`),
            accessory: { // [5]
                type: BlockElementType.BUTTON,
                actionId: 'ActiveChatVisitorSelected',
                text: blocks.newPlainTextObject('Select'),
                value: element["phone"][0]["phoneNumber"],
            },
        });
        blocks.addDividerBlock();
    });    
    
    return {
        // [6]
        id: triggerId || "selectvisitor_bar",
        title: blocks.newPlainTextObject("Select Visitor to send Message"),
        close: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Dismiss",
            },
        }),
        blocks: blocks.getBlocks(),
    };
}
