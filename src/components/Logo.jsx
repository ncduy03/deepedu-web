import './Logo.css';

// Insets (top right bottom left) of the 6 logo-mark pieces inside the square mark, from Figma "DeepEdu Logo".
const MARK_PIECES = [
  ['63.34%', '49.71%', '11.9%', '35.21%'],
  ['57.84%', '19.93%', '20.15%', '58.05%'],
  ['48.98%', '62.4%', '35.67%', '11.84%'],
  ['3.94%', '33.39%', '44.69%', '44.39%'],
  ['34.91%', '11.39%', '49.79%', '63.07%'],
  ['12.26%', '57.85%', '58.07%', '12.48%'],
];

// Same mark at 24px inside the footer social button (different padding in Figma).
const SOCIAL_PIECES = [
  ['65.44%', '49.06%', '12.5%', '37.49%'],
  ['60.53%', '22.53%', '19.85%', '57.85%'],
  ['52.64%', '60.38%', '33.68%', '16.67%'],
  ['12.5%', '34.53%', '41.72%', '45.68%'],
  ['40.1%', '14.91%', '46.27%', '62.32%'],
  ['19.91%', '56.32%', '53.65%', '17.23%'],
];

function Pieces({ pieces, src }) {
  return pieces.map(([t, r, b, l], i) => (
    <span key={i} className="logo-piece" style={{ inset: `${t} ${r} ${b} ${l}` }}>
      <img src={src(i)} alt="" />
    </span>
  ));
}

/** Logo mark only (square). `set` picks the exported asset folder: header | footer | vision. */
export function LogoMark({ set = 'header', size, className = '' }) {
  return (
    <span className={`logo-mark ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <Pieces pieces={MARK_PIECES} src={(i) => `/assets/logo/${set}/g${i}.svg`} />
    </span>
  );
}

export function SocialMark() {
  return (
    <span className="logo-mark" style={{ width: 24, height: 24 }} aria-hidden="true">
      <Pieces pieces={SOCIAL_PIECES} src={(i) => `/assets/footer/social-deepedu-g${i}.svg`} />
    </span>
  );
}

/** Full logo: mark + "DeepEdu" wordmark. Width/height ratio and text size follow the Figma component. */
export default function Logo({ set = 'header', height = 32.053 }) {
  return (
    <span className="logo" style={{ width: height * 3.7438, height, fontSize: height * 0.5937 }}>
      <span className="logo-image">
        <Pieces pieces={MARK_PIECES} src={(i) => `/assets/logo/${set}/g${i}.svg`} />
      </span>
      <span className="logo-text">DeepEdu</span>
    </span>
  );
}
