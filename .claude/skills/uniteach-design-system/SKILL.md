---
name: uniteach-design-system
description: Design system của file Figma UniTeach/DeepEdu (colors, semantic tokens, typography, spacing, radius, shadows, grid). Dùng khi code bất kỳ UI nào từ file Figma CdayktvN7lViH5Gs0fgMPv, hoặc khi cần tra cứu token màu/spacing/font của dự án deepedu.
---

# UniTeach / DeepEdu — Design System

Nguồn: Figma file `CdayktvN7lViH5Gs0fgMPv` (UniTeach), các page `↪ Colors` (2:4), `↪ Spacing / Grid layout / Radius` (70:9), `↪ Typography` (41:12), `↪ Components` (1133:4418).
Đọc trực tiếp từ Figma Variables + Text/Effect Styles ngày 2026-10-22.

**Code đã có sẵn:** toàn bộ token dưới đây đã được chuyển thành CSS custom properties trong
[`src/styles/tokens.css`](../../../src/styles/tokens.css). Luôn dùng `var(--...)` thay vì hardcode hex/px.
Quy tắc đặt tên CSS: tên Figma, bỏ prefix nhóm thừa, `/` → `-`, chữ thường
(vd. `text/heading-primary` → `--text-heading-primary`, `background/bg-brand-secondary` → `--bg-brand-secondary`,
`Spacing/4xl` → `--space-4xl`, `Radius/lg` → `--radius-lg`).

Khi `get_design_context` trả về `var(--text\/body,#656565)` → dùng `var(--text-body)`.

## 1. Font
- Một family duy nhất: **Mulish** (display / heading / body / label). Google Fonts, weights 400/600/700/800.
- Mapping tên weight trong Figma (dễ nhầm!):
  | Tên style Figma | Font style thực | CSS weight |
  |---|---|---|
  | Regular | Regular | 400 |
  | Medium | SemiBold | 600 |
  | Semibold | Bold | 700 |
  | Bold | ExtraBold | 800 |

## 2. Type scale (size / line-height / letter-spacing)
| Token | Size | LH | Letter-spacing |
|---|---|---|---|
| D1 | 96 | 116 | -2.5% |
| D2 | 72 | 88 | -2.5% |
| D3 | 60 | 72 | -2% |
| D4 | 48 | 60 | -2% |
| H1 | 40 | 52 | -2% |
| H2 | 36 | 48 | -2% |
| H3 | 32 | 44 | -1% |
| H4 | 28 | 38 | 0 |
| H5 | 24 | 32 | 0 |
| H6 | 20 | 28 | 0 |
| Body large | 18 | 28 | 0 |
| Body medium | 16 | 24 | 0 |
| Body small | 14 | 20 | 0 |
| Label large | 12 | 18 | 0 |
| Label small | 10 | 16 | 0 |

Mỗi cấp có 4 biến thể: `/Regular` `/Medium` `/Semibold` `/Bold` (xem bảng weight ở trên).
Lưu ý: `get_variable_defs` có thể báo letterSpacing dạng số (-2.5, -2, -1) — đó là **phần trăm**, CSS: `-0.025em`, `-0.02em`, `-0.01em`.
CSS utility classes có sẵn: `.t-d1` … `.t-label-sm` + `.fw-400/600/700/800`.

## 3. Màu primitive (Global colors)
- base: white `#ffffff`, black `#000000`, transparent `#ffffff00`
- **neutral**: 50 `#f4f4f4` · 100 `#efefef` · 200 `#dcdcdc` · 300 `#bdbdbd` · 400 `#989898` · 500 `#7c7c7c` · 600 `#656565` · 700 `#525252` · 800 `#464646` · 900 `#3d3d3d` · 950 `#292929`
- **Primary (brand tím)**: 50 `#f4f3ff` · 100 `#eceafd` · 200 `#dbd7fd` · 300 `#c0b7fb` · 400 `#a18ff6` · 500 `#8261f1` · 600 `#7849e8` · 700 `#622ed3` · 800 `#5226b1` · 900 `#452191` · 950 `#291362`
- **success**: 50 `#f2faeb` · 100 `#dff4d3` · 200 `#c2eaac` · 300 `#9cdb7b` · 400 `#79c952` · 500 `#58ab33` · 600 `#438a26` · 700 `#356a21` · 800 `#2d551f` · 900 `#28491e` · 950 `#12270c`
- **warning**: 50 `#fffceb` · 100 `#fff6c6` · 200 `#ffec88` · 300 `#ffdd4a` · 400 `#ffcb20` · 500 `#f9aa09` · 600 `#dd8002` · 700 `#b75b06` · 800 `#94450c` · 900 `#7a3a0d` · 950 `#461d02`
- **error**: 50 `#fff1f1` · 100 `#ffe4e5` · 200 `#fecdd1` · 300 `#fda4ab` · 400 `#fc707f` · 500 `#f53e56` · 600 `#e21c3f` · 700 `#c61236` · 800 `#a01133` · 900 `#881332` · 950 `#4c0516`
- Ngoài ra có đủ thang Tailwind chuẩn (slate, zinc, silver(=neutral TW), stone, orange, yellow, lime, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) — giá trị trùng 100% Tailwind v3.

