import winston from "winston";
const { createLogger, format, transports } = winston;
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.json()),
  transports: [
    // display in console
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export { logger };
