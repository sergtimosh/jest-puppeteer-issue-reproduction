
let ENVIRONMENT = process.env.ENV //introduce env variable for environments
let LANGUAGE = process.env.LANG //introduce env variable for languages

export const ENVIRONMENTS = {
    STAGING: 'https://staging.priority-connect.online/pay/payments/devel/',
    DEV: 'https://dk8s.priority-software.com/pay/payments/devel/',
    PROD: 'https://priority-connect.online/pay/payments/prusdm1/'
}

export const LANG_PARAMETER = {
    HEBREW: 1,
    ENGLISH: 3
}

export let ENV_CONFIG = {
    URL: String,
    LANG_CODE: Number,
}

switch (ENVIRONMENT) {
    case 'STAGING':
        ENV_CONFIG.URL = ENVIRONMENTS.STAGING;
        selectLang();
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    case 'DEV':
        ENV_CONFIG.URL = ENVIRONMENTS.DEV;
        selectLang();
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    case 'PROD':
        ENV_CONFIG.URL = ENVIRONMENTS.PROD;
        selectLang();
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    default:
        ENV_CONFIG.URL = ENVIRONMENTS.STAGING;
        selectLang();
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;
}

async function selectLang() {
    if (LANGUAGE === 'HEB') {
        ENV_CONFIG.LANG_CODE = LANG_PARAMETER.HEBREW
    } else if (LANGUAGE === 'ENG') {
        ENV_CONFIG.LANG_CODE = LANG_PARAMETER.ENGLISH
    }
    ENV_CONFIG.LANG_CODE = LANG_PARAMETER.ENGLISH
}
