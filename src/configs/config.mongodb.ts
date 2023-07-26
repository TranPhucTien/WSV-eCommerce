import dotenv from "dotenv";

dotenv.config();

interface IEnvironmentConfig {
    app: {
        port: string | undefined
    },
    db: {
        host: string | undefined,
        port: string | undefined,
        name: string | undefined
    }
}

interface IConfig {
    dev: IEnvironmentConfig,
    pro: IEnvironmentConfig,

    [env: string]: IEnvironmentConfig
}

// level 3
const dev: IEnvironmentConfig = {
    app: {
        port: process.env.DEV_APP_PORT || "3052"
    },
    db: {
        host: process.env.DEV_DB_HOST || "0.0.0.0",
        port: process.env.DEV_DB_PORT || "27017",
        name: process.env.DEV_DB_NAME || "shopDEV"
    }
}

const pro: IEnvironmentConfig = {
    app: {
        port: process.env.PRO_APP_PORT || "252"
    },
    db: {
        host: process.env.PRO_DB_HOST || "0.0.0.0",
        port: process.env.PRO_DB_PORT || "27017",
        name: process.env.PRO_DB_NAME || "shopPRO"
    }
}

const config: IConfig = {dev, pro};
const env = process.env.NODE_ENV || 'dev'

export default config[env]