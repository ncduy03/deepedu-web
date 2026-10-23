import { useOutletContext } from 'react-router-dom';
import { CICON } from './ConsoleLayout.jsx';
import { CardSection } from './CardSection.jsx';

/** "Phương thức thanh toán" — linked card / e-wallets and auto-renew setting. */
export default function PaymentMethodsPage() {
  const { billing } = useOutletContext();
  const { plan, card, removeCard, wallets, removeWallet, autoRenew, setAutoRenew } = billing;
  const renewMethod = card ? `Visa •••• ${card.last4}` : wallets[0]?.name;
  const paid = plan.id !== 'free';

  let renewText;
  if (!paid) renewText = 'Bạn đang dùng gói Free nên không có khoản gia hạn nào.';
  else if (!renewMethod) renewText = 'Hãy thêm thẻ hoặc ví điện tử để gói được tự động gia hạn.';
  else if (autoRenew)
    renewText = `Gói ${plan.name} sẽ tự động gia hạn vào 01/11/2026 với số tiền ${plan.price.split(' /')[0]} bằng ${renewMethod}.`;
  else renewText = `Tự động gia hạn đang tắt. Gói ${plan.name} sẽ hết hạn vào 01/11/2026.`;

  return (
    <div className="console-page console-page--payments">
      <div className="console-section">
        <div className="console-section__head">
          <h2>Thẻ &amp; ví đã liên kết</h2>
          <p className="console-section__caption">
            Thẻ Visa, Mastercard, JCB và ví điện tử MoMo, ZaloPay, VNPay dùng để thanh toán gói và mua thêm credit.
          </p>
        </div>

        <div className="console-methods">
          <CardSection card={card} setCard={billing.setCard} removeCard={removeCard} security={false} allowAdd={false} />

          {wallets.map((w) => (
            <div key={w.id} className="console-wallet">
              <span className="console-wallet__logo" style={{ background: w.color }}>
                {w.short}
              </span>
              <div className="console-wallet__text">
                <p className="console-wallet__name">{w.name}</p>
                <p className="console-wallet__phone">Liên kết với {w.phone}</p>
              </div>
              <button type="button" className="ui-btn ui-btn--tertiary ui-btn--xs" onClick={() => removeWallet(w.id)}>
                Hủy liên kết
              </button>
            </div>
          ))}

          <button type="button" className="console-add-method" title="Sắp ra mắt">
            + Thêm thẻ hoặc ví điện tử
          </button>

          <div className="console-security">
            <span className="console-security__icon">
              <img src={CICON('ic-shield-check')} alt="" width="16" height="16" />
            </span>
            <div>
              <p className="console-security__title">Bảo mật tiêu chuẩn quốc tế PCI DSS</p>
              <p className="console-security__desc">
                Chi tiết thẻ của bạn được mã hóa và xử lý một cách an toàn. Chúng tôi sử dụng phương thức mã hóa token
                do nhà cung cấp thanh toán lưu trữ; số thẻ gốc hoặc mã CVV không bao giờ được lưu trữ hoặc ghi lại trên
                máy chủ của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="console-renew">
        <h3>Tự động gia hạn</h3>
        <div className="console-renew__row">
          <p>{renewText}</p>
          {paid && renewMethod && (
            <>
              <button type="button" className="ui-btn ui-btn--tertiary ui-btn--xs" title="Sắp ra mắt">
                Đổi phương thức
              </button>
              <button type="button" className="console-text-btn" onClick={() => setAutoRenew(!autoRenew)}>
                {autoRenew ? 'Tắt tự động gia hạn' : 'Bật tự động gia hạn'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
