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
import * as path from "path";
import { SelectVisitorModal } from "../ui/SelectVisitorModal";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

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
        const user = interaction_data.user as IUser;
        console.log("VIEW SUBMIT HANDLER", interaction_data);
        // prepare payload
        const { value: RocketConnectUrl } = await read
            .getEnvironmentReader()
            .getSettings()
            .getById(AppSetting.RocketConnectDefaultMessagesUrl);
        switch (interaction_data.view.id) {
            // this is the handler for searching visitor
            case "searchvisitor_bar": {
                // search visitor term
                var term =
                    interaction_data.view.state?.["active_chat_search_visitor"][
                        "name_or_number_option"
                    ];
                var type =
                    interaction_data.view.state?.["active_chat_search_visitor"][
                        "active_chat_select_type"
                    ];
                logger?.info("Searching for ", term, RocketConnectUrl);
                // TODO: Improve here the URL building to avoid user error on configuring
                var url_search = RocketConnectUrl + "active-chat/?term=" + term;
                console.log("AQUI!", url_search);
                const req = await http.get(url_search);
                if (!req) {
                    // TODO: answer when error on connection
                    logger?.error(
                        "Could not search for ",
                        term,
                        RocketConnectUrl,
                        "connection status "
                    );
                    console.log("ERROR ON REQ");
                }
                console.log("REQ!!!! ", req.data);
                const visitors = req.data;
                console.log("VISITORS RESPONSE: ", visitors);
                const modal = await SelectVisitorModal(
                    modify,
                    term,
                    visitors["visitors"],
                    interaction_data.triggerId
                );
                console.log("SELECT TYPE ", type);
                if (type == "contextual") {
                    await modify.getUiController().openContextualBarView(
                        modal,
                        {
                            triggerId: context.getInteractionData().triggerId,
                        },
                        context.getInteractionData().user
                    );
                } else {
                    await modify.getUiController().openModalView(
                        modal,
                        {
                            triggerId: context.getInteractionData().triggerId,
                        },
                        context.getInteractionData().user
                    );
                }
                return context.getInteractionResponder().successResponse();
            }

            // this is the handler for actually sending the message
            case "activechat_bar": {
                const adr = url.parse(RocketConnectUrl);
                // get connector token
                const connector_data =
                    interaction_data.view.state?.["active_chat_data"][
                        "connector_option"
                    ].split("#");
                const connector_external_token = connector_data[0];
                const connector_internal_token = connector_data[1];
                const payload_number =
                    interaction_data.view.state?.["active_chat_data"][
                        "number_option"
                    ];
                const payload_text =
                    interaction_data.view.state?.["active_chat_data"][
                        "text_option"
                    ];
                const payload_destination =
                    interaction_data.view.state?.["active_chat_data"][
                        "destination_option"
                    ];
                const connector_url =
                    adr["protocol"] +
                    adr["host"] +
                    "/connector/" +
                    connector_external_token;
                const send_active_chat = await http.post(connector_url, {
                    data: {
                        token: connector_internal_token,
                        text: `zapit ${payload_number}${payload_destination} ${payload_text}`,
                    },
                });
                // TODO: REACT ON ERROR
            }
        }

        return {
            success: true,
        };
    }
}