## 4. Semantic tokens (collection "Color modes": Light / Dark)
Format: `token = light → dark`

**Text**
- text/heading-primary = neutral/900 → neutral/50
- text/heading-secondary = neutral/600 → neutral/200
- text/heading-inverted = white → neutral/900
- text/body = neutral/600 → neutral/200
- text/body-inverted = neutral/200 → neutral/700
- text/body-on-brand = Primary/50 → neutral/900
- text/sub-headline-brand = Primary/500 → Primary/400
- text/Link = Primary/500 → Primary/400
- text/placeholder = neutral/400 → neutral/500
- text/disabled = neutral/300 → neutral/600
- text/footer-headline = neutral/500 → neutral/400
- text/footer-headline-inverted = white → neutral/900
- text/error-primary = error/600 → error/300 · text/error-secondary = error/500 → error/400

**Background**
- bg-primary = white → neutral/900 · bg-primary-cards = white → neutral/800
- bg-secondary = neutral/50 → neutral/800 · bg-tertiary = neutral/100 → neutral/700
- bg-quaternary = neutral/200 → neutral/700 · bg-senary = neutral/300 → neutral/700
- bg-solid-primary = neutral/900 → neutral/50 · bg-solid-secondary = neutral/800 → neutral/300
- bg-solid-tertiary = neutral/700 → neutral/200 · bg-solid-quarternary = neutral/500 → neutral/400
- bg-brand-primary = Primary/50 → 900 · bg-brand-secondary = Primary/100 → 800 · bg-brand-tertiary = Primary/200 → 700
- bg-brand-quaternary = Primary/500 → 400 · bg-brand-quinary = Primary/600 → 300 · bg-brand-senary = Primary/700 → 200
- bg-success-primary = success/50 · -secondary = success/100 · -tertiary = success/500 · -quarternary = success/600 · -senery = success/700
- bg-warning = warning/50
- bg-error-primary = error/50 · -secondary = error/100 · -tertiary = error/200 · -quarternary = error/600 · -quinary = error/700 · -senary = error/800

**Border**
- border-primary = neutral/300 · border-secondary = neutral/200 · border-tertiary = neutral/100
- border-disabled = neutral/300 · border-solid = neutral/600 · border-white = white
- border-brand = Primary/500 · -hover = Primary/600 · -click = Primary/700 · -subtle = Primary/200
- border-error = error/600 · -hover = error/700 · -click = error/800 · -subtle = error/300 · -disabled = error/200

**Icons**
- icon-primary = neutral/900 · secondary = neutral/800 · tertiary = neutral/700 · quaternary = neutral/600 · quinary = neutral/500 · senary = neutral/400 · septenary = neutral/300
- icon-on-fill = white
- icon-brand-primary = Primary/600 · brand-secondary = Primary/500 · brand-tertiary = Primary/700 · brand-disabled = Primary/200
- icon-success-primary = success/500 · -secondary = success/600
- icon-warning-primary = warning/500 · -secondary = warning/600
- icon-error-primary = error/800 · -secondary = error/700 · -tertiary = error/600 · -quarternary = error/500 · -disabled = error/200

