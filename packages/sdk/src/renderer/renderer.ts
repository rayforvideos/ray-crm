import { createRoot, type Root } from 'react-dom/client';
import { createElement } from 'react';
import type { InappAction, ToastConfig, ModalConfig, BannerConfig } from '../types';
import { Toast } from './Toast';
import { Modal } from './Modal';
import { Banner } from './Banner';

export class InappRenderer {
  private container: HTMLDivElement;
  private activeActions: Map<string, { wrapper: HTMLDivElement; root: Root }> = new Map();

  constructor() {
    const host = document.createElement('div');
    host.id = 'ray-crm-container';
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles();
    shadowRoot.appendChild(style);

    this.container = document.createElement('div');
    this.container.id = 'ray-crm-root';
    shadowRoot.appendChild(this.container);
  }

  render(action: InappAction, onFeedback: (actionLogId: string, status: 'clicked' | 'dismissed') => void) {
    const wrapper = document.createElement('div');
    this.container.appendChild(wrapper);
    const root = createRoot(wrapper);
    this.activeActions.set(action.actionLogId, { wrapper, root });

    const dismiss = () => {
      onFeedback(action.actionLogId, 'dismissed');
      root.unmount();
      wrapper.remove();
      this.activeActions.delete(action.actionLogId);
    };

    const click = (url?: string) => {
      onFeedback(action.actionLogId, 'clicked');
      if (url) window.open(url, '_blank');
      root.unmount();
      wrapper.remove();
      this.activeActions.delete(action.actionLogId);
    };

    switch (action.type) {
      case 'inapp_toast':
        root.render(createElement(Toast, {
          config: action.config as ToastConfig,
          onDismiss: dismiss,
        }));
        break;
      case 'inapp_modal':
        root.render(createElement(Modal, {
          config: action.config as ModalConfig,
          onDismiss: dismiss,
          onClick: click,
        }));
        break;
      case 'inapp_banner':
        root.render(createElement(Banner, {
          config: action.config as BannerConfig,
          onDismiss: dismiss,
          onClick: click,
        }));
        break;
    }
  }

  destroy() {
    for (const [, { wrapper, root }] of this.activeActions) {
      root.unmount();
      wrapper.remove();
    }
    this.activeActions.clear();
    const host = document.getElementById('ray-crm-container');
    host?.remove();
  }

  private getStyles(): string {
    return `
      #ray-crm-root {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .ray-crm-toast-container {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 99999;
      }
      .ray-crm-toast {
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        margin-bottom: 8px;
        animation: ray-crm-slide-in 0.3s ease-out;
        cursor: pointer;
        max-width: 360px;
      }
      .ray-crm-toast--info { background: #3b82f6; }
      .ray-crm-toast--success { background: #22c55e; }
      .ray-crm-toast--warning { background: #f59e0b; }
      .ray-crm-toast--error { background: #ef4444; }
      .ray-crm-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: ray-crm-fade-in 0.2s ease-out;
      }
      .ray-crm-modal {
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 480px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      }
      .ray-crm-modal-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
      .ray-crm-modal-body { font-size: 14px; color: #374151; margin-bottom: 16px; }
      .ray-crm-modal-image { width: 100%; border-radius: 8px; margin-bottom: 16px; }
      .ray-crm-modal-buttons { display: flex; gap: 8px; justify-content: flex-end; }
      .ray-crm-modal-btn {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }
      .ray-crm-modal-btn--primary { background: #3b82f6; color: white; }
      .ray-crm-modal-btn--secondary { background: #e5e7eb; color: #374151; }
      .ray-crm-modal-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9ca3af;
      }
      .ray-crm-banner {
        position: fixed;
        left: 0;
        right: 0;
        padding: 12px 20px;
        font-size: 14px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 99998;
        animation: ray-crm-slide-in 0.3s ease-out;
      }
      .ray-crm-banner--top { top: 0; }
      .ray-crm-banner--bottom { bottom: 0; }
      .ray-crm-banner-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 12px;
      }
      @keyframes ray-crm-slide-in {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes ray-crm-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
  }
}
