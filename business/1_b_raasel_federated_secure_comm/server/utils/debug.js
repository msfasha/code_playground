const DEBUG = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';

class DebugLogger {
  constructor(module) {
    this.module = module;
  }

  log(message, data = null) {
    if (DEBUG) {
      console.log(`[DEBUG][${this.module}] ${new Date().toISOString()}: ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  error(message, error = null) {
    if (DEBUG) {
      console.error(`[DEBUG][${this.module}] ${new Date().toISOString()}: ERROR - ${message}`);
      if (error) {
        console.error(error.stack || error);
      }
    }
  }

  warn(message, data = null) {
    if (DEBUG) {
      console.warn(`[DEBUG][${this.module}] ${new Date().toISOString()}: WARN - ${message}`);
      if (data) {
        console.warn(JSON.stringify(data, null, 2));
      }
    }
  }

  request(req, res, next) {
    if (DEBUG) {
      console.log(`[DEBUG][${this.module}] ${new Date().toISOString()}: ${req.method} ${req.url}`);
      console.log('Headers:', req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
      }
    }
    next();
  }
}

// Global debug function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
};

// Performance monitoring
const performance = {
  start: (label) => {
    if (DEBUG) {
      console.time(`[PERF] ${label}`);
    }
  },
  end: (label) => {
    if (DEBUG) {
      console.timeEnd(`[PERF] ${label}`);
    }
  }
};

module.exports = {
  DebugLogger,
  debugLog,
  performance,
  DEBUG
}; 