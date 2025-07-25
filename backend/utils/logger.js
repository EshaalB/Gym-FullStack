const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = process.env.LOG_LEVEL || 'INFO';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    // Console output with colors
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[90m'  // Gray
    };
    
    const reset = '\x1b[0m';
    const coloredLevel = `${colors[level]}[${level}]${reset}`;
    
    console.log(`${coloredLevel} ${timestamp} - ${message}`, meta.stack ? `\n${meta.stack}` : '');
    
    return logEntry;
  }

  writeToFile(level, logEntry) {
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
  }

  log(level, message, meta = {}) {
    if (this.logLevels[level] <= this.logLevels[this.currentLevel]) {
      const logEntry = this.formatMessage(level, message, meta);
      this.writeToFile(level, logEntry);
      
      // Also write to general log file
      if (level !== 'DEBUG') {
        this.writeToFile('general', logEntry);
      }
    }
  }

  error(message, error = null, context = {}) {
    const meta = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : null
    };
    
    this.log('ERROR', message, meta);
  }

  warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }

  // Specific logging methods for different types of operations
  auth(action, userId, email, success = true, error = null) {
    const level = success ? 'INFO' : 'WARN';
    const message = `Auth ${action}: ${email} (ID: ${userId})`;
    const context = {
      category: 'authentication',
      action,
      userId,
      email,
      success,
      timestamp: new Date().toISOString()
    };
    
    if (error) {
      context.error = {
        name: error.name,
        message: error.message
      };
    }
    
    this.log(level, message, context);
  }

  api(method, path, statusCode, duration, userId = null, error = null) {
    const level = statusCode >= 400 ? 'ERROR' : statusCode >= 300 ? 'WARN' : 'INFO';
    const message = `${method} ${path} - ${statusCode} (${duration}ms)`;
    const context = {
      category: 'api',
      method,
      path,
      statusCode,
      duration,
      userId,
      timestamp: new Date().toISOString()
    };
    
    if (error) {
      context.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    
    this.log(level, message, context);
  }

  database(operation, query, success = true, duration = null, error = null) {
    const level = success ? 'DEBUG' : 'ERROR';
    const message = `DB ${operation}: ${success ? 'SUCCESS' : 'FAILED'}${duration ? ` (${duration}ms)` : ''}`;
    const context = {
      category: 'database',
      operation,
      query: query.length > 200 ? query.substring(0, 200) + '...' : query,
      success,
      duration,
      timestamp: new Date().toISOString()
    };
    
    if (error) {
      context.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    
    this.log(level, message, context);
  }

  business(action, details, userId = null, success = true, error = null) {
    const level = success ? 'INFO' : 'ERROR';
    const message = `Business Logic: ${action}`;
    const context = {
      category: 'business',
      action,
      details,
      userId,
      success,
      timestamp: new Date().toISOString()
    };
    
    if (error) {
      context.error = {
        name: error.name,
        message: error.message
      };
    }
    
    this.log(level, message, context);
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger; 