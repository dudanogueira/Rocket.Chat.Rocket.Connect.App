import {
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { RocketConnectApp } from "../RocketConnectApp";
import { AppSetting } from "../config/Settings";
var url = require("url");

export class ViewSubmitHandler {
    public async executor(
        app: RocketConnectApp,
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
        logger?: ILogger
    ) {
        const interaction_data = context.getInteractionData();
        if (interaction_data.view.id == "activechat_bar") {
            // prepare payload
            const { value: RocketConnectUrl } = await read
                .getEnvironmentReader()
                .getSettings()
                .getById(AppSetting.RocketConnectDefaultMessagesUrl);
            const adr = url.parse(RocketConnectUrl)
            // get connector token
            const connector_data = interaction_data.view.state?.["active_chat_data"]["connector_option"].split("#")
            const connector_external_token = connector_data[0]
            const connector_internal_token = connector_data[1]
            const payload_number = interaction_data.view.state?.["active_chat_data"]["number_option"]
            const payload_text = interaction_data.view.state?.["active_chat_data"]["text_option"]
            const payload_destination = interaction_data.view.state?.["active_chat_data"]["destination_option"]
            const connector_url = adr["protocol"] + adr["host"] + "/connector/" + connector_external_token
            console.log("TESTE!! ", interaction_data)
            const send_active_chat = await http.post(
                connector_url, {
                    data:{
                        "token": connector_internal_token,
                        "text": `zapit ${payload_number}${payload_destination} ${payload_text}`
                    }
                }
            );
            console.log("AQUI!!!", send_active_chat)
        }

        return {
            success: true,
        };
    }
}
