import { useId, useRef } from 'react';
import './ui.css';

/** Single-color SVG asset tinted with currentColor (CSS mask), so state colors can change it. */
export function MaskIcon({ src, size = 16, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`mask-icon ${className}`}
      style={{ width: size, height: size, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
    />
  );
}

/** Dark tooltip with an up arrow, shown under its child on hover / keyboard focus. */
export function Tooltip({ label, children, className = '' }) {
  return (
    <span className={`ui-tooltip ${className}`}>
      {children}
      <span className="ui-tooltip__bubble" role="tooltip">
        <img className="ui-tooltip__arrow" src="/assets/console/tooltip-arrow.svg" alt="" />
        <span className="ui-tooltip__text">{label}</span>
      </span>
    </span>
  );
}

/** White card with 24px radius used by every auth / sign-up step. */
export function AuthCard({ width = 520, className = '', children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`auth-card ${className}`} style={{ width }} {...rest}>
      {children}
    </Tag>
  );
}

export function Separator() {
  return <hr className="ui-separator" />;
}

/**
 * Labelled input. `required` adds a red asterisk (org forms); personal forms put "*" in the label text like Figma.
 * `leading` renders an icon or prefix inside the field.
 */
export function TextField({
  label,
  required,
  helper,
  error,
  leading,
  className = '',
  mono,
  as = 'input',
  children,
  ...inputProps
}) {
  const id = useId();
  const Control = as;
  const filled = inputProps.value !== undefined && String(inputProps.value).length > 0;
  return (
    <div className={`ui-field ${className}`}>
      {label && (
        <label className="ui-field__label" htmlFor={id}>
          {label}
          {required && <span className="ui-field__required"> *</span>}
        </label>
      )}
      <div
        className={`ui-field__control${filled ? ' is-filled' : ''}${error ? ' has-error' : ''}${
          as === 'select' ? ' is-select' : ''
        }`}
      >
        {leading && <span className="ui-field__leading">{leading}</span>}
        <Control
          id={id}
          className={`ui-field__input${mono ? ' is-mono' : ''}`}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        >
          {children}
        </Control>
      </div>
      {error ? <p className="ui-field__error">{error}</p> : helper && <p className="ui-field__helper">{helper}</p>}
    </div>
  );
}

export function Checkbox({ checked, onChange, children, className = '' }) {
  return (
    <label className={`ui-checkbox ${className}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-checkbox__box" aria-hidden="true">
        <img src="/assets/auth/ic-checkbox-check.svg" alt="" />
      </span>
      <span className="ui-checkbox__label">{children}</span>
    </label>
  );
}

/** 6-cell OTP input with auto-advance, backspace and paste support. */
export function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');
  const activeIndex = Math.min(value.length, length - 1);

  const setAt = (i, d) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join('').slice(0, length));
  };

  return (
    <div className="otp" onPaste={(e) => {
      const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (text) {
        e.preventDefault();
        onChange(text);
        refs.current[Math.min(text.length, length - 1)]?.focus();
      }
    }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className={`otp__cell${i === activeIndex && value.length < length ? ' is-active' : ''}`}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={i === 0}
          maxLength={1}
          value={d}
          aria-label={`Chữ số ${i + 1}`}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1);
            if (!v) return;
            setAt(i, v);
            if (i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (digits[i]) setAt(i, '');
              else if (i > 0) {
                setAt(i - 1, '');
                refs.current[i - 1]?.focus();
              }
            } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}

/**
 * Card link above the account row that switches between the assistant and the management console
 * (Figma "Switch button"). `tone="dark"` for the purple console sidebar, `"light"` for the assistant sidebar.
 */
export function SwitchSiteButton({ to, icon, label, tone = 'dark', component: Comp }) {
  return (
    <div className={`switch-site switch-site--${tone}`}>
      <Comp to={to} className="switch-site__btn">
        <span className="switch-site__icon">
          <MaskIcon src={icon} size={16} />
        </span>
        <span className="switch-site__label">{label}</span>
        <MaskIcon src="/assets/shared/ic-switch-arrow.svg" size={16} className="switch-site__arrow" />
      </Comp>
    </div>
  );
}
