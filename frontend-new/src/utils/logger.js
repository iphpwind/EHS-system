import { ElMessage } from 'element-plus'

class Logger {
  constructor() {
    this.level = localStorage.getItem('log_level') || (import.meta.env.DEV ? 'debug' : 'info')
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    }
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level]
  }

  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
  }

  error(message, meta = {}) {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message, meta))
      this.sendToServer('error', message, meta)
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message, meta))
      this.sendToServer('warn', message, meta)
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog('info')) {
      console.info(this.format('info', message, meta))
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog('debug')) {
      console.log(this.format('debug', message, meta))
    }
  }

  async sendToServer(level, message, meta) {
    try {
      if (import.meta.env.PROD) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level, message, meta, timestamp: new Date().toISOString() })
        })
      }
    } catch (e) {
      console.error('Failed to send log to server:', e)
    }
  }

  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.level = level
      localStorage.setItem('log_level', level)
    }
  }
}

export const logger = new Logger()

export function createModuleLogger(module) {
  return {
    error: (message, meta) => logger.error(message, { module, ...meta }),
    warn: (message, meta) => logger.warn(message, { module, ...meta }),
    info: (message, meta) => logger.info(message, { module, ...meta }),
    debug: (message, meta) => logger.debug(message, { module, ...meta })
  }
}

export default logger