import {
    IHttp,
    ILogger,
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
import { RocketConnectApp } from "../RocketConnectApp";
import { ShowCustomMessagesModal } from "../ui/ShowCustomMessagesModal";
import { ShowActiveChatModal } from "../ui/ActiveChatModal";

export class ActiveChatCommand implements ISlashCommand {

    public command = "ac"; // [1]
    public i18nParamsExample = "RocketConnect_Params_AC";
    public i18nDescription = "RocketConnect_Description_AC";
    public providesPreview = false;

    constructor(private readonly app: RocketConnectApp) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        // get trigger id and user
        const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender();
        const room = context.getRoom();
        // const block = modify.getCreator().getBlockBuilder();
        // get active chat data
        const { value: RocketConnectUrl } = await read
        .getEnvironmentReader()
        .getSettings()
        .getById(AppSetting.RocketConnectDefaultMessagesUrl);
        var url = new URL(
            path.join("active-chat"),
            RocketConnectUrl
          ).href;
        const active_chat_data = await http.get(url);
        var contextualbarBlocks = ShowActiveChatModal(modify, user, active_chat_data.data);
        await modify.getUiController().openContextualBarView(contextualbarBlocks, { triggerId }, user);
        
    }

}
