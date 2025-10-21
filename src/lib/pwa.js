let deferredPrompt;

export const whatsappNumbers = [
  '+2348121528693',
  '+2349034954069'
];

export function getRandomWhatsappNumber() {
  const index = Math.floor(Math.random() * whatsappNumbers.length);
  return whatsappNumbers[index];
}

// Initialize PWA hooks
export function initPWA() {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
  }
}

// Check if PWA is installable
export function canInstallPWA() {
  return !!deferredPrompt;
}

// Install PWA
export async function installPWA() {
  if (!deferredPrompt) return false;
  
  const result = await deferredPrompt.prompt();
  deferredPrompt = null;
  return true;
}