import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  COMPARISON,
  CREDIT_USES,
  FAQ,
  PAYMENT_METHODS,
  PAYMENT_POLICIES,
  PRICING_PLANS,
  TOPUP_PACKS,
} from './pricingData.js';
import './Pricing.css';

const PICON = (name) => `/assets/pricing/${name}.svg`;
const money = (n) => `${n.toLocaleString('vi-VN')}đ`;
const ORDER = ['free', 'plus', 'pro'];
// "pro-year" is the yearly billing of Pro, so it shows on the Pro card.
const basePlan = (id) => (id === 'pro-year' ? 'pro' : id);

function PlanCard({ plan, yearly, currentId, onChoose }) {
  const current = plan.id === currentId;
  const upgrade = ORDER.indexOf(plan.id) > ORDER.indexOf(currentId);
  const price = yearly ? plan.yearly : plan.monthly;

  let button;
  if (current) {
    button = (
      <button type="button" className="ui-btn ui-btn--primary pricing-plan__btn" disabled>
        Gói hiện tại
      </button>
    );
  } else if (upgrade) {
    button = (
      <button type="button" className="ui-btn ui-btn--primary pricing-plan__btn" onClick={() => onChoose(plan.id)}>
        Nâng cấp lên {plan.name}
      </button>
    );
  } else {
    button = (
      <button type="button" className="ui-btn ui-btn--tertiary pricing-plan__btn" onClick={() => onChoose(plan.id)}>
        Hạ về {plan.name}
      </button>
    );
  }

  return (
    <div className={`pricing-plan${plan.popular ? ' is-popular' : ''}`}>
      {plan.popular && <p className="pricing-plan__tag">Phổ biến nhất</p>}
      <div className="pricing-plan__card">
        <div className="pricing-plan__top">
          <h3>{plan.name}</h3>
          {current && <span className="pricing-plan__badge">Đang dùng</span>}
        </div>
        <p className="pricing-plan__desc">{plan.desc}</p>
        <div>
          <p className="pricing-plan__price">
            <strong>{money(price)}</strong> / {yearly ? 'năm' : 'tháng'}
          </p>
          <p className="pricing-plan__alt">
            {plan.monthly === 0
              ? 'Miễn phí vĩnh viễn'
              : yearly
                ? `tương đương ${money(Math.round(plan.yearly / 12))} / tháng`
                : `hoặc ${money(plan.yearly)} / năm`}
          </p>
        </div>
        <span className="pricing-plan__credit">
          <img src={PICON('ic-sparkle-14')} alt="" width="14" height="14" />
          {plan.credit}
        </span>
        {button}
        <hr className="pricing-rule" />
        <ul className="pricing-plan__features">
          {plan.features.map(([label, on]) => (
            <li key={label} className={on ? '' : 'is-off'}>
              <img src={PICON(on ? 'ic-check-18' : 'ic-minus-18')} alt={on ? 'Có' : 'Không'} width="18" height="18" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Cell({ value }) {
  if (value === true) return <img src={PICON('ic-check-18')} alt="Có" width="18" height="18" />;
  if (value === false) return <img src={PICON('ic-minus-18')} alt="Không" width="18" height="18" />;
  return value;
}

function Faq() {
  const [open, setOpen] = useState(() => new Set([0]));
  const toggle = (i) =>
    setOpen((s) => {
      const next = new Set(s);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section className="pricing-section">
      <h2 className="pricing-h2">Câu hỏi thường gặp</h2>
      <div className="pricing-faq">
        {FAQ.map((f, i) => (
          <div key={f.q} className={`pricing-faq__item${open.has(i) ? ' is-open' : ''}`}>
            <button type="button" className="pricing-faq__q" onClick={() => toggle(i)} aria-expanded={open.has(i)}>
              {f.q}
              <img src={PICON(open.has(i) ? 'ic-chevron-up' : 'ic-plus')} alt="" width="18" height="18" />
            </button>
            {open.has(i) && <p className="pricing-faq__a">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/** "Gói cước chi tiết" — personal plans, credit costs, full comparison, top-ups, payment and FAQ. */
export default function PricingPage() {
  const { billing } = useOutletContext();
  const [yearly, setYearly] = useState(false);
  const currentId = basePlan(billing.plan.id);
  const choose = (id) => billing.setPlanId(id === 'pro' && yearly ? 'pro-year' : id);

  return (
    <div className="console-page pricing">
      <section className="pricing-hero">
        <p className="pricing-eyebrow">Gói dịch vụ cá nhân</p>
        <h2>Chọn gói phù hợp với nhu cầu học tập của bạn</h2>
        <p className="pricing-hero__desc">
          Bắt đầu miễn phí, nâng cấp khi cần thêm credit, mô hình AI nâng cao và công cụ chuyên sâu. Huỷ hoặc đổi gói
          bất kỳ lúc nào.
        </p>
        <div className="console-segment pricing-toggle" role="tablist" aria-label="Chu kỳ thanh toán">
          {[
            [false, 'Theo tháng'],
            [true, 'Theo năm · Tiết kiệm 17%'],
          ].map(([value, label]) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={yearly === value}
              className={`console-segment__item${yearly === value ? ' is-active' : ''}`}
              onClick={() => setYearly(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="pricing-plans">
        {PRICING_PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} yearly={yearly} currentId={currentId} onChoose={choose} />
        ))}
      </div>

      <section className="pricing-box">
        <div>
          <h2 className="pricing-h3">1 credit dùng được cho những gì?</h2>
          <p className="pricing-sub">
            Mỗi tác vụ trừ một lượng credit khác nhau tuỳ độ phức tạp. Credit được làm mới vào ngày đầu tiên của mỗi chu
            kỳ thanh toán.
          </p>
        </div>
        <div className="pricing-uses">
          {CREDIT_USES.map((u) => (
            <div key={u.title} className="pricing-use">
              <span className="pricing-use__icon">
                <img src={PICON(u.icon)} alt="" width="18" height="18" />
              </span>
              <p className="pricing-use__title">{u.title}</p>
              <p className="pricing-use__cost">{u.cost}</p>
              <p className="pricing-use__note">{u.note}</p>
            </div>
          ))}
        </div>
        <p className="pricing-note">
          <img src={PICON('ic-info')} alt="" width="16" height="16" />
          Mức trừ credit là dữ liệu mẫu, cần đối chiếu với chi phí thực tế của từng mô hình trước khi phát hành.
        </p>
      </section>

      <section className="pricing-section">
        <div>
          <h2 className="pricing-h2">So sánh chi tiết các gói</h2>
          <p className="pricing-sub">Toàn bộ hạn mức, tính năng và quyền lợi của từng gói cá nhân.</p>
        </div>
        <div className="console-table-scroll pricing-compare-wrap">
          <table className="pricing-compare">
            <thead>
              <tr>
                <th>Quyền lợi</th>
                {PRICING_PLANS.map((p) => (
                  <th key={p.id} className={p.popular ? 'is-popular' : ''}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            {COMPARISON.map((g) => (
              <tbody key={g.group}>
                <tr className="pricing-compare__group">
                  <th scope="rowgroup" colSpan={4}>
                    {g.group}
                  </th>
                </tr>
                {g.rows.map(([label, ...values]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {values.map((v, i) => (
                      <td key={i} className={PRICING_PLANS[i].popular ? 'is-popular' : ''}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="pricing-section">
        <div>
          <h2 className="pricing-h2">Mua thêm credit</h2>
          <p className="pricing-sub">
            Dành cho gói Plus và Pro khi cần dùng nhiều hơn hạn mức tháng. Credit mua thêm có hạn sử dụng 12 tháng.
          </p>
        </div>
        <div className="pricing-packs">
          {TOPUP_PACKS.map((p) => (
            <div key={p.credit} className={`pricing-pack${p.featured ? ' is-featured' : ''}`}>
              <span className="pricing-pack__icon">
                <img src={PICON('ic-sparkle-pack')} alt="" width="18" height="18" />
              </span>
              <div className="pricing-pack__text">
                <p className="pricing-pack__credit">{p.credit}</p>
                <p className="pricing-pack__price">{p.price}</p>
                <p className="pricing-pack__note">{p.note}</p>
              </div>
              <button
                type="button"
                className={`ui-btn ui-btn--sm pricing-pack__btn ${p.featured ? 'ui-btn--primary' : 'ui-btn--tertiary'}`}
                title="Sắp ra mắt"
              >
                Mua
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-box pricing-box--payment">
        <h2 className="pricing-h4">
          <img src={PICON('ic-shield')} alt="" width="20" height="20" />
          Thanh toán an toàn, linh hoạt
        </h2>
        <ul className="pricing-methods">
          {PAYMENT_METHODS.map(([name, color]) => (
            <li key={name} style={{ color }}>
              {name}
            </li>
          ))}
        </ul>
        <ul className="pricing-policies">
          {PAYMENT_POLICIES.map((p) => (
            <li key={p}>
              <img src={PICON('ic-check-16')} alt="" width="16" height="16" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <Faq />

      <section className="pricing-contact">
        <div>
          <p className="pricing-contact__title">Bạn là trường học hoặc tổ chức giáo dục?</p>
          <p className="pricing-contact__desc">
            Gói Tổ chức có quản trị tập trung, phân quyền theo khoa và báo giá theo quy mô.
          </p>
        </div>
        <Link to="/dang-ky/to-chuc" className="ui-btn ui-btn--primary">
          Xem gói Tổ chức
        </Link>
      </section>
    </div>
  );
}
