import type { BannerConfig } from '../types';

interface Props {
  config: BannerConfig;
  onDismiss: () => void;
  onClick: (url?: string) => void;
}

export function Banner({ config, onDismiss, onClick }: Props) {
  return (
    <div
      className={`ray-crm-banner ray-crm-banner--${config.position}`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      <span
        style={{ cursor: config.linkUrl ? 'pointer' : 'default' }}
        onClick={() => config.linkUrl && onClick(config.linkUrl)}
      >
        {config.text}
      </span>
      {config.dismissible && (
        <button className="ray-crm-banner-close" onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
}
