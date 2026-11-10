import { useEffect, useId, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EnterpriseContactDialog from '../../sections/EnterpriseContactDialog.jsx';
import { Pagination } from './TransactionsPage.jsx';
import { PICON } from './projectsData.js';
import { PLAN_CYCLE, REQUEST_RANGES, REQUESTS, STATUS, TOPUP_PRESETS, VND_PER_CREDIT } from './consoleData.js';
import './Plans.css';

const PAGE_SIZE = 6;
const PLAN_ICON = (name) => `/assets/plans/${name}.svg`;
const num = (n) => n.toLocaleString('en-US'); // "9,999,000" as in the design
/** Landing prices are "49.000đ"; the console shows "49,000". */
const priceNumber = (price) => price.replace('đ', '').replace(/\./g, ',');

function Stat({ icon, label, children }) {
  return (
    <div className="plans-stat">
      <span className="plans-stat__icon">
        <img src={PLAN_ICON(icon)} alt="" width="20" height="20" />
      </span>
      <div>
        <p className="plans-stat__label">{label}</p>
        <p className="plans-stat__value">{children}</p>
      </div>
    </div>
  );
}

/** "Nạp thêm credit": pick an amount, see price, plan bonus and the balance afterwards. */
function TopupDialog({ balance, plan, onClose, onConfirm }) {
  const titleId = useId();
  const [amount, setAmount] = useState(TOPUP_PRESETS[0]);
  const bonus = plan.bonus ? Math.floor((amount * plan.bonus) / 100) : 0;
  const received = amount + bonus;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pj-dialog plans-topup" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="pj-dialog__header">
          <h2 id={titleId} className="pj-dialog__title plans-topup__title">
            Nạp thêm credit
          </h2>
          <button type="button" className="pj-dialog__close" onClick={onClose} aria-label="Đóng">
            <img src={PICON('ic-close-20')} alt="" width="20" height="20" />
          </button>
        </div>

        <div className="plans-topup__balance">
          <span>Số dư hiện tại:</span>
          <span>
            <strong>{num(balance)}</strong> credits
          </span>
        </div>

        <div className="plans-topup__field">
          <label htmlFor={`${titleId}-amount`} className="plans-topup__label">
            Số credit muốn nạp
          </label>
          <div className="plans-topup__input">
            <input
              id={`${titleId}-amount`}
              inputMode="numeric"
              value={amount ? num(amount) : ''}
              onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '').slice(0, 9)) || 0)}
            />
            <span>Credits</span>
          </div>
          <div className="plans-topup__presets">
            {TOPUP_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                className={`ui-btn ui-btn--xs ${amount === n ? 'ui-btn--primary' : 'ui-btn--tertiary'}`}
                aria-pressed={amount === n}
                onClick={() => setAmount(n)}
              >
                + {num(n)}
              </button>
            ))}
          </div>
        </div>

        <div className="plans-ticket">
          <img className="plans-ticket__shape" src={PLAN_ICON('ticket-top')} alt="" width="432" height="114" />
          <div className="plans-ticket__total">
            <p className="plans-ticket__caption">Số tiền cần thanh toán</p>
            <p className="plans-ticket__vat">
              (Chưa bao gồm <strong>10% VAT)</strong>
            </p>
            <p className="plans-ticket__amount">
              {num(amount * VND_PER_CREDIT)} <span>VND</span>
            </p>
          </div>
          <dl className="plans-ticket__rows">
            <div>
              <dt>Quy đổi tỷ giá:</dt>
              <dd>1 Credit = {VND_PER_CREDIT} VND</dd>
            </div>
            {bonus > 0 && (
              <div>
                <dt>
                  Bonus (<strong>{plan.bonus}%</strong> theo gói <strong>{plan.name}</strong>)
                </dt>
                <dd>+{num(bonus)} credits</dd>
              </div>
            )}
            <div>
              <dt>Credit nhận được sau giao dịch:</dt>
              <dd>+ {num(received)} credits</dd>
            </div>
            <div>
              <dt>Số dư sau khi nạp:</dt>
              <dd className="plans-ticket__after">{num(balance + received)} Credits</dd>
            </div>
          </dl>
        </div>
        <p className="plans-topup__note">Credit nạp thêm có giá trị vĩnh viễn và không bị trừ theo chu kỳ tháng.</p>

        <div className="pj-dialog__footer">
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={onClose}>
            Huỷ
          </button>
          <button type="button" className="ui-btn ui-btn--primary" disabled={!amount} onClick={() => onConfirm(received)}>
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, current, onChoose, onContact }) {
  const isCurrent = plan.id === current.id;
  const tone = isCurrent ? ' is-current' : plan.popular ? ' is-popular' : '';

  let action;
  if (isCurrent) {
    action = (
      <button type="button" className="ui-btn ui-btn--primary ui-btn--xs ui-btn--block" disabled>
        Gói hiện tại
      </button>
    );
  } else if (plan.cta === 'contact') {
    action = (
      <button type="button" className="ui-btn ui-btn--tertiary ui-btn--xs ui-btn--block" onClick={onContact}>
        Liên hệ tư vấn
      </button>
    );
  } else {
    action = (
      <button
        type="button"
        className={`ui-btn ui-btn--xs ui-btn--block ${plan.popular ? 'ui-btn--primary' : 'ui-btn--tertiary'}`}
        onClick={() => onChoose(plan.id)}
      >
        Chuyển gói
      </button>
    );
  }

  return (
    <article className={`plans-card${tone}`}>
      <div className="plans-card__head">
        <h3>{plan.name}</h3>
        {isCurrent ? (
          <span className="plans-card__badge plans-card__badge--current">Đang dùng</span>
        ) : (
          plan.popular && <span className="plans-card__badge">Phổ biến nhất</span>
        )}
      </div>
      {plan.cta === 'contact' ? (
        <p className="plans-card__contact">Liên hệ để nhận giá ưu đãi</p>
      ) : (
        <p className="plans-card__price">
          {priceNumber(plan.price)}
          <span>VND{plan.period ? ` ${plan.period}` : ''}</span>
        </p>
      )}
      <p className="plans-card__desc">{plan.desc}</p>
      <ul className="plans-card__features">
        {plan.features.map((f, i) => (
          <li key={f} className={i === 0 ? 'is-lead' : ''}>
            <img src={PLAN_ICON('ic-check')} alt="" width="16" height="16" />
            {f}
          </li>
        ))}
      </ul>
      {action}
    </article>
  );
}

