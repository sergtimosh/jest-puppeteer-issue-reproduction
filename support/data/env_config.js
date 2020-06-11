
let ENVIRONMENT = process.env.ENV
export const ENVIRONMENTS = {
    HEBREW: 'https://staging.priority-connect.online/pay/payments/devel/1',
    ENGLISH: 'https://staging.priority-connect.online/pay/payments/devel/3'

}

export let ENV_CONFIG = {
    URL: ENVIRONMENTS.ENGLISH,
}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ENV_CONFIG = {
            URL: ENVIRONMENTS.HEBREW,
        }
        break;

    case 'ENGLISH':
        ENV_CONFIG = {
            URL: ENVIRONMENTS.ENGLISH,
        }
        break;

    default:
        ENV_CONFIG
        break;
}