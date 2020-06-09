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
        WRONG_CREDENTIALS_MESSAGE: 'Looks like these are not the correct details. Please try again.',
        SIGN_UP_LINK: 'Sign Up'
    },

    SIGN_UP_CARD: {
        SECOND_HEADER: 'Sign up with your email',
        EMAIL_EXIST_MESSAGE: 'An account with this email already exists'
    },

    THANK_YOU_CARD: {
        FIRST_HEADER: 'Thank you!',
        SECOND_HEADER: 'Confirm your Email',
        THIRD_HEADER: 'Please check your inbox for confirmation email. \nClick the link in the email to confirm your email address.',
    },

    REGISTRATION_EMAIL: {
        SUBJECT: 'Welcome to Priority Connect',
    },

    CARD_FIELDS_HINTS: {
        SHORT_PASSWORD: 'The password is too short',
        CONPROMISED_PASSWORD: 'This password was compromised in the past!',
        PASSWORDS_NOT_MATCHING: 'The passwords do not match',
        PASSWORD_OK: 'OK',
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
                WRONG_CREDENTIALS_MESSAGE: 'נראה שנפלה טעות בכתובת הדוא\"ל או בסיסמה. עוד ניסיון?',
                SIGN_UP_LINK: 'הרשמה'
            },

            SIGN_UP_CARD: {
                SECOND_HEADER: 'הרשמה עם כתובת דוא\"ל',
                EMAIL_EXIST_MESSAGE: 'חשבון עם כתובת הדוא\"ל הזו כבר קיים במערכת'
            },

            THANK_YOU_CARD: {
                FIRST_HEADER: 'תודה שנרשמת!',
                SECOND_HEADER: 'שלחנו לך מייל לאישור',
                THIRD_HEADER: 'נא לבדוק את תיבת הדוא"ל שלך, \nולאשר את הכתובת בלחיצה על הקישור שבמייל.',
            },

            REGISTRATION_EMAIL: {
                SUBJECT: 'Welcome to Priority Connect',
            },

            CARD_FIELDS_HINTS: {
                SHORT_PASSWORD: 'הסיסמה קצרה מדי',
                CONPROMISED_PASSWORD: 'סיסמה זו נפרצה בעבר ואינה בטוחה',
                PASSWORDS_NOT_MATCHING: 'הסיסמאות לא תואמות',
                PASSWORD_OK: 'תקין',
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

