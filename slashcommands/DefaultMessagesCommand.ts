import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { URL } from "url";
import * as path from "path";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";
import { AppSetting } from "../config/Settings";
export class DefaultMessagesCommand implements ISlashCommand {
    public command = "m"; // [1]
    public i18nParamsExample = "RocketConnect_Params";
    public i18nDescription = "RocketConnect_Description";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        // get trigger id and user
        // const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender();
        const room = context.getRoom();
        // const block = modify.getCreator().getBlockBuilder();
        const subcommand = context.getArguments().join(" ");
        const { value: RocketConnectUrl } = await read
            .getEnvironmentReader()
            .getSettings()
            .getById(AppSetting.RocketConnectDefaultMessagesUrl);
        // base messages url
        var url = new URL(
            path.join("messages"),
            RocketConnectUrl
          ).href;
        // if subcommand, add term as s
        if (subcommand) {
            var url = new URL(
                "?term=" + subcommand,
                url
              ).href;
        }
        const messages = await http.get(url);
        if (messages.data) {
            await this.show_all_keywords(
                context,
                read,
                modify,
                messages,
                "Choose from bellow 👇"
            );
        }
    }

    public async show_all_keywords(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        messages: any,
        initial_text: string
    ) {
        const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender();
        const room = context.getRoom();
        // no message
        const builder = await modify
            .getCreator()
            .startMessage()
            .setRoom(room)
            .setSender(user);
        const block = modify.getCreator().getBlockBuilder();
        block.addSectionBlock({
            text: block.newPlainTextObject(initial_text),
        });
        const elements: any[] = [];

        messages.data.forEach((element) => {
            elements.push(
                block.newButtonElement({
                    actionId: "RocketConnectSelectDefaultMessage",
                    text: block.newPlainTextObject(element.slug),
                    value: element.text as string,
                    style: ButtonStyle.PRIMARY,
                })
            );
        });

        block.addActionsBlock({
            blockId: "subreddits",
            elements: elements,
        });
        builder.setBlocks(block);
        await modify.getNotifier().notifyUser(user, builder.getMessage());
    }
}
