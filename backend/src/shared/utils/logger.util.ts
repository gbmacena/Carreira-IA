export class Logger {
  static info(context: string, message: string, data?: any): void {
    const logMessage = data
      ? `[${context}] ${message} - Data: ${JSON.stringify(data)}`
      : `[${context}] ${message}`;

    console.log(logMessage);
  }

  static error(context: string, message: string, error?: any): void {
    const logMessage = error
      ? `[${context}] ${message} - Error: ${error.message || error}`
      : `[${context}] ${message}`;

    console.error(logMessage);
  }

  static warn(context: string, message: string, data?: any): void {
    const logMessage = data
      ? `[${context}] ${message} - Data: ${JSON.stringify(data)}`
      : `[${context}] ${message}`;

    console.warn(logMessage);
  }
}
