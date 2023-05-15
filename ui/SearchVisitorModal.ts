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

export function SearchVisitorModal(
    modify: IModify,
    triggerId: string,
    type: string
): IUIKitModalViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    blocks.addInputBlock({
        blockId: "active_chat_search_visitor",
        optional: false,
        element: blocks.newPlainTextInputElement({
            placeholder: blocks.newPlainTextObject("Name or Number"),
            actionId: "name_or_number_option",
            // initialValue: [answer_initialValue],
        }),
        label: blocks.newPlainTextObject("Name or Number"),
    });
    blocks.addInputBlock({
        blockId: "active_chat_search_visitor",
        optional: false,
        element: blocks.newStaticSelectElement({
            placeholder: blocks.newPlainTextObject("Name or Number"),
            actionId: "active_chat_select_type",
            initialValue: type,
            options: [
                {
                    text: blocks.newPlainTextObject("Modal"),
                    value: "modal",
                },
                {
                    text: blocks.newPlainTextObject("Contextual Bar"),
                    value: "contextual",
                }
            ]
        }),
        label: blocks.newPlainTextObject("How to Select Visitor"),
    });    
    return {
        // [6]
        id: "searchvisitor_bar",
        
        title: blocks.newPlainTextObject("Search Visitor to send Message"),
        close: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Dismiss",
            },
        }),
        submit: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Search",
            },
        }),
        blocks: blocks.getBlocks(),
    };
}
