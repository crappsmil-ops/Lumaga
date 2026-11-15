import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const {
  appId,
  token,
  functionsVersion,
  appBaseUrl,
} = appParams;

if (!appId) {
  throw new Error(
    'VITE_BASE44_APP_ID fehlt. Base44 kann nicht initialisiert werden.'
  );
}

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl,
});