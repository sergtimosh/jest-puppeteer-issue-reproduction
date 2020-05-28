import { ENV_CONFIG } from "./env_config"

const firstUserName = ENV_CONFIG.USERS.USER_1.NAME

export const MODAL_MESSAGES = {
    CONCURRENT_EDIT_BY_SELF:
        'You are already revising this very same text in another window.   Revising the same text in two windows is likely to lead to loss of data.',

    CONCURRENT_EDIT_BY_USER_1:
        `This text is currently being revised by ${firstUserName}. The form will appear in read-only mode.`,

    LOGIN_ERROR:
        'Authorization failed. \nPlease check the username and password.',

    FILE_TYPE_ERROR:
        'This file type cannot be uploaded. Contact your system manager. File types permitted for upload can be modified in the \"Uploadable File Types\" form.',

    PASSWORD_ASSIGNED:
        'A new password has been assigned. Exit the system and reenter.',

    ADD_COMPANY:
        'This program takes a long time to complete. Please wait patiently under you receive a message indicating that it has ended successfully.',

    ADD_COMPANY_FINISHED:
        'The program has been successfully completed. Make sure that the data in the new company is backed up together with the data in the other companies. If necessary, revise the backup program.',

    DELETE_COMPANY_FINISHED:
        'The program has been successfully completed.',

    EXIT_FORM:
        'Exit Form',

    EXIT_FORM_DESIGN:
        'Do you want to exit without saving changes?'
}