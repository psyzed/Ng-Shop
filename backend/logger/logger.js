const path = require("path");
const { createLogger, transports, format } = require("winston");
const { combine, timestamp, printf } = format;

const productsRoutesErrorLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(
        __dirname,
        "./logs/productsRoutesLogs/productError.log"
      ),
      level: "error",
      format: combine(
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      timeZone: "Europe/Athens",
    }),
  ],
});

const categoriesRoutesErrorLogger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(
        __dirname,
        "./logs/categoriesRoutesLogs/categoriesError.log"
      ),
      level: "error",
      format: combine(
        timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      timeZone: "Europe/Athens",
    }),
  ],
});

module.exports = { productsRoutesErrorLogger, categoriesRoutesErrorLogger };
