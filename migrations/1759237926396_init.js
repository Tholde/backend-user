/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
      pgm.createTable("users", {
    id: "id", // auto-increment PK
    firstname: { type: "varchar(100)", notNull: true },
    lastname: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(150)", unique: true, notNull: true },
    password: { type: "varchar(255)", notNull: true },
    fonction: { type: "varchar(50)", default: "user", notNull: true },
    isActive: { type: "boolean", default: true },
    resetPasswordToken: { type: "varchar(255)", notNull: false },
    resetPasswordExpiresAt: { type: "timestamp", notNull: false },
    verificationToken: { type: "varchar(255)", notNull: false },
    verificationExpiresAt: { type: "timestamp", notNull: false },
    lastLogin: { type: "timestamp", notNull: false },
    createdAt: { type: "timestamp", default: pgm.func("current_timestamp") },
    updatedAt: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("users");
};