**Buttons** (light mode; state: default / hover / click / disabled)
- Brand Contained: fg white (disabled neutral/400); bg Primary/600 / 700 / 600 / neutral/100
- Brand Secondary: fg Primary/600 / 700 / 600 / Primary/300; bg Primary/50 / 100 / 50 / neutral/50
- Brand Outlined: fg Primary/600 / 700 / 600 / neutral/400; bg white / Primary/50 / Primary/100 / white; border Primary/600 / 700 / 600 / neutral/200
- Brand Text: fg Primary/600 / 700 / 600 / neutral/300; bg(hover) Primary/50
- Gray Contained: fg neutral/700 / 800 / 900 / 400; bg neutral/200 / 300 / 400 / 100
- Gray Outlined: fg neutral/700 / 800 / 900 / 300; bg white / neutral/50 / white / white; border neutral/300 (disabled neutral/200)
- Gray Text: fg neutral/700 / 800 / 700 / 300; bg(hover) neutral/50
- Red Contained: fg white; bg error/600 / 700 / 600 / error/100
- Red Secondary: fg error/600 / 800 / 700 / error/300; bg error/50 / 100 / 50 / neutral/50
- Red Outlined: fg error/600 / 800 / 700 / error/300; bg white; border = Gray Outlined border
- Red Text: fg error/600 / 800 / 700 / error/200; bg(hover) error/50
- Radius Button = 8px

## 5. Spacing (Number variables)
| Token | px | Token | px | Token | px |
|---|---|---|---|---|---|
| None | 0 | 4xl | 16 | 16xl | 88 |
| 3xs | 1 | 5xl | 20 | 17xl | 96 |
| 2xs | 2 | 6xl | 24 | 18xl | 112 |
| xs | 3 ⚠️ | 7xl | 32 | 19xl | 128 |
| sm | 4 | 8xl | 36 | 20xl | 144 |
| md | 6 | 9xl | 40 | 21xl | 160 |
| lg | 8 | 10xl | 44 | 22xl | 192 |
| xl | 10 | 11xl | 48 | 23xl | 208 |
| 2xl | 12 | 12xl | 56 | 24xl | 224 |
| 3xl | 14 | 13xl | 64 | 25xl–29xl | 240/256/288/320/384 |

⚠️ Biến `Spacing/xs` trong Figma bị hỏng giá trị (2.5e33); bảng tài liệu ghi **3px** → dùng 3px.

## 6. Radius
None 0 · 2xs 2 · xs 4 · sm 6 · md 8 · lg 16 · xl 20 · 2xl 24 · Full 99999 (pill).
Component: Button 8 · Input 8 · Badge 8 · Alerts 0 · Tooltip 0.

## 7. Border width
1, 2, 3, 4, 6, 8, 10 px.

## 8. Shadows & blur (Effect styles; màu gốc `#121A2B`)
- Shadow xs: `0 1px 2px rgba(18,26,43,.05)`
- Shadow sm: `0 1px 2px -1px rgba(18,26,43,.06), 0 1px 2px 0 rgba(18,26,43,.10)`
- Shadow md: `0 2px 4px -2px rgba(18,26,43,.06), 0 4px 6px -2px rgba(18,26,43,.10)`
- Shadow lg: `0 4px 6px -4px rgba(18,26,43,.05), 0 12px 15px -4px rgba(18,26,43,.10)`
- Shadow xl: `0 8px 8px -6px rgba(18,26,43,.04), 0 20px 25px -4px rgba(18,26,43,.10)`
- Shadow xxl: `0 25px 45px -12px rgba(18,26,43,.20)`
- Focus ring: `0 0 0 3px` + primary `#eceafd` / gray `#efefef` / success `#dff4d3` / warning `#fef3c7` / error `#ffe4e5`
- Blur xs/sm/md/lg/xl/xxl: `backdrop-filter: blur(4/8/16/24/32/40px)` + `inset 0 0.5px 0 rgba(255,255,255,.2)` (Figma blur radius ≈ CSS blur ÷ 2; dùng giá trị /2 nếu cần khớp chính xác)

## 9. Grid / Breakpoints
| Breakpoint | Min width | Columns | Margin | Gutter |
|---|---|---|---|---|
| Desktop | 1440 | 12 | 112 | 32 |
| Tablet | 768 | 6 | 36 | 32 |
| Mobile | 390 | 4 | 20 | 16 |

Desktop content width = 1440 − 2×112 = 1216px. (Landing page thực tế dùng padding ngang 120px → container 1200px; ưu tiên số đo trong design của từng section.)

