# DeepEdu Web

Landing page, đăng nhập / đăng ký (cá nhân & tổ chức) và màn Trợ lý DeepEdu — code từ thiết kế Figma (UniTeach, DeepEdu_UI).

## Chạy trên máy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build ra thư mục dist/
npm run preview  # xem bản build tại http://localhost:4173
```

## Các trang

| Đường dẫn | Màn |
|---|---|
| `/` | Landing page |
| `/tro-ly` | Trợ lý DeepEdu (chat) |
| `/dang-nhap` | Đăng nhập |
| `/dang-ky` | Chọn loại tài khoản |
| `/dang-ky/ca-nhan/...` | Đăng ký cá nhân (email → OTP → hồ sơ → thành công) |
| `/dang-ky/to-chuc/...` | Đăng ký tổ chức (thông tin → liên hệ → xác nhận → thành công) |

## Trạng thái hiện tại

Đây là bản giao diện (front-end only), **chưa có backend**:

- Không gửi email / mã OTP thật; nhập 6 số bất kỳ là qua bước xác minh.
- Hồ sơ tổ chức không được lưu; mã hồ sơ là số ngẫu nhiên.
- Trợ lý chưa kết nối mô hình AI — mọi câu hỏi nhận một câu trả lời demo cố định.
- Dữ liệu chỉ nằm trong bộ nhớ trình duyệt và mất khi tải lại trang.

## Deploy

Đã có sẵn cấu hình cho Vercel (`vercel.json`) và Netlify (`netlify.toml`), gồm rewrite để mọi đường dẫn đều trả về `index.html` (cần cho React Router).

## Cấu trúc

- `src/styles/tokens.css` — token landing (Figma UniTeach); `src/styles/tokens-app.css` — token app (Figma DeepEdu_UI, prefix `--ui-`)
- `src/sections/` — các section của landing
- `src/pages/auth/` — đăng nhập, đăng ký; `src/pages/chat/` — Trợ lý
- `src/components/ui/` — component dùng chung (TextField, Checkbox, Stepper, OTP…)
- `.claude/skills/uniteach-design-system/` — ghi chú design system cho Claude Code
