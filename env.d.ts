declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            MODE_ENV: "development" | "production";
            MONGO_URL: string;
            JWT_SECRET: string;
            SMTP_SECRET: string;
            SMTP_HOST: string;
            SMTP_PORT: string;
            SMTP_PASSWORD: string;
            BASE_URL: string;
            DB_NAME: string;
            USER_DB: string;
            PASS_DB: string
            PORT_DB: string;
        }
    }
}