## 10. Quy ước code trong repo deepedu
- Stack: Vite + React 18 + CSS thuần (CSS variables trong `src/styles/tokens.css`), không Tailwind.
- Font load trong `index.html`: Mulish 400/600/700/800 + Archivo Bold Italic (chữ "DeepEdu" trong logo).
- Component dùng chung: `src/components/Logo.jsx` (`Logo`, `LogoMark`, `SocialMark`), `src/components/Pill.jsx` (`Badge` gradient pill, `Tag` pill xám).
- Class dùng chung trong `src/pages/LandingPage.css`: `.btn .btn--brand .btn--md/.btn--lg`, `.display-h4` (48/60), `.heading-h2` (36/48), `.gradient-text`, `.container` (max 1440, padding 120).
- Asset tải từ Figma nằm trong `public/assets/<section>/...` — không dùng URL tạm `figma.com/api/mcp/asset`.
- Gradient brand chuẩn: `linear-gradient(<góc>, var(--primary-600), var(--primary-400))`.

## 11. Hệ token thứ 2: file DeepEdu_UI (app / đăng nhập / đăng ký)
File `H1rZJ8znFj6xts7VP6owEe` (DeepEdu_UI), section "Sign up" 40007815:9574. Dùng hệ token KHÁC landing — đã đưa vào [`src/styles/tokens-app.css`](../../../src/styles/tokens-app.css) với prefix `--ui-`.
- Màu: canvas `#f9f9f9`, surface `#fff`, fill-primary `#8261f1`, content strong `#202020` / medium `#646464` / light `#8d8d8d`, content-primary `#7653e2`, primary-press `#6749c5`, display-primary-medium `#ddd9ff`, positive `#209d47`, info `#007af1`, fill-disabled `#e0e0e0`, border light `rgba(0,0,0,.09)` / medium `rgba(0,0,0,.15)`.
- **`corner-radius/action` = 1000** → mọi nút app là pill (fallback trong code gen ghi 8px là SAI). xSmall 8, Small 12, Large 24 (card), 2xSmall 4 (checkbox).
- Font weight dùng cả **500 (Medium)** — Mulish phải nạp 400/500/600/700/800.
- Type: Giant-Display 56/64 (-1.68), H1 32/40 (-0.96), H2 24/32 (-0.48), H4 18/24 (-0.18), Body 16/24 (-0.16), Body-Small 14/20 (-0.14), Caption 12/16, Button Medium 16/24 600.
- Elevation-100: `0 0 24px -4px rgba(0,0,0,.07)`. Focus ring: `0 0 0 3px rgba(130,97,242,.2)`.
- Các màn đăng ký **tổ chức** trong section chỉ là ảnh chụp (image 3/4/5/6/53, ảnh 5 = 6) — không có layer; code dựng theo bố cục ảnh + token `--ui-`.
- Component app: `src/components/ui/index.jsx` (`AuthCard`, `TextField`, `Checkbox`, `MiniStepper`, `OtpInput`, `MaskIcon`, `Separator`); class nút `.ui-btn .ui-btn--primary|--tertiary`, `.ui-link`. Layout `src/layouts/AuthLayout.jsx` (header DE + footer).
- Trợ lý (chat) section 40007823:14192 → `src/pages/chat/ChatPage.jsx`, route `/tro-ly`; dùng token landing (`--text-*`, `--bg-*`) cho khung + token `--ui-*` cho nút/thẻ khách. Ảnh quả cầu 768×1024 bị Figma kéo giãn vào 86×92 → `object-fit: fill`.
- Route: `/` landing, `/tro-ly`, `/dang-nhap`, `/dang-ky`, `/dang-ky/ca-nhan[/xac-minh|/ho-so|/thanh-cong]`, `/dang-ky/to-chuc[/lien-he|/xac-nhan|/thanh-cong]`.

## 12. Mẹo khi đọc Figma file này
- Trang landing: page `🌟 LandingPage` (18080:744), section `Landingpage` 26903:71866, frame chính `Desktop - 4` (26903:71867, 1440×7010). Các frame khác trong section là bản thử nghiệm/hover state.
- `get_design_context` trên frame lớn sẽ bị sparse → gọi theo từng section con.
- Đọc variables nhanh nhất bằng `use_figma` + `figma.variables.getLocalVariableCollectionsAsync()` (read-only).
