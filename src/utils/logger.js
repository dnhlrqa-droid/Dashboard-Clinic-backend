



const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const colorMap = {
  info: colors.blue,
  warn: colors.yellow,
  error: colors.red,
  debug: colors.cyan,
  success: colors.green,
};

const symbols= {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🐛',
  success: '✅',
};

const log = (level, message, data) => {
   const timestamp = new Date().toISOString();
   const color = colorMap[level];
   const symbol = symbols[level];

   if(process.env.NODE_ENV !== "production") {
    console.log(
        `${symbol} ${color}${message}${colors.reset}${data ? JSON.stringify(data) : ""}`
    );
   }
};


const logger = {
  info: (message, data) => {
     log("info", message, data);
  },

  warn: (message, data) => {
     log("warn", message, data);
  },

  error: (message, data) => {
     log("error", message, data);
  },

  debug: (message, data) => {
    if(process.env.DEBUG === "true" || process.env.NODE_ENV === "development") {
        log("debug", message, data);
    }
  },

  succss: (message, data) => {
     log("succss", message, data);
  },
};

module.exports = {
    logger,
};