
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
        selectLang()
        ENV_CONFIG.URL = ENVIRONMENTS.STAGING
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    case 'DEV':
        selectLang()
        ENV_CONFIG.URL = ENVIRONMENTS.DEV
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    case 'PROD':
        selectLang()
        ENV_CONFIG.URL = ENVIRONMENTS.PROD
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;

    default:
        selectLang()
        ENV_CONFIG.URL = ENVIRONMENTS.STAGING;
        console.log(`environment url - ${ENV_CONFIG.URL + ENV_CONFIG.LANG_CODE}`)
        break;
}

function selectLang() {
    if (LANGUAGE === 'HEB') {
        ENV_CONFIG.LANG_CODE = LANG_PARAMETER.HEBREW
    } else if (LANGUAGE === 'ENG') {
        ENV_CONFIG.LANG_CODE = LANG_PARAMETER.ENGLISH
    }
    else ENV_CONFIG.LANG_CODE = LANG_PARAMETER.ENGLISH
}
