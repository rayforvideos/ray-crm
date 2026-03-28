export interface RayCRMConfig {
  appKey: string;
  serverUrl: string;
}

export interface UserProperties {
  [key: string]: string | number | boolean | null;
}

export interface EventProperties {
  [key: string]: unknown;
}

export interface InappAction {
  type: 'inapp_toast' | 'inapp_modal' | 'inapp_banner';
  actionLogId: string;
  config: ToastConfig | ModalConfig | BannerConfig;
}

export interface ToastConfig {
  message: string;
  toastType: 'info' | 'success' | 'warning' | 'error';
  duration: number;
}

export interface ModalConfig {
  title: string;
  body: string;
  imageUrl?: string;
  buttons: Array<{ text: string; url?: string }>;
}

export interface BannerConfig {
  text: string;
  backgroundColor: string;
  linkUrl?: string;
  position: 'top' | 'bottom';
  dismissible: boolean;
}
