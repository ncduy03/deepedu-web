import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Pill.jsx';
import { useCurrentUser } from '../state/useCurrentUser.js';
import { AUDIENCES, PRICING_INTRO, PRICING_PLANS } from './pricingPlans.js';
import EnterpriseContactDialog from './EnterpriseContactDialog.jsx';

const PLANS_PATH = '/tai-khoan/goi-dich-vu';

/** "Bảng giá" section: Tổ chức / Cá nhân toggle + plan cards. */
export default function Pricing() {
  const [audience, setAudience] = useState('org');
  const [contactOpen, setContactOpen] = useState(false);
  const user = useCurrentUser();
  const navigate = useNavigate();
  const plans = PRICING_PLANS[audience];

  const choose = (plan) => {
    if (plan.cta === 'contact') {
      setContactOpen(true);
      return;
    }
    // Signed-in visitors go straight to the plans page; others sign in first with the matching role.
    if (user) navigate(PLANS_PATH);
    else navigate('/dang-nhap', { state: { next: PLANS_PATH, role: audience } });
  };

  return (
    <section className="pricing" id="bang-gia">
      <div className="container pricing__inner">
        <div className="pricing__heading">
          <Badge variant="brand-on-white" size="md">
            BẢNG GIÁ
          </Badge>
          <h2 className="pricing__title">Gói dịch vụ linh hoạt</h2>
        </div>
        <p className="pricing__intro">{PRICING_INTRO[audience]}</p>

        <div className="pricing__toggle" role="tablist" aria-label="Đối tượng">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={audience === a.id}
              className={`pricing__toggle-btn${audience === a.id ? ' is-active' : ''}`}
              onClick={() => setAudience(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className={`pricing__cards pricing__cards--${plans.length}`}>
          {plans.map((plan) => (
            <article key={plan.name} className={`plan-card${plan.popular ? ' plan-card--popular' : ''}`}>
              <div className="plan-card__top">
                <div className="plan-card__name">
                  <h3>{plan.name}</h3>
                  {plan.popular && <span className="plan-card__badge">Phổ biến nhất</span>}
                </div>
                <p className="plan-card__desc">{plan.desc}</p>
              </div>
              <p className="plan-card__price">
                <strong>{plan.price}</strong>
                {plan.period && <span>{plan.period}</span>}
              </p>
              <button
                type="button"
                className={`btn btn--md plan-card__cta ${plan.popular ? 'btn--brand' : 'btn--brand-secondary'}`}
                onClick={() => choose(plan)}
              >
                {plan.cta === 'contact' ? 'Liên hệ tư vấn' : 'Đăng ký ngay'}
              </button>
              <hr className="plan-card__divider" />
              <div className="plan-card__features">
                <p className="plan-card__features-title">Bao gồm</p>
                <ul>
                  {plan.features.map((f, i) => (
                    <li key={f} className={i === 0 ? 'is-highlight' : undefined}>
                      <img src="/assets/landing-pricing/ic-check.svg" alt="" width="16" height="16" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {contactOpen && <EnterpriseContactDialog onClose={() => setContactOpen(false)} />}
    </section>
  );
}
