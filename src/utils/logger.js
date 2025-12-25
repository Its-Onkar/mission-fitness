/**
 * Enhanced logger utility
 * Supports both string messages and structured logging with objects
 */

function formatMessage(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${level}] ${timestamp}: ${message}`;
  
  if (data !== null && data !== undefined) {
    if (typeof data === 'object') {
      logMessage += '\n' + JSON.stringify(data, null, 2);
    } else {
      logMessage += ` ${data}`;
    }
  }
  
  return logMessage;
}

const logger = {
  info: (message, data = null) => {
    console.log(formatMessage('INFO', message, data));
  },
  
  error: (message, data = null) => {
    console.error(formatMessage('ERROR', message, data));
  },
  
  warn: (message, data = null) => {
    console.warn(formatMessage('WARN', message, data));
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('DEBUG', message, data));
    }
  },

  success: (message, data = null) => {
    console.log(formatMessage('SUCCESS', message, data));
  }
};

export default logger;

