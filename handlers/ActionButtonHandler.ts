import {
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ButtonStyle,
    IUIKitResponse,
    TextObjectType,
    UIKitActionButtonInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { AppSetting } from "../config/Settings";
import { RocketConnectApp } from "../RocketConnectApp";
import { SelectVisitorModal } from "../ui/SelectVisitorModal";
import { SearchVisitorModal } from "../ui/SearchVisitorModal";

export class ActionButtonHandler {
    public async executor(
        app: RocketConnectApp,
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
        logger: ILogger
    ): Promise<IUIKitResponse> {
        const { buttonContext, actionId, triggerId, user, room, message } =
            context.getInteractionData();
        // Reacting to Buttons
        console.log("ACTION BUTTON", buttonContext);
        if (
            [
                "active_chat_select_visitor_message",
                "active_chat_select_visitor_room",
                "active_chat_select_visitor_message_box",
                "active_chat_select_visitor_room_sidebar",
                "active_chat_select_visitor_user_dropdown"
            ].includes(actionId)
        ) {
            var type = "contextual"
            if (actionId == "active_chat_select_visitor_user_dropdown"){
                var type = "modal"
            }
            var SearchVisitor_Modal = SearchVisitorModal(modify, triggerId, type);
            return context
                .getInteractionResponder()
                .openModalViewResponse(SearchVisitor_Modal);
        }

        return context.getInteractionResponder().successResponse();
    }
}
