
let ENVIRONMENT = process.env.ENV

export let ENV_CONFIG = {
    URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
    MICROSOFT_LOGIN: {
        EMAIL: 'avishayd@priority-software.it',
        PASSWORD: 'Az345Cx!'
    },
    GMAIL_LOGIN: {
        EMAIL: 'gmail-tester@titanium-labs.com',
        PASSWORD: 'prioritytitanium'
    },
    EMAIL_LOGIN: {
        EMAIL: 'gmail-tester@titanium-labs.com',
        PASSWORD: '20autoauth20'
    },
}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/1',
            MICROSOFT_LOGIN: {
                EMAIL: 'avishayd@priority-software.it',
                PASSWORD: 'Az345Cx!'
            },
            GMAIL_LOGIN: {
                EMAIL: '',
                PASSWORD: ''
            },
            EMAIL_LOGIN: {
                EMAIL: '',
                PASSWORD: ''
            },
        }
        break;

    case 'ENGLISH':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
            MICROSOFT_LOGIN: {
                EMAIL: 'avishayd@priority-software.it',
                PASSWORD: 'Az345Cx!'
            },
            GMAIL_LOGIN: {
                EMAIL: '',
                PASSWORD: ''
            },
            EMAIL_LOGIN: {
                EMAIL: '',
                PASSWORD: ''
            },
        }
        break;

    default:
        break;
}