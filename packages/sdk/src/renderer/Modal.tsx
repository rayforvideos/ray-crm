import type { ModalConfig } from '../types';

interface Props {
  config: ModalConfig;
  onDismiss: () => void;
  onClick: (url?: string) => void;
}

export function Modal({ config, onDismiss, onClick }: Props) {
  return (
    <div className="ray-crm-modal-overlay" onClick={onDismiss}>
      <div className="ray-crm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ray-crm-modal-close" onClick={onDismiss}>
          &times;
        </button>
        <div className="ray-crm-modal-title">{config.title}</div>
        {config.imageUrl && (
          <img className="ray-crm-modal-image" src={config.imageUrl} alt="" />
        )}
        <div className="ray-crm-modal-body">{config.body}</div>
        {config.buttons.length > 0 && (
          <div className="ray-crm-modal-buttons">
            {config.buttons.map((btn, i) => (
              <button
                key={i}
                className={`ray-crm-modal-btn ${i === 0 ? 'ray-crm-modal-btn--primary' : 'ray-crm-modal-btn--secondary'}`}
                onClick={() => onClick(btn.url)}
              >
                {btn.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
