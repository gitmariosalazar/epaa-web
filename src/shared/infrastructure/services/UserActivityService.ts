/**
 * UserActivityService — Infrastructure service to track last user interaction.
 * Monitors events (mouse, keyboard, etc.) and exposes the last interaction timestamp.
 */

const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
  'click'
];

export class UserActivityService {
  private lastActivityTimestamp: number = Date.now();
  private boundHandler: () => void;

  constructor() {
    this.boundHandler = this.updateActivity.bind(this);
  }

  /**
   * Initializes event listeners on the global window object.
   */
  public init(): void {
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, this.boundHandler, { passive: true });
    });
  }

  /**
   * Removes event listeners from the global window object.
   */
  public cleanup(): void {
    ACTIVITY_EVENTS.forEach((event) => {
      window.removeEventListener(event, this.boundHandler);
    });
  }

  /**
   * Updates the internal timestamp with the current time.
   */
  private updateActivity(): void {
    this.lastActivityTimestamp = Date.now();
  }

  /**
   * Returns the timestamp (ms) of the last detected interaction.
   */
  public getLastActivity(): number {
    return this.lastActivityTimestamp;
  }

  /**
   * Convenience method to check if the user has been idle for more than `maxIdleMs`.
   */
  public isIdle(maxIdleMs: number): boolean {
    return Date.now() - this.lastActivityTimestamp > maxIdleMs;
  }
}

// Export a singleton instance
export const userActivityService = new UserActivityService();
