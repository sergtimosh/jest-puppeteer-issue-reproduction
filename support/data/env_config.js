
let ENVIRONMENT = process.env.ENV

export let ENV_CONFIG = {
    URL: 'https://us.priority-software.com/demus/PE04L/?_disableplugin=1&_emailverification=0',
    COMPANY_NAME: 'training company',
    COMPANY_SHORT_NAME: 'aqa',
    PRIVILEGE_GRP_LEADER: 'tabula',
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

        USER_2: {
            NAME: 'QA2',
            PASSWORD: '123456',
            EMAIL: 'avishay@priority-software.com'
        },
    },

    PARTS: {
        PART1: {
            NUMBER: 'TD_PART_001'
        },

        PART2: {
            NUMBER: 'TD_PART_002'
        },
    },

    CUSTOMERS: {
        CUSTOMER_1: {
            NUMBER: 'CTD_CUST_001',
        },
        CUSTOMER_2: {
            NUMBER: 'CTD_CUST_002',
        },
        CUSTOMER_3: {
            NUMBER: 'CTD_CUST_003',
        },
    }
}

switch (ENVIRONMENT) {
    case 'PROD':
        ENV_CONFIG = {
            URL: 'https://us.priority-software.com/demus/PE04L/?_disableplugin=1&_emailverification=0',
            COMPANY_NAME: 'training company',
            COMPANY_SHORT_NAME: 'aqa',
            PRIVILEGE_GRP_LEADER: 'tabula',
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

                USER_2: {
                    NAME: 'QA2',
                    PASSWORD: '123456',
                    EMAIL: 'avishay@priority-software.com'
                },

                PARTS: {
                    PART1: {
                        NUMBER: 'TD_PART_001'
                    },

                    PART2: {
                        NUMBER: 'TD_PART_002'
                    },
                }
            }
        }
        break;

    case 'DEV':
        ENV_CONFIG = {
            URL: 'https://us.priority-software.com/demus/PE04L/?_disableplugin=1&_emailverification=0',
            COMPANY_NAME: 'training company',
            COMPANY_SHORT_NAME: 'aqa',
            PRIVILEGE_GRP_LEADER: 'tabula',
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

                USER_2: {
                    NAME: 'QA2',
                    PASSWORD: '123456',
                    EMAIL: 'avishay@priority-software.com'
                },

                PARTS: {
                    PART1: {
                        NUMBER: 'TD_PART_001'
                    },

                    PART2: {
                        NUMBER: 'TD_PART_002'
                    },
                },

                CUSTOMERS: {
                    CUSTOMER_1: {
                        NUMBER: 'CTD_CUST_001',
                    },
                    CUSTOMER_2: {
                        NUMBER: 'CTD_CUST_002',
                    },
                    CUSTOMER_3: {
                        NUMBER: 'CTD_CUST_003',
                    },
                }
            }
        }
        break;

    default:
        break;
}