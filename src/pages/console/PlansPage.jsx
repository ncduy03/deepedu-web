import { useOutletContext } from 'react-router-dom';
import { CICON } from './ConsoleLayout.jsx';
import { PLAN_SECTIONS, PLANS } from './consoleData.js';

const CREDIT_USED = 320;
const CREDIT_TOTAL = 500;

function PlanButton({ plan, current, onChoose }) {
  const index = PLANS.findIndex((p) => p.id === plan.id);
  const currentIndex = PLANS.findIndex((p) => p.id === current.id);
  if (index === currentIndex) {
    return (
      <span className="ui-btn ui-btn--primary ui-btn--xs console-plan-btn" aria-current="true">
        Gói hiện tại
      </span>
    );
  }
  const downgrade = index < currentIndex;
  return (
    <button
      type="button"
      className={`ui-btn ui-btn--xs console-plan-btn ${downgrade ? 'ui-btn--tertiary' : 'ui-btn--secondary'}`}
      onClick={() => onChoose(plan.id)}
    >
      {downgrade ? `Chuyển về ${plan.name}` : 'Nâng cấp'}
    </button>
  );
}

/** "Gói dịch vụ" — current plan + comparison table of the personal plans. */
export default function PlansPage() {
  const { billing } = useOutletContext();
  const { plan, setPlanId, card } = billing;
  const col = (p) => (p.id === plan.id ? ' is-current' : '');

  return (
    <div className="console-page">
      <div className="console-section__head">
        <h2>Gói dịch vụ cá nhân</h2>
        <p className="console-section__caption">
          So sánh hạn mức credit và tính năng giữa các gói dành cho tài khoản cá nhân.
        </p>
      </div>

      <div className="console-current">
        <div className="console-current__plan">
          <p className="console-current__label">Gói hiện tại</p>
          <p className="console-current__name">{plan.label}</p>
        </div>
        <div className="console-current__usage">
          <div className="console-current__usage-label">
            <span>Credit tháng này</span>
            <strong>
              {CREDIT_USED} / {CREDIT_TOTAL} credit
            </strong>
          </div>
          <div
            className="console-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={CREDIT_TOTAL}
            aria-valuenow={CREDIT_USED}
            aria-label="Credit tháng này"
          >
            <span style={{ width: `${(CREDIT_USED / CREDIT_TOTAL) * 100}%` }} />
          </div>
        </div>
        {plan.id !== 'free' && (
          <div className="console-current__renew">
            <p className="console-current__label">Gia hạn tiếp theo</p>
            <p className="console-current__date">01/11/2026{card ? ` · Visa •••• ${card.last4}` : ''}</p>
          </div>
        )}
        <button type="button" className="ui-btn ui-btn--tertiary ui-btn--sm console-current__btn" title="Sắp ra mắt">
          Mua thêm credit
        </button>
      </div>

      <div className="console-table-scroll">
        <div className="console-plans" role="table" aria-label="So sánh các gói">
          <div className="console-plans__row console-plans__row--head" role="row">
            <div className="console-plans__cell console-plans__cell--feature" role="columnheader">
              Thông tin tính năng &amp; quyền lợi
            </div>
            {PLANS.map((p) => (
              <div key={p.id} className={`console-plans__cell console-plans__cell--plan${col(p)}`} role="columnheader">
                <span className="console-plans__name">{p.name}</span>
                <PlanButton plan={p} current={plan} onChoose={setPlanId} />
              </div>
            ))}
          </div>

          {PLAN_SECTIONS.map((section) => (
            <div key={section.title} role="rowgroup">
              <div className="console-plans__row" role="row">
                <div className="console-plans__cell console-plans__cell--section" role="rowheader">
                  {section.title}
                </div>
                {PLANS.map((p) => (
                  <div key={p.id} className={`console-plans__cell${col(p)}`} role="cell" />
                ))}
              </div>
              {section.rows.map((row) => (
                <div key={row.label} className="console-plans__row" role="row">
                  <div className="console-plans__cell console-plans__cell--feature-item" role="rowheader">
                    {row.label}
                  </div>
                  {PLANS.map((p) => (
                    <div key={p.id} className={`console-plans__cell console-plans__cell--value${col(p)}`} role="cell">
                      {row.value ? (
                        row.value(p)
                      ) : row.plans.includes(p.id) ? (
                        <img src={CICON('ic-check-circle')} alt="Có" width="16" height="16" />
                      ) : (
                        <img src={CICON('ic-minus')} alt="Không" width="16" height="16" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
