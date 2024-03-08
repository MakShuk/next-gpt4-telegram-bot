import { Injectable } from '@nestjs/common';

import { Logger, ILogObj } from 'tslog';

@Injectable()
export class LoggerService {
  private logger: Logger<ILogObj>;

  constructor(name?: string) {
    this.logger = new Logger({
      hideLogPositionForProduction: true,
      type: 'pretty',
      name: name ? `[${name}]` : undefined,
    });
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }

  info(...args: unknown[]): void {
    this.logger.info(...args);
  }

  trace(...args: unknown[]): void {
    this.logger.trace(...args);
  }
}
