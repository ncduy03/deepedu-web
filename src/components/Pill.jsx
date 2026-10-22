import './Pill.css';

/**
 * Gradient section badge ("Nền tảng AI của người Việt", "ĐỐI TÁC"...).
 * variant: brand (purple, default) | inverted (on dark purple) | brand-on-white (white halo, partners)
 * size: sm = Label large 12/18, md = Body small 14/20
 */
export function Badge({ children, variant = 'brand', size = 'sm', weight = 700 }) {
  return (
    <span className={`badge badge--${variant}`}>
      <span className={`badge__inner badge__inner--${size}`} style={{ fontWeight: weight }}>
        {children}
      </span>
    </span>
  );
}

/** Gray pill label ("Chủ quyền dữ liệu", "01- Tầng Foundation"...). */
export function Tag({ children, className = '' }) {
  return <span className={`tag ${className}`}>{children}</span>;
}
