import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
    UIKitBlockInteractionContext,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { AppSetting, settings } from "./config/Settings";
import { DefaultMessagesCommand } from "./slashcommands/DefaultMessagesCommand";
import { ActiveChatCommand } from "./slashcommands/ActiveChatCommand";
import { ViewSubmitHandler } from "./handlers/ViewSumitHandler";
import { buttons } from "./ui/buttons";
import { ActionButtonHandler } from "./handlers/ActionButtonHandler";
import { ShowActiveChatModal } from "./ui/ActiveChatModal";

export class RocketConnectApp extends App {
    public appLogger: ILogger;
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger();
    }

    public async initialize(
        configurationExtend: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        await this.extendConfiguration(configurationExtend);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(
            new DefaultMessagesCommand(this)
        );
        configuration.slashCommands.provideSlashCommand(
            new ActiveChatCommand(this)
        );
        await Promise.all(
            settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            )
        );
        // Registering Action Buttons
        await Promise.all(
            buttons.map((button) => configuration.ui.registerButton(button))
        );
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const data = context.getInteractionData();
        const { room } = context.getInteractionData();
        const { user } = context.getInteractionData();
        const { actionId } = data;
        console.log("executeBlockActionHandler ", data);
        switch (actionId) {
            case "RocketConnectSelectDefaultMessage": {
                const messageSender = await modify
                    .getCreator()
                    .startMessage()
                    .setSender(data.user)
                    .setText(data.value as string);

                if (room) {
                    messageSender.setRoom(room);
                }

                await modify.getCreator().finish(messageSender);

                // should close the modal here

                return {
                    success: true,
                };
            }

            case "ActiveChatVisitorSelected": {
                const number = data["value"];
                // get active chat data
                const { value: RocketConnectUrl } = await read
                    .getEnvironmentReader()
                    .getSettings()
                    .getById(AppSetting.RocketConnectDefaultMessagesUrl);
                var url_data = RocketConnectUrl + "active-chat";
                const active_chat_data = await http.get(url_data);
                //console.log("AQUI!!!!! ", active_chat_data);
                const modal = ShowActiveChatModal(
                    modify,
                    user,
                    active_chat_data.data,
                    data.container.id,
                    number
                );
                return context
                    .getInteractionResponder()
                    .openModalViewResponse(modal);
            }
        }

        return {
            success: false,
        };
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        // same for View SubmitHandler, moving to another Class
        return new ViewSubmitHandler().executor(
            this,
            context,
            read,
            http,
            persistence,
            modify,
            this.getLogger()
        );
    }

    // register ActionButton Handler
    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        // lets just move this execution to another file to keep DemoApp.ts clean.
        return new ActionButtonHandler().executor(
            this,
            context,
            read,
            http,
            persistence,
            modify,
            this.getLogger()
        );
    }
}
