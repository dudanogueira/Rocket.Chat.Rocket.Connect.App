import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    RocketConnectDefaultMessagesUrl = 'rocketconnect_default_messages_url',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.RocketConnectDefaultMessagesUrl,
        public: true,
        type: SettingType.STRING,
        value: "http://rocketconnect/server/SERVER_EXTERNAL_TOKEN/",
        packageValue: "http://rocketconnect/server/SERVER_EXTERNAL_TOKEN/",
        hidden: false,
        i18nLabel: 'RocketConnect_Default_Messages_URL',
        required: false,
    },    
    
]