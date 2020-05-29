let ENVIRONMENT = process.env.ENV
console.log(`environment - ${ENVIRONMENT}`)

export let ELEMENTS_TEXT = {

    WELCOME_CARD: {
        FIRST_HEADER: 'Welcome to',
        THIRD_HEADER: 'How would you like to connect?',
        SECTION_DIVIDER: 'or',
        MICROSOFT_BUTTON: 'With Office 365',
        GOOGLE_BUTTON: 'With Google',
        COMMON_SIGN_BUTTON: 'Sign in with your email',
    }
}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ELEMENTS_TEXT = {

            WELCOME_CARD: {
                FIRST_HEADER: 'ברוכים הבאים ל',
                THIRD_HEADER: 'אפשר להתחבר בכמה דרכים:',
                SECTION_DIVIDER: 'או',
                MICROSOFT_BUTTON: '',
                GOOGLE_BUTTON: '',
                COMMON_SIGN_BUTTON: '',
            }
        }
        break;

    case 'ENGLISH':
        ELEMENTS_TEXT = {
            WELCOME_CARD: {

                FIRST_HEADER: 'Welcome to',
                THIRD_HEADER: 'How would you like to connect?',
                SECTION_DIVIDER: 'or',
                MICROSOFT_BUTTON: 'With Office 365',
                GOOGLE_BUTTON: 'With Google',
                COMMON_SIGN_BUTTON: 'Sign in with your email',
            }
        }
        break;

    default:
        break;
}

