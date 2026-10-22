import { Check } from 'lucide-react';
import '../auth.css';

const STEPS = [
  { title: 'Thông tin tổ chức', desc: 'Pháp nhân, tên miền & website' },
  { title: 'Thông tin liên hệ', desc: 'Người đại diện, chức vụ, email & số ĐT' },
  { title: 'Kiểm tra & Xác nhận', desc: 'Xem lại hồ sơ & cam kết' },
];

export function OrgStepper({ current }) {
  return (
    <ol className="org-stepper">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'active' : 'todo';
        return (
          <li key={s.title} className={`org-step is-${state}`} aria-current={state === 'active' ? 'step' : undefined}>
            <span className="org-step__dot">{state === 'done' ? <Check size={16} strokeWidth={2.5} /> : n}</span>
            <span className="org-step__text">
              <span className="org-step__title">{s.title}</span>
              <span className="org-step__desc">{s.desc}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Organization sign-up frame: step header card + form card. */
export default function OrgShell({ step, title, subtitle, children, onSubmit }) {
  return (
    <div className="org-page">
      <OrgStepper current={step} />
      <form className="org-card" onSubmit={onSubmit} noValidate>
        <header className="org-card__head">
          <h1 className="ui-h2 org-card__title">{title}</h1>
          <p className="ui-body-sm text-medium">{subtitle}</p>
        </header>
        {children}
      </form>
    </div>
  );
}
