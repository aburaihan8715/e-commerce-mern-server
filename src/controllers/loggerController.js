import winston from "winston";
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.json()),
  transports: [
    // display in file
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
      // maxsize: 5242880, // 5MB
      // maxFiles: 5,
    }),
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
      // maxsize: 5242880, // 5MB
      // maxFiles: 5,
    }),

    // display in console
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
  ],
});

export { logger };
