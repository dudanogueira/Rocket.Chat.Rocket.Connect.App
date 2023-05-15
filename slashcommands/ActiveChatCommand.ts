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
import { SelectVisitorModal } from "../ui/SelectVisitorModal";

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
        const [subcommand] = context.getArguments();
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
        if(!subcommand){
            var contextualbarBlocks = ShowActiveChatModal(modify, user, active_chat_data.data);
            await modify.getUiController().openContextualBarView(contextualbarBlocks, { triggerId }, user);
        }else{
            const term = context.getArguments().join(" ")
            this.app.getLogger().info("Searching for ", term, RocketConnectUrl);
            // TODO: Improve here the URL building to avoid user error on configuring
            var url_search = RocketConnectUrl + "active-chat/?term=" + term;
            console.log("AQUI!", url_search);
            const req = await http.get(url_search);
            if (!req){
                // TODO: answer when error on connection
                this.app.getLogger().error("Could not search for ", term, RocketConnectUrl, "connection status ");
                console.log("ERROR ON REQ")
            }
            console.log("REQ!!!! ", req.data);
            const visitors = req.data;
            console.log("VISITORS RESPONSE: ", visitors)
            const modal = await SelectVisitorModal(
                modify,
                term,
                visitors["visitors"],
                triggerId
            );
            await modify.getUiController().openModalView(modal, { triggerId }, user);
        }
    }

}
