import { BlockElementType, ButtonStyle, IButtonElement, IPlainTextInputElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import {
    IHttpResponse,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { AppSetting } from '../config/Settings';

export function ShowCustomMessagesModal(modify: IModify, result: IHttpResponse): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

 
    if (result.data.length == 0) {
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(`Message not found`),
        })
    } else {
        var showing_message = `Showing *${result.data.length }* messages`
        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(showing_message),
        })
        blocks.addDividerBlock();
    }

    result.data.forEach(element => {

        blocks.addSectionBlock({
            text: blocks.newMarkdownTextObject(element["text"]),
            accessory: { // [5]
                type: BlockElementType.BUTTON,
                actionId: 'RocketConnectSelectDefaultMessage',
                text: blocks.newPlainTextObject(`Select ${element["slug"]}`),
                value: element["text"],
            },
        });
        blocks.addDividerBlock();
    });


    return { // [6]
        id: 'custommessages_bar',
        title: blocks.newPlainTextObject('Showing Custom Messages'),
        // submit: blocks.newButtonElement({
        //     text: {
        //         type: TextObjectType.PLAINTEXT,
        //         text: 'Search'
        //     }
        // }),
		close: blocks.newButtonElement({
			text: {
				type: TextObjectType.PLAINTEXT,
				text: 'Dismiss',
			},
		}),
        blocks: blocks.getBlocks(),
    };
}    