const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
};

export const PORT = getEnv("PORT");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const BOX_DEV_TOKEN = getEnv("BOX_DEV_TOKEN")
export const BOX_CLIENT_ID = getEnv("BOX_CLIENT_ID")
export const BOX_CLIENT_SECRET = getEnv("BOX_CLIENT_SECRET")
