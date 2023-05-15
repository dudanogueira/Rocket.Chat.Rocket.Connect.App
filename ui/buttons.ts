import { IUIActionButtonDescriptor, RoomTypeFilter, UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";


export const buttons: Array<IUIActionButtonDescriptor> = [
    {
        actionId: 'active_chat_select_visitor_message',
        labelI18n: 'active_chat_message_button',
        context: UIActionButtonContext.MESSAGE_ACTION, 
    },
    {
        actionId: 'active_chat_select_visitor_room',
        labelI18n: 'active_chat_message_button',
        context: UIActionButtonContext.ROOM_ACTION, 
    },
    {
        actionId: 'active_chat_select_visitor_message_box',
        labelI18n: 'active_chat_message_button',
        context: UIActionButtonContext.MESSAGE_BOX_ACTION, 
    },
    {
        actionId: 'active_chat_select_visitor_room_sidebar',
        labelI18n: 'active_chat_message_button',
        context: UIActionButtonContext.ROOM_SIDEBAR_ACTION, 
    },
    {
        actionId: 'active_chat_select_visitor_user_dropdown',
        labelI18n: 'active_chat_message_button',
        context: UIActionButtonContext.USER_DROPDOWN_ACTION, 
    }


]