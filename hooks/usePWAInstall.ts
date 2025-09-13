import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check initial state
    checkIfInstalled();

    // Listen for beforeinstallprompt event (Chrome/Edge/Samsung)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    // iOS doesn't support beforeinstallprompt, but we can still show instructions
    if (isIOSDevice && !isInstalled) {
      setIsInstallable(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for display mode changes
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkIfInstalled();
    
    if (displayModeQuery.addEventListener) {
      displayModeQuery.addEventListener('change', handleDisplayModeChange);
    } else {
      // Fallback for older browsers
      displayModeQuery.addListener(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      
      if (displayModeQuery.removeEventListener) {
        displayModeQuery.removeEventListener('change', handleDisplayModeChange);
      } else {
        displayModeQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!installPrompt) {
      // If iOS, show instructions
      if (isIOS) {
        return false; // Return false as we can't programmatically install on iOS
      }
      return false;
    }

    try {
      // Show the install prompt
      await installPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: "Install Raisa's Chinese Food",
        steps: [
          "Tap the share button",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to install"
        ],
        icon: "share" // You can use this to show the appropriate icon
      };
    }
    
    if (isAndroid) {
      return {
        title: "Install Raisa's Chinese Food",
        steps: [
          "Tap the menu button (three dots)",
          "Tap 'Install app' or 'Add to Home Screen'",
          "Follow the prompts to install"
        ],
        icon: "more-vertical"
      };
    }
    
    return {
      title: "Install Raisa's Chinese Food",
      steps: [
        "Click the install button in the address bar",
        "Or click 'Install' when prompted"
      ],
      icon: "download"
    };
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    install,
    installPrompt,
    getInstallInstructions,
  };
}