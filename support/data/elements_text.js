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
        DISCLAIMER_TERMS_LINK: 'Terms of Use,',
        DISCLAIMER_PRIVACY_LINK: 'Privacy Policy'
    },

    SIGN_IN_CARD: {
        SECOND_HEADER: 'Sign in with your email',
        WRONG_CREDENTIALS_MESSAGE: 'Looks like these are not the correct details. Please try again.'
    }
}

switch (ENVIRONMENT) {
    case 'HEBREW':
        ELEMENTS_TEXT = {
            WELCOME_CARD: {
                FIRST_HEADER: 'ברוכים הבאים ל',
                THIRD_HEADER: 'אפשר להתחבר בכמה דרכים:',
                SECTION_DIVIDER: 'או',
                MICROSOFT_BUTTON: 'בעזרת אופיס 365',
                GOOGLE_BUTTON: 'בעזרת גוגל',
                COMMON_SIGN_BUTTON: 'התחברות עם כתובת הדוא\"ל שלך',
                DISCLAIMER_TERMS_LINK: 'מדיניות השימוש,',
                DISCLAIMER_PRIVACY_LINK: 'מדיניות הפרטיות'
            },

            SIGN_IN_CARD: {
                SECOND_HEADER: 'התחברות עם כתובת הדוא\"ל שלך',
                WRONG_CREDENTIALS_MESSAGE: 'נראה שנפלה טעות בכתובת הדוא\"ל או בסיסמה. עוד ניסיון?'
            }
        }
        break;

    case 'ENGLISH':
        ELEMENTS_TEXT
        break;

    default:
        ELEMENTS_TEXT
        break;
}

