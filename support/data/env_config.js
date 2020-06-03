
let ENVIRONMENT = process.env.ENV

export let ENV_CONFIG = {
    URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/1',
        }
        break;

    case 'ENGLISH':
        ENV_CONFIG = {
            URL: 'https://staging.priority-connect.online/pay/payments/devel/3',
        }
        break;

    default:
        ENV_CONFIG
        break;
}