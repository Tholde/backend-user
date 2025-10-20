// /src/utils/logger.ts

/**
 * Un simple logger pour les événements du serveur.
 */
const logger = {
    info: (message: string) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
        if (error) {
            console.error(error);
        }
    },
    warn: (message: string) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};

export default logger;