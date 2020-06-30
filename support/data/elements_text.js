
let LANGUAGE = process.env.LANG

export let ELEMENTS_TEXT = {
    WELCOME_CARD: {
        FIRST_HEADER: String,
        THIRD_HEADER: String,
        SECTION_DIVIDER: String,
        MICROSOFT_BUTTON: String,
        GOOGLE_BUTTON: String,
        COMMON_SIGN_BUTTON: String,
        DISCLAIMER_TERMS_LINK: String,
        DISCLAIMER_PRIVACY_LINK: String
    },

    SIGN_IN_CARD: {
        SECOND_HEADER: String,
        WRONG_CREDENTIALS_MESSAGE: String,
        SIGN_UP_LINK: String,
    },

    SIGN_UP_CARD: {
        SECOND_HEADER: String,
        EMAIL_EXIST_MESSAGE: String,
    },

    THANK_YOU_CARD: {
        FIRST_HEADER: String,
        SECOND_HEADER: String,
        THIRD_HEADER: String,
    },

    REGISTRATION_EMAIL: {
        SUBJECT: String,
    },

    RESET_PASWORD_EMAIL: {
        SUBJECT: String,
    },

    CARD_FIELDS_HINTS: {
        SHORT_PASSWORD: String,
        CONPROMISED_PASSWORD: String,
        PASSWORDS_NOT_MATCHING: String,
        PASSWORD_OK: String,
        INVALID_EMAIL: String,
    },

    FORGOT_PASSWORD_CARD: {
        FIRST_ROW: String,
        SECOND_ROW: String,
        CARD_TEXT: String,
    },

    FORGOT_PASSWORD_CONFIRMATION_CARD: {
        FIRST_ROW: String,
        THIRD_ROW: String,
    },

    RESET_PASSWORD_CARD: {
        FIRST_ROW: String,
        SECOND_ROW: String
    },

    RESET_PASSWORD_SUCCESS_CARD: {
        FIRST_ROW: String,
        SECOND_ROW: String
    }
}

export const HEBREW_TEXT = {

    WELCOME_CARD: {
        FIRST_HEADER: 'ברוכים הבאים ל',
        THIRD_HEADER: 'אפשר להתחבר בכמה דרכים:',
        SECTION_DIVIDER: 'או',
        MICROSOFT_BUTTON: 'בעזרת אופיס 365',
        GOOGLE_BUTTON: 'בעזרת גוגל',
        COMMON_SIGN_BUTTON: 'התחברות עם כתובת הדוא\"ל שלך',
        DISCLAIMER_TERMS_LINK: 'מדיניות השימוש',
        DISCLAIMER_PRIVACY_LINK: 'מדיניות הפרטיות'
    },

    SIGN_IN_CARD: {
        SECOND_HEADER: 'התחברות עם כתובת הדוא\"ל שלך',
        WRONG_CREDENTIALS_MESSAGE: 'נראה שנפלה טעות בכתובת הדוא\"ל או בסיסמה.\nעוד ניסיון?',
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

    RESET_PASWORD_EMAIL: {
        SUBJECT: 'איפוס סיסמא',
    },

    CARD_FIELDS_HINTS: {
        SHORT_PASSWORD: 'הסיסמה קצרה מדי',
        CONPROMISED_PASSWORD: 'סיסמה זו נפרצה בעבר ואינה בטוחה',
        PASSWORDS_NOT_MATCHING: 'הסיסמאות לא תואמות',
        PASSWORD_OK: 'תקין',
        INVALID_EMAIL: 'כתובת הדוא\"ל לא תקינה',
    },
    
    FORGOT_PASSWORD_CARD: {
        FIRST_ROW: 'שכחת',
        SECOND_ROW: 'סיסמה?',
        CARD_TEXT: 'כדי לאפס את הסיסמה יש להזין את הדוא\"ל אליו קיבלת את ההזמנה או הדוא\"ל איתו נכנסת בעבר לאחד השירותים שלנו. לינק לאיפוס הסיסמה ישלח לכתובת הדוא\"ל שלך.'
    },

    FORGOT_PASSWORD_CONFIRMATION_CARD: {
        FIRST_ROW: 'מייל איפוס סיסמה\nנשלח ל:',
        THIRD_ROW: 'קישור לאיפוס סיסמה ישלח אליך בדקות הקרובות\nאנא בדוק את תיבת הדואר הנכנס.',
    },

    RESET_PASSWORD_CARD: {
        FIRST_ROW: 'איפוס',
        SECOND_ROW: 'סיסמה'
    },

    RESET_PASSWORD_SUCCESS_CARD: {
        FIRST_ROW: 'הסיסמה שלך',
        SECOND_ROW: 'שונתה בהצלחה :)'
    }
}

export const ENGLISH_TEXT = {
    WELCOME_CARD: {
        FIRST_HEADER: 'Welcome to',
        THIRD_HEADER: 'How would you like to connect?',
        SECTION_DIVIDER: 'or',
        MICROSOFT_BUTTON: 'With Office 365',
        GOOGLE_BUTTON: 'With Google',
        COMMON_SIGN_BUTTON: 'Sign in with your email',
        DISCLAIMER_TERMS_LINK: 'Terms of Use',
        DISCLAIMER_PRIVACY_LINK: 'Privacy Policy'
    },

    SIGN_IN_CARD: {
        SECOND_HEADER: 'Sign in with your email',
        WRONG_CREDENTIALS_MESSAGE: 'Looks like these are not the correct details.\nPlease try again.',
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

    RESET_PASWORD_EMAIL: {
        SUBJECT: 'reset password',
    },

    CARD_FIELDS_HINTS: {
        SHORT_PASSWORD: 'The password is too short',
        CONPROMISED_PASSWORD: 'This password was compromised in the past!',
        PASSWORDS_NOT_MATCHING: 'The passwords do not match',
        PASSWORD_OK: 'OK',
        INVALID_EMAIL: 'Enter a valid email address',
    },

    FORGOT_PASSWORD_CARD: {
        FIRST_ROW: 'Forgot your',
        SECOND_ROW: 'Password?',
        CARD_TEXT: 'To reset your password, enter the email address you use to login to Priority\'s services. A link will be emailed to this address which let you to reset your password.'
    },

    FORGOT_PASSWORD_CONFIRMATION_CARD: {
        FIRST_ROW: 'Reset password email\nwas sent to:',
        THIRD_ROW: 'The reset link will be sent to you in the next few minutes.\nPlease check your email.',
    },

    RESET_PASSWORD_CARD: {
        FIRST_ROW: 'Password',
        SECOND_ROW: 'Reset'
    },

    RESET_PASSWORD_SUCCESS_CARD: {
        FIRST_ROW: 'Your Password was',
        SECOND_ROW: 'Successfully changed :)'
    }
}

switch (LANGUAGE) {
    case 'HEB':
        ELEMENTS_TEXT = HEBREW_TEXT
        break;

    case 'ENG':
        ELEMENTS_TEXT = ENGLISH_TEXT
        break;

    default:
        ELEMENTS_TEXT = ENGLISH_TEXT
        break;
}

