
let ENVIRONMENT = process.env.ENV

export let ENV_CONFIG = {
    URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
    USERS: {
        USER_1: {
            NAME: 'QA',
            PASSWORD: '123456',
            EMAIL: 'qa.priority.erp@gmail.com',
            MAIL_PASSWORD: '123456Priority',
            EMAIL2: 'gmail-tester@titanium-labs.com',
            MAIL2_PASSWORD: 'prioritytitanium',
            MAIL_SERVER: 'QA',
            MAIL_SERVER2: 'QA2',
        },
    },

}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
            USERS: {
                USER_1: {
                    NAME: 'QA',
                    PASSWORD: '123456',
                    EMAIL: 'qa.priority.erp@gmail.com',
                    MAIL_PASSWORD: '123456Priority',
                    EMAIL2: 'gmail-tester@titanium-labs.com',
                    MAIL2_PASSWORD: 'prioritytitanium',
                    MAIL_SERVER: 'QA',
                    MAIL_SERVER2: 'QA2',
                },
            },
        
        }
        break;

    case 'ENGLISH':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
            USERS: {
                USER_1: {
                    NAME: 'QA',
                    PASSWORD: '123456',
                    EMAIL: 'qa.priority.erp@gmail.com',
                    MAIL_PASSWORD: '123456Priority',
                    EMAIL2: 'gmail-tester@titanium-labs.com',
                    MAIL2_PASSWORD: 'prioritytitanium',
                    MAIL_SERVER: 'QA',
                    MAIL_SERVER2: 'QA2',
                },
            },
        
        }
        break;

    default:
        break;
}