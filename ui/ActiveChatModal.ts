import {
    BlockElementType,
    ButtonStyle,
    IButtonElement,
    IPlainTextInputElement,
    TextObjectType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitContextualBarViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";

import {
    IHttpResponse,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { AppSetting } from "../config/Settings";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export function ShowActiveChatModal(
    modify: IModify,
    user: IUser,
    active_chat_data?: any,
    viewId?: string,
    selected_number?: string
): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();
    const destination_options = active_chat_data.destinations.map((item) => ({
        text: blocks.newPlainTextObject(item.text),
        value: item.value,
    }));
    // if user is in destinations, set it as initial
    const hasUser = destination_options.some(
        (item) => item.value === `@${user.username}`
    );
    if (hasUser) {
        var initial_destination = `@${user.username}`;
    } else {
        var initial_destination = destination_options[0].value as string;
    }
    // prepend destination with ONLY SEND MESSAGE
    [{
        text: blocks.newPlainTextObject('DO NOT OPEN ROOM'),
        value:"",
    }].concat(destination_options)


    const connector_options = active_chat_data.connectors.map((item) => ({
        text: blocks.newPlainTextObject(item.name),
        value: item.external_token + "#" + item.config__active_chat_webhook_integration_token,
    }));
    var initial_connector = connector_options[0].value

    var initial_number = ''
    if(selected_number){
        var initial_number = selected_number
    }

    blocks.addInputBlock({
        blockId: "active_chat_data",
        optional: false,
        element: blocks.newPlainTextInputElement({
            placeholder: blocks.newPlainTextObject("Number"),
            actionId: "number_option",
            initialValue: initial_number,
        }),
        label: blocks.newPlainTextObject("Number"),
    });

    blocks.addInputBlock({
        blockId: "active_chat_data",
        optional: false,
        element: blocks.newPlainTextInputElement({
            multiline: true,
            placeholder: blocks.newPlainTextObject("Text"),
            actionId: "text_option",
            // initialValue: [answer_initialValue],
        }),
        label: blocks.newPlainTextObject("Text"),
    });

    blocks.addInputBlock({
        blockId: "active_chat_data",
        optional: false,
        element: blocks.newStaticSelectElement({
            placeholder: blocks.newPlainTextObject("Destination"),
            actionId: "destination_option",
            initialValue: initial_destination,
            options: destination_options,
        }),
        label: blocks.newPlainTextObject("Destination"),
    });

    blocks.addInputBlock({
        blockId: "active_chat_data",
        optional: false,
        element: blocks.newStaticSelectElement({
            placeholder: blocks.newPlainTextObject("Connector"),
            actionId: "connector_option",
            initialValue: initial_connector,
            options: connector_options,
        }),
        label: blocks.newPlainTextObject("Connector"),
    });

    return {
        // [6]
        id: "activechat_bar",
        title: blocks.newPlainTextObject("Send Active Chat"),
        submit: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Send",
            },
        }),
        close: blocks.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Dismiss",
            },
        }),
        blocks: blocks.getBlocks(),
    };
}
