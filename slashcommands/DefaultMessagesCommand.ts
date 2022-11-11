import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";
import { AppSetting } from '../config/Settings';
export class DefaultMessagesCommand implements ISlashCommand {
    public command = 'messages'; // [1]
    public i18nParamsExample = 'RocketConnect_Params';
    public i18nDescription = 'RocketConnect_Description';
    public providesPreview = false;

    

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        // get trigger id and user
        // const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender()
        const room = context.getRoom()
        // const block = modify.getCreator().getBlockBuilder();
        const [subcommand, ...params] = context.getArguments()
        const { value: RocketConnectUrl } = await read.getEnvironmentReader().getSettings().getById(
            AppSetting.RocketConnectDefaultMessagesUrl
        )
        const response = await http.get(
            RocketConnectUrl + "?default_messages=1"
        )
        console.log(response)
        if (!subcommand) {

        } else {
            // try to get from response
            let message = response["data"][subcommand]
            if (message) {
                // message found
                const ReturnMessage = modify
                    .getCreator()
                    .startMessage()
                    .setRoom(room)
                    .setText(message);
                await modify.getCreator().finish(ReturnMessage);
            } else {
                // no message
                const builder = await modify.getCreator().startMessage().setRoom(room);
                const block = modify.getCreator().getBlockBuilder();
                block.addSectionBlock({
                    text: block.newPlainTextObject("Message not found! Choose from bellow 👇 ")
                });
                const elements: any[] = [];

                for (const [key, value] of Object.entries(response.data)) {
                    elements.push(
                        block.newButtonElement({
                            actionId: "RocketConnectSelectDefaultMessage",
                            text: block.newPlainTextObject(key),
                            value: value as string,
                            style: ButtonStyle.PRIMARY,
                        })
                    )
                }
                block.addActionsBlock({
                    blockId: "subreddits",
                    elements: elements
                });
                builder.setBlocks(block);
                await modify
                    .getNotifier()
                    .notifyUser(user, builder.getMessage());
            }
        }
    }
}