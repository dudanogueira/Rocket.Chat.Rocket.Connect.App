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
import { UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { settings } from "./config/Settings";
import { DefaultMessagesCommand } from "./slashcommands/DefaultMessagesCommand";
import { ActiveChatCommand } from "./slashcommands/ActiveChatCommand";
import { ViewSubmitHandler } from "./handlers/ViewSumitHandler";

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
        const { actionId } = data;
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
}