/** "Gói dịch vụ": credit + current plan overview, plan cards (per account type) and recent requests. */
export default function PlansPage() {
  const { billing, account } = useOutletContext();
  const { plan, plans, setPlanId, credits, buyCredits } = billing;
  const org = account.type === 'org';
  const balance = credits.bought - credits.used;
  const paid = plan.id !== 'free';

  const [topupOpen, setTopupOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [range, setRange] = useState(REQUEST_RANGES[0].id);
  const [page, setPage] = useState(1);

  const days = REQUEST_RANGES.find((r) => r.id === range).days;
  const rows = REQUESTS.filter((r) => r.daysAgo < days);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const who = org ? 'tổ chức' : 'bạn';

  return (
    <div className="console-page plans-page">
      <section className="console-section">
        <div className="console-section__head">
          <h2>Tổng quan gói &amp; Credit</h2>
          <p className="console-section__caption">
            Thông tin số dư credit khả dụng, chu kỳ hiện tại và quản lý gói đăng ký của {who}
          </p>
        </div>

        <div className="plans-overview">
          <div className="plans-panel plans-panel--credit">
            <div className="plans-panel__top">
              <p className="plans-panel__label">Số dư credit khả dụng</p>
              <div className="plans-panel__main">
                <p className="plans-panel__big">
                  {num(balance)}
                  <span>Credits</span>
                </p>
                <button type="button" className="ui-btn ui-btn--primary ui-btn--sm" onClick={() => setTopupOpen(true)}>
                  <img src={PLAN_ICON('ic-plus')} alt="" width="20" height="20" />
                  Nạp thêm credit
                </button>
              </div>
              <p className="plans-panel__note">Credit nạp thêm có giá trị vĩnh viễn và không bị mất đi theo chu kỳ tháng.</p>
            </div>
            <div className="plans-panel__stats">
              <Stat icon="ic-bought" label="Tổng đã mua">
                <strong>{num(credits.bought)}</strong> credit
              </Stat>
              <Stat icon="ic-used" label="Đã sử dụng">
                <strong>{num(credits.used)}</strong> credit
              </Stat>
            </div>
          </div>

          <div className="plans-panel">
            <div className="plans-panel__top">
              <div className="plans-panel__row">
                <p className="plans-panel__label">Gói hiện tại</p>
                {paid && (
                  <p className="plans-panel__warning">
                    <img src={PLAN_ICON('ic-warning')} alt="" width="16" height="16" />
                    <span>
                      Còn <strong>{PLAN_CYCLE.daysLeft} ngày</strong> đến hạn. Thanh toán trước{' '}
                      <strong>{PLAN_CYCLE.renewOn}</strong> để tránh gián đoạn.
                    </span>
                  </p>
                )}
              </div>
              <div className="plans-panel__main">
                <p className="plans-panel__big plans-panel__big--plan">{plan.name}</p>
                {paid && (
                  <button type="button" className="ui-btn ui-btn--primary ui-btn--sm" title="Sắp ra mắt">
                    <img src={PLAN_ICON('ic-wallet')} alt="" width="20" height="20" />
                    Thanh toán gia hạn
                  </button>
                )}
              </div>
              <p className="plans-panel__note plans-panel__note--wide">
                {paid
                  ? 'Gói hiện tại không tự động gia hạn. Để tiếp tục sử dụng sau ngày làm mới, vui lòng thanh toán lại bằng chuyển khoản hoặc mã QR.'
                  : 'Gói miễn phí không cần thanh toán. Nâng cấp gói để có thêm dự án, API key và bonus khi nạp credit.'}
              </p>
            </div>
            <div className="plans-panel__stats">
              <Stat icon="ic-calendar" label="Chu kỳ hiện tại">
                <strong>
                  {PLAN_CYCLE.from} - {PLAN_CYCLE.to}
                </strong>
              </Stat>
              <Stat icon="ic-calendar" label="Ngày làm mới tiếp theo">
                <strong>{PLAN_CYCLE.renewOn}</strong>
              </Stat>
            </div>
          </div>
        </div>
      </section>

      <section className="console-section">
        <div className="console-section__head">
          <h2>Các gói dịch vụ</h2>
          <p className="console-section__caption">
            {org
              ? 'Lựa chọn gói dịch vụ AI phù hợp theo nhu cầu và quy mô của đơn vị'
              : 'Lựa chọn gói dịch vụ AI phù hợp với nhu cầu sử dụng của bạn'}
          </p>
        </div>
        <div className={`plans-cards plans-cards--${plans.length}`}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} current={plan} onChoose={setPlanId} onContact={() => setContactOpen(true)} />
          ))}
        </div>
      </section>

      <section className="console-section">
        <div className="console-section__head">
          <h2>Request gần đây</h2>
          <p className="console-section__caption">
            Nhật ký chi tiết các yêu cầu AI, thời gian xử lý và credit tiêu thụ của {who}
          </p>
        </div>

        <div className="console-tabs plans-tabs" role="tablist" aria-label="Khoảng thời gian">
          {REQUEST_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={range === r.id}
              className={`console-tabs__item${range === r.id ? ' is-active' : ''}`}
              onClick={() => {
                setRange(r.id);
                setPage(1);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="console-table-wrap">
          <div className="console-table-scroll">
            <table className="console-table plans-table">
              <thead>
                <tr>
                  <th>Thời gian (time)</th>
                  <th className="col-status">Trạng thái</th>
                  <th className="col-credits">Credit tiêu thụ</th>
                  <th className="col-cost">Chi phí</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="plans-table__time">{r.time}</span>
                      <span className="plans-table__task">{r.task}</span>
                    </td>
                    <td>
                      <span className={`console-badge console-badge--${r.status}`}>{STATUS[r.status]}</span>
                    </td>
                    <td className="plans-table__credits">- {r.credits} credits</td>
                    <td>{num(r.cost)} đ</td>
                  </tr>
                ))}
                {!visible.length && (
                  <tr>
                    <td colSpan={4} className="console-table__empty">
                      Chưa có request nào trong khoảng thời gian này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="plans-table-footer">
            <p className="plans-table-footer__count">
              Hiển thị{' '}
              <strong>
                {(page - 1) * PAGE_SIZE + 1} - {(page - 1) * PAGE_SIZE + visible.length}
              </strong>{' '}
              trong tổng số <strong>{rows.length}</strong> request
            </p>
            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>
        )}
      </section>

      {topupOpen && (
        <TopupDialog
          balance={balance}
          plan={plan}
          onClose={() => setTopupOpen(false)}
          onConfirm={(n) => {
            buyCredits(n);
            setTopupOpen(false);
          }}
        />
      )}
      {contactOpen && <EnterpriseContactDialog onClose={() => setContactOpen(false)} />}
    </div>
  );
}
