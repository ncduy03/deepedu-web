import { useRef, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Star } from 'lucide-react';
import { MaskIcon } from '../../components/ui/index.jsx';
import { ICON } from './AssistantLayout.jsx';
import './AccountPages.css';

const TYPES = ['Góp ý', 'Báo lỗi', 'Đề xuất tính năng', 'Khác'];
const MAX_CHARS = 2000;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ['image/png', 'image/jpeg', 'application/pdf'];
const RATING_LABELS = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

/** "Góp ý sản phẩm". Demo only: the form is validated but nothing is sent anywhere. */
export default function FeedbackPage() {
  const { user } = useOutletContext();
  const [type, setType] = useState(TYPES[0]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  if (!user) return <Navigate to="/dang-nhap" replace />;

  const addFiles = (list) => {
    const incoming = Array.from(list || []);
    const bad = incoming.find((f) => !ACCEPT.includes(f.type) || f.size > MAX_BYTES);
    setFileError(bad ? `“${bad.name}” không hợp lệ. Chỉ nhận PNG, JPG hoặc PDF tối đa 10MB.` : '');
    setFiles((fs) => [...fs, ...incoming.filter((f) => ACCEPT.includes(f.type) && f.size <= MAX_BYTES)]);
  };

  const canSubmit = rating > 0 && text.trim().length > 0;

  const reset = () => {
    setType(TYPES[0]);
    setRating(0);
    setText('');
    setFiles([]);
    setFileError('');
    setDone(false);
  };

  if (done) {
    return (
      <div className="acc-scroll">
        <div className="acc-content acc-content--feedback acc-thanks">
          <span className="acc-thanks__icon">
            <img src="/assets/auth/ic-checkmark-success.svg" alt="" width="28" height="28" />
          </span>
          <h2 className="acc-title">Cảm ơn bạn đã góp ý!</h2>
          <p className="acc-subtitle">
            Đây là bản demo nên phản hồi chưa được gửi đi. Khi hệ thống hoàn thiện, đội ngũ DeepEdu sẽ nhận được phản hồi
            này.
          </p>
          <button type="button" className="ui-btn ui-btn--tertiary" onClick={reset}>
            Gửi phản hồi khác
          </button>
        </div>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <div className="acc-scroll">
      <form
        className="acc-content acc-content--feedback"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) setDone(true);
        }}
        noValidate
      >
        <div className="acc-heading">
          <h2 className="acc-title">Phản hồi về trải nghiệm sử dụng</h2>
          <p className="acc-subtitle">
            Bạn vui lòng chia sẻ ý kiến về trải nghiệm khi sử dụng AI và các tính năng của DeepEdu. Mọi phản hồi đều giúp
            chúng tôi hoàn thiện sản phẩm tốt hơn.
          </p>
        </div>

        <div className="acc-group">
          <p className="acc-label">Loại phản hồi</p>
          <div className="acc-chips">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`acc-chip acc-chip--lg${type === t ? ' is-selected' : ''}`}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="acc-group">
          <p className="acc-label" id="rating-label">
            Mức độ hài lòng
          </p>
          <div className="acc-rating" role="radiogroup" aria-labelledby="rating-label" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={RATING_LABELS[n - 1]}
                title={RATING_LABELS[n - 1]}
                className={`acc-star${n <= shown ? ' is-on' : ''}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
              >
                {n <= shown ? <Star size={24} strokeWidth={1.5} fill="currentColor" /> : <MaskIcon src={ICON('ic-star-outline')} size={24} />}
              </button>
            ))}
          </div>
        </div>

        <div className="acc-group">
          <label className="acc-label" htmlFor="feedback-text">
            Nội dung phản hồi
          </label>
          <textarea
            id="feedback-text"
            className="acc-textarea"
            placeholder="Bạn vui lòng mô tả chi tiết phản hồi của mình..."
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="acc-counter">
            {text.length}/{MAX_CHARS} ký tự
          </p>
        </div>

        <div className="acc-group">
          <p className="acc-label">Đính kèm ảnh chụp màn hình hoặc tệp minh họa (không bắt buộc)</p>
          <div
            className={`acc-dropzone${dragging ? ' is-dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <img src={ICON('ic-upload')} alt="" width="24" height="24" />
            <p className="acc-dropzone__text">
              Kéo thả tệp vào đây hoặc{' '}
              <button type="button" className="acc-dropzone__pick" onClick={() => inputRef.current?.click()}>
                chọn từ thiết bị
              </button>
            </p>
            <p className="acc-dropzone__hint">PNG, JPG hoặc PDF · Tối đa 10MB</p>
            <input
              ref={inputRef}
              type="file"
              hidden
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
          {fileError && <p className="ui-field__error">{fileError}</p>}
          {files.length > 0 && (
            <ul className="acc-files">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`}>
                  <span>{f.name}</span>
                  <button type="button" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} aria-label={`Bỏ ${f.name}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="acc-actions">
          <button type="submit" className="ui-btn ui-btn--primary" disabled={!canSubmit}>
            Gửi phản hồi
          </button>
        </div>
      </form>
    </div>
  );
}
