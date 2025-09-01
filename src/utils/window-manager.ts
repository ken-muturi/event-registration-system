// Generic display manager for multi-screen content display

export interface DisplayData {
  htmlContent: string;
  windowTitle?: string;
}

declare global {
  interface Window {
    electronAPI?: {
      openDisplayWindow: (htmlContent: string, screenNumber?: number, title?: string) => Promise<void>;
      closeDisplayWindow: (screenNumber?: number) => Promise<void>;
      getAvailableScreens: () => Promise<number>;
      isDisplayOpen: (screenNumber?: number) => Promise<boolean>;
      toggleDisplay: (screenNumber?: number) => Promise<boolean>;
    };
  }
}

class DisplayManager {
  private static instance: DisplayManager;
  private displayWindows: Map<number, Window | null> = new Map();

  static getInstance(): DisplayManager {
    if (!DisplayManager.instance) {
      DisplayManager.instance = new DisplayManager();
    }
    return DisplayManager.instance;
  }

  /**
   * Opens content on specified screen
   * @param htmlContent - Complete HTML content to display
   * @param screenNumber - Target screen number (default: 2)
   * @param windowTitle - Optional window title
   */
  async openDisplay(
    htmlContent: string, 
    screenNumber: number = 2, 
    windowTitle: string = 'Display Window'
  ): Promise<void> {
    // Check if we're in Electron environment
    if (window.electronAPI) {
      await window.electronAPI.openDisplayWindow(htmlContent, screenNumber, windowTitle);
      return;
    }

    // Fallback for web browser
    await this.openDisplayInBrowser(htmlContent, screenNumber, windowTitle);
  }

  private async openDisplayInBrowser(
    htmlContent: string, 
    screenNumber: number, 
    windowTitle: string
  ): Promise<void> {
    const existingWindow = this.displayWindows.get(screenNumber);
    
    // If window exists and is not closed, update it
    if (existingWindow && !existingWindow.closed) {
      this.updateBrowserWindow(existingWindow, htmlContent);
      existingWindow.focus();
      return;
    }

    // Create new window if none exists
    const displayWindow = this.createBrowserWindow(screenNumber, windowTitle);
    
    if (displayWindow) {
      this.displayWindows.set(screenNumber, displayWindow);
      this.populateWindow(displayWindow, htmlContent);
      this.setupWindowBehavior(displayWindow, screenNumber);
    }
  }

  private createBrowserWindow(screenNumber: number, windowTitle: string): Window | null {
    const screenWidth = window.screen.width;
    const left = screenNumber === 2 ? screenWidth : 0;

    const windowFeatures = this.getWindowFeatures(screenWidth, left);
    return window.open('', `display-${screenNumber}`, windowFeatures);
  }

  private getWindowFeatures(screenWidth: number, left: number): string {
    return `
      width=${screenWidth},
      height=${window.screen.height},
      left=${left},
      top=0,
      scrollbars=no,
      resizable=no,
      toolbar=no,
      menubar=no,
      location=no,
      status=no,
      fullscreen=yes,
      directories=no,
      copyhistory=no
    `.replace(/\s/g, '');
  }

  private setupWindowBehavior(displayWindow: Window, screenNumber: number): void {
    // Attempt to make the window fullscreen
    setTimeout(() => {
      this.attemptFullscreen(displayWindow);
      displayWindow.focus();
    }, 500);
    
    // Handle window close to clean up reference
    displayWindow.addEventListener('beforeunload', () => {
      this.displayWindows.delete(screenNumber);
    });
  }

  private attemptFullscreen(displayWindow: Window): void {
    try {
      if (displayWindow.document?.documentElement) {
        const docEl = displayWindow.document.documentElement;
        
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {
            this.fallbackMaximize(displayWindow);
          });
        } else {
          this.fallbackMaximize(displayWindow);
        }
      }
    } catch (error) {
      console.log('Could not set fullscreen:', error);
    }
  }

  private fallbackMaximize(displayWindow: Window): void {
    displayWindow.moveTo(0, 0);
    displayWindow.resizeTo(window.screen.width, window.screen.height);
  }

  private updateBrowserWindow(displayWindow: Window, htmlContent: string): void {
    this.populateWindow(displayWindow, htmlContent);
  }

  private populateWindow(displayWindow: Window, htmlContent: string): void {
    displayWindow.document.documentElement.innerHTML = htmlContent;
  }

  /**
   * Closes display window on specified screen
   */
  async closeDisplay(screenNumber: number): Promise<void> {
    if (window.electronAPI) {
      await window.electronAPI.closeDisplayWindow(screenNumber);
      return;
    }

    const displayWindow = this.displayWindows.get(screenNumber);
    if (displayWindow && !displayWindow.closed) {
      displayWindow.close();
      this.displayWindows.delete(screenNumber);
    }
  }

  /**
   * Gets number of available screens
   */
  async getAvailableScreens(): Promise<number> {
    if (window.electronAPI) {
      return await window.electronAPI.getAvailableScreens();
    }
    
    // Fallback for browser - assume at least 2 screens if screen width is large
    return window.screen.width > 1920 ? 3 : 2;
  }

  /**
   * Checks if display is open on specified screen
   */
  async isDisplayOpen(screenNumber: number = 2): Promise<boolean> {
    if (window.electronAPI) {
      return await window.electronAPI.isDisplayOpen(screenNumber);
    }
    
    // Browser fallback
    const displayWindow = this.displayWindows.get(screenNumber);
    return displayWindow !== null && displayWindow !== undefined && !displayWindow.closed;
  }

  /**
   * Toggles display on specified screen
   * @param screenNumber - Screen number to toggle
   * @param readyHtml - Optional HTML to show when opening (defaults to generic ready message)
   * @returns Promise<boolean> - true if opened, false if closed
   */
  async toggleDisplay(
    screenNumber: number = 2, 
    readyHtml?: string
  ): Promise<boolean> {
    if (window.electronAPI) {
      return await window.electronAPI.toggleDisplay(screenNumber);
    }
    
    if (await this.isDisplayOpen(screenNumber)) {
      await this.closeDisplay(screenNumber);
      return false; // closed
    } else {
      const htmlContent = readyHtml || this.getDefaultReadyHtml();
      await this.openDisplay(htmlContent, screenNumber, 'Display Ready');
      return true; // opened
    }
  }

  private getDefaultReadyHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Display Ready</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .ready-container {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
    }
    .ready-message {
      font-size: clamp(32px, 4vw, 64px);
      line-height: 1.6;
      margin-bottom: 3vh;
      font-weight: 600;
    }
    .ready-subtitle {
      font-size: clamp(16px, 2vw, 32px);
      opacity: 0.9;
      font-weight: 400;
    }
  </style>
</head>
<body>
  <div class="ready-container">
    <div class="ready-message">Ready for Display</div>
    <div class="ready-subtitle">Click any content to show here</div>
  </div>
  <script>
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    window.focus();
  </script>
</body>
</html>`;
  }

  /**
   * Convenience method - alias for openDisplay for backward compatibility
   */
  async displayCustomHTML(
    htmlContent: string, 
    screenNumber: number = 2
  ): Promise<void> {
    await this.openDisplay(htmlContent, screenNumber);
  }

  /**
   * Convenience method for checking if display is open (synchronous browser version)
   */
  isDisplayOpenSync(screenNumber: number): boolean {
    const displayWindow = this.displayWindows.get(screenNumber);
    return displayWindow !== null && displayWindow !== undefined && !displayWindow.closed;
  }
}

export const displayManager = DisplayManager.getInstance();