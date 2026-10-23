import { useOutletContext } from 'react-router-dom';
import { CICON } from './ConsoleLayout.jsx';
import { PLAN_SECTIONS, PLANS } from './consoleData.js';

const POPULAR = PLANS.findIndex((p) => p.popular);

/** Current plan → "Gói hiện tại"; the popular plan → white "Lựa chọn"; others → light purple "Lựa chọn". */
function PlanButton({ plan, current, onChoose }) {
  if (plan.id === current.id) {
    return (
      <span className="ui-btn ui-btn--primary ui-btn--xs console-plan-btn" aria-current="true">
        Gói hiện tại
      </span>
    );
  }
  return (
    <button
      type="button"
      className={`ui-btn ui-btn--xs console-plan-btn ${plan.popular ? 'ui-btn--tertiary' : 'ui-btn--secondary'}`}
      onClick={() => onChoose(plan.id)}
    >
      Lựa chọn
    </button>
  );
}

/** "Gói dịch vụ" — comparison table of the personal plans, with the popular plan outlined. */
export default function PlansPage() {
  const { billing } = useOutletContext();
  const { plan, setPlanId } = billing;
  const col = (p) => (p.popular ? ' is-popular' : '');

  return (
    <div className="console-page">
      <div className="console-section__head">
        <h2>Tính năng &amp; quyền lợi DeepEdu</h2>
        <p className="console-section__caption">
          So sánh chi tiết hạn mức credit và các tính năng AI cốt lõi giữa các gói DeepEdu
        </p>
      </div>

      <div className="console-table-scroll">
        <div className="console-plans" role="table" aria-label="So sánh các gói">
          {POPULAR >= 0 && (
            <div className="console-plans__popular" style={{ '--col': POPULAR }} aria-hidden="true">
              <span>Phổ biến</span>
            </div>
          )}
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
