# Hanqin Lyu Portfolio — Design System

> 来源：`style.css` 与 `index.html`（commit 4126921）。标注【补充】的是本次新增，尚未写回 `style.css`。
> 在线版：https://claude.ai/artifact/AWec8LgHLRaH6bgH1kTsS7

一套为“云安全工程师作品集”而生的克制、证据导向的视觉语言：浅冷灰底、Azure 蓝作为唯一品牌色、绿色只代表“已验证”，标题用 Space Grotesk，正文用 IBM Plex Sans，所有“机器味”的元数据（认证、标签、状态）用 IBM Plex Mono。

## 设计原则

1. **证据先于修饰。** 页面像一份审计报告：状态、指标、截图、决策记录。不用插画、渐变、阴影来制造氛围。
2. **一种品牌色。** `azure` 承担链接、主按钮、眉标、数字；其它颜色都只是信号（`verified` = 已完成，`warn` = 进行中）。
3. **Mono 即元数据。** 凡是“可被机器核对”的信息——认证名、技术栈、状态、表头、meta——都用 `mono` 族。人写的叙述用 `body` 族。
4. **描边而非阴影。** 层级靠 `line` 1px 描边与 `surface` / `bg` 的明度差建立，整个系统没有 box-shadow。

## 内容基础

- **语气：** 第一人称 “I”，陈述事实，动词具体（“I build Azure guardrails as code”）。不自夸，不用 “passionate”“rockstar” 之类的词。
- **用结果说话：** 写可验证的结果——“the same code that deployed under Audit was rejected with a 403 under Deny”。数字保留原样（“3 pre-deployment gates”）。
- **大小写：** 项目标题用 Title Case（“Shift-Left & Cloud Guardrails on Azure”）；按钮与链接用句首大写（“View projects”“Download resume (PDF)”）；eyebrow、status pill、表头全大写，由 CSS `text-transform` 或直接书写。
- **状态词：** status pill 只放一个大写单词，表达“这个项目对安全做了什么”：`GOVERNED`、`ENFORCED`、`DETECTED`。进行中用 `IN PROGRESS`（替代源站的 “Loading...”，后者像加载占位）。
- **认证名照官方写法：** `CompTIA Security+`、`SC-200`；进行中写作 `SC-100 — In Progress`（em dash 两侧留空格）。
- **标点：** 用 em dash（—）连接补充说明；链接末尾用 “→”（“View details →”）；页脚用 “·” 分隔。
- **不用 emoji。** 唯一的字形是 badge 前的 `✓`（已验证）与 `○`（进行中）。

## 颜色

- 页面底色 `bg`；所有“卡片”类容器（导航、项目卡、KPI、图表框、callout）用 `surface` 加 `line` 描边。
- 正文 `ink`；导语、描述、表格单元格 `ink-soft`；tag、meta、图注、页脚、表头 `ink-faint`。三档文字都只读在 `bg` / `surface` / `surface-tint` 上。
- 链接与主操作用 `azure`，hover 用 `azure-bright`；主按钮文字用 `on-azure`（不要写死 `#fff`，dark 主题会失效）。
- `verified` + `verified-tint` + `verified-line` 只用于“已完成/已认证”；`warn` + `warn-tint` + `warn-line` 只用于“进行中”。两者都必须同时有文字或字形（✓ / ○ / 单词），不能只靠色相区分。
- `surface-tint` + `azure-line` 是“相关/延伸阅读”的底，例如 `related-box` 与 azure badge。
- **Dark 主题（补充）：** 所有颜色 token 都有 dark 值，按 `[data-theme="dark"]` 切换。azure 在 dark 中提亮到 `#5aa9e6`，所以主按钮文字随 `on-azure` 变为深色。

## 字体

- 三个 Google Fonts 托管字体，`display` = Space Grotesk 500/600/700，`body` = IBM Plex Sans 400/500/600，`mono` = IBM Plex Mono 400/500/600，一次性用一条 `fonts.googleapis.com` 链接加载（见 `components/bundle.css` 顶部）。
- 层级：`display-hero`（44px，移动端 `display-hero-mobile` 32px）→ `heading-section` 26px → `heading-card` 19px。标题行高统一 1.15，正文 1.6。
- 正文 16px `body`；卡片内 15px `body-card`；表格与 callout 14.5px `body-small`；按钮与 “View details →” 用 `ui-strong`。
- Mono 字号很小（11–14px），靠字距撑开：`eyebrow` 0.08em、`pill` 0.06em、`table-head` 0.05em。不要把 mono 用于超过一行的段落。
- 不要引入第四种字体，也不要用 Inter / Roboto 替代。

## 间距与布局

- 内容居中，`.wrap` 最大 `wrap-max`（920px），左右 gutter `space-24`。单列阅读体验，项目卡片也是单列网格（`card-grid`，间距 `space-20`）。
- 纵向节奏：section 上下 `space-64`（移动端 `space-48`），hero 顶部 `space-96`；section 之间用 `line` 分隔线，最后一个 section 无分隔线。
- 间距 token 以像素命名（`space-4` = 4px），源站使用的半步（6/10/14/18）都保留，不要四舍五入到 8px 网格。
- 唯一断点 `breakpoint-sm`（640px）。导航 sticky，高 `nav-height`，锚点用 `scroll-offset`（88px）避让。
- 行宽：导语 `measure-lede`（56ch），section 说明 `measure-section`（60ch），首页 h1 `measure-title`（15ch）。

## 描边、圆角、阴影

- 所有容器圆角 `radius`（10px）；tag 用 `radius-sm`（6px）；badge 与 pill 用 `radius-pill`。
- 描边统一 `border-hairline`（1px）。唯一的粗边是 `note-box` 左侧 `border-accent`（3px `azure`），只用于“方法/限制说明”，不要推广到其它卡片。
- 无阴影。需要抬升感时用 hover：`border-color: azure` + `translateY(-2px)`。

## 交互状态

- **Hover：** 链接 `azure` → `azure-bright` 并加下划线；导航链接只变色不加下划线；项目卡片描边变 `azure` 并上移 2px；次按钮描边与文字变 `azure`。
- **Focus：** 所有可聚焦元素 `focus-ring`（2px）实线 `azure-bright` 外框，offset 2px；在 `bg`、`surface` 上均 ≥3:1。
- **动效：** 只有 0.15s ease 的描边/位移过渡与平滑滚动；`prefers-reduced-motion: reduce` 时全部关闭（补充）。

## 图像与图表

- 截图放在 `evidence` 中：满宽、`line` 描边、`radius` 圆角，下接 `diagram-caption`。
- 架构与流程图用 Mermaid，放在 `diagram-block` 中（`surface` 底、`space-24` 内边距、可横向滚动）。
- 不使用装饰性照片、头像或插画。

## 图标

- 系统没有图标库，也没有 logo。品牌标识是纯文字标 **HanqinLyu**（`mark` 样式，`Lyu` 用 `azure`）。
- 仅有两个文字字形：`✓`（verified badge）与 `○`（pending badge），由 CSS `::before` 生成，不要手写进文本。
- 方向箭头 “→” 作为文字字符使用。如需真正的图标，请先补充图标系统，不要混用 emoji。

## 无障碍

- 主要文字对比度：`ink` ≥14:1，`ink-soft` ≥7:1，`ink-faint` ≥4.6:1（两个主题）。
- 已知差距（保留源站原值）：`line-strong` 作为次按钮与 pending badge 描边在 `surface` 上约 1.4:1，低于 3:1；这些控件靠文字可识别，若要改进，可将次按钮描边换为 `ink-faint`。
- 状态永远同时有文字：不要只用绿/橙色点表示状态。

## 补充项（本次完善）

- 新增 dark 主题，以及 `on-azure` 前景色 token。
- 把源站硬编码的颜色提升为 token：`azure-line`、`verified-line`、`warn`、`warn-tint`、`warn-line`、`warn-ink`、`warn-ink-strong`。
- 把项目页内联样式（`kpi`、`note-box`、`evidence`）收进组件。
- 形成完整的间距、圆角、布局 token，并加入 `prefers-reduced-motion` 处理。
- 状态词规范：用 `IN PROGRESS` 替代 “Loading...”。


## Token 参考

### 颜色

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg` | `#f7f9fc` | `#0b1220` | 页面底色（body）；也用作 tag 的填充色。 |
| `--surface` | `#ffffff` | `#111a2b` | 导航栏、项目卡片、KPI、图表框、次按钮、默认 badge 的底色。 |
| `--surface-tint` | `#eff6fc` | `#0f2238` | Azure 色调浅底：azure badge、related-box 的填充。 |
| `--ink` | `#101828` | `#f2f4f7` | 标题与正文主色，读于 bg / surface / surface-tint 上（≥14:1）。 |
| `--ink-soft` | `#475467` | `#b4bdcb` | 导语、卡片正文、导航链接、表格单元格；读于 bg / surface（≥7:1）。 |
| `--ink-faint` | `#667085` | `#8d97a8` | 辅助信息：tag、meta 行、表头、图注、页脚、pending badge；读于 bg / surface（≥4.6:1）。不要用于 surface-tint 以外的彩色底。 |
| `--line` | `#e4e7ec` | `#1f2a3d` | 装饰性分隔线与卡片描边（1px）。非功能性边框，不要求 3:1。 |
| `--line-strong` | `#d0d5dd` | `#2c3a52` | 次按钮描边、表头下边线、pending badge 的虚线描边。注意：在 surface 上约 1.4:1，低于控件边框 3:1 —— 源站原值保留，次按钮靠文字与 hover 色识别。 |
| `--azure` | `#115ea3` | `#5aa9e6` | 品牌主色：链接、主按钮底、eyebrow、nav-mark 的 Lyu、KPI 数字、卡片 hover 描边。链接读于 bg / surface（light 6.6:1，dark 6.6:1）。 |
| `--azure-bright` | `#0f6cbd` | `#7dbdf0` | hover 态（链接、主按钮）与焦点环（2px，offset 2px），在所有底色上 ≥3:1。 |
| `--on-azure` | `#ffffff` | `#0b1220` | 【补充】主按钮上的文字，读于 azure / azure-bright。dark 主题中 azure 变亮，故改用深色字。 |
| `--azure-line` | `#b8d9f0` | `#1f4a70` | 【补充，原为硬编码】azure badge 与 related-box 的描边。 |
| `--verified` | `#0b6e4f` | `#4fc79a` | “已验证/已完成”信号：verified badge、status pill 的文字；读于 verified-tint（light 5.9:1）。始终配合 ✓ 字形或文字，不单靠颜色。 |
| `--verified-tint` | `#e7f5ef` | `#0e2a22` | verified badge 与 status pill 的填充。 |
| `--verified-line` | `#bee3d2` | `#1e5a45` | 【补充，原为硬编码】verified badge 的描边。 |
| `--warn` | `#b45309` | `#f5a54a` | 【补充，原为硬编码】进行中状态：in-progress pill 文字、progress-banner 圆点；读于 warn-tint（light 4.6:1）。 |
| `--warn-tint` | `#fff3e0` | `#2a1d0c` | 【补充，原为硬编码】in-progress pill 与 progress-banner 的填充。 |
| `--warn-line` | `#ffd9a0` | `#5a3d14` | 【补充，原为硬编码】progress-banner 描边。 |
| `--warn-ink` | `#92400e` | `#f8c27a` | 【补充，原为硬编码】progress-banner 正文，读于 warn-tint（light 7.3:1）。 |
| `--warn-ink-strong` | `#78350f` | `#fcd9a8` | 【补充，原为硬编码】progress-banner 中的 strong 强调。 |

### 字体样式

| 样式 | 族 | 字号 / 行高 / 字重 | 字距 | 用途 |
|---|---|---|---|---|
| `display-hero` | display | 44px / 1.15 / 700 | -0.01em | 首页与项目页 hero 的 h1，max-width 15ch（项目页 24ch）。 |
| `display-hero-mobile` | display | 32px / 1.15 / 700 | -0.01em | ≤640px 时的 hero h1。 |
| `heading-section` | display | 26px / 1.15 / 700 | — | section-head 的 h2。 |
| `heading-card` | display | 19px / 1.15 / 700 | — | 项目卡片 h3。 |
| `kpi-figure` | display | 28px / 1.1 / 700 | — | KPI 数字，颜色 azure。 |
| `lede` | body | 18px / 1.6 / 400 | — | hero 导语，ink-soft，max-width 56ch。 |
| `body` | body | 16px / 1.6 / 400 | — | 默认正文。 |
| `body-card` | body | 15px / 1.6 / 400 | — | 卡片描述、decision-list 标题。 |
| `ui-strong` | body | 14.5px / 1.6 / 600 | — | 按钮、card-link、related-box 链接。 |
| `body-small` | body | 14.5px / 1.6 / 400 | — | 表格、callout 正文、decision-list 说明。 |
| `nav-link` | body | 14px / 1.6 / 500 | — | 导航链接，ink-soft，hover 变 azure 无下划线。 |
| `caption` | body | 13.5px / 1.6 / 400 | — | 图注，ink-faint。 |
| `kpi-label` | body | 13.5px / 1.4 / 400 | — | KPI 数字下的说明，ink-soft。 |
| `mark` | mono | 14px / 1.6 / 600 | 0.02em | 导航文字标（nav-mark），Lyu 用 azure。 |
| `eyebrow` | mono | 12.5px / 1.6 / 400 | 0.08em | hero 上方的眉标，大写，azure，前接 18px 短横线。 |
| `badge` | mono | 12.5px / 1.6 / 500 | 0.01em | 认证与技术 badge。 |
| `meta` | mono | 13px / 1.6 / 400 | — | 项目页 meta-row，ink-faint。 |
| `tag` | mono | 11.5px / 1.6 / 400 | — | 卡片技术标签，ink-faint 于 bg。 |
| `table-head` | mono | 11.5px / 1.6 / 400 | 0.05em | metrics / stack 表头，大写。 |
| `pill` | mono | 11px / 1.6 / 600 | 0.06em | status pill，大写单词。 |

### 间距

| Token | 值 | 用途 |
|---|---|---|
| `--space-4` | `4px` | status pill 纵向内边距；decision-list 标题下间距。 |
| `--space-6` | `6px` | badge 纵向内边距、badge 字形间隙、KPI 标签上间距。 |
| `--space-8` | `8px` | tag 间距、section-head p 上间距。 |
| `--space-10` | `10px` | badge 间距、eyebrow 横线间隙、pill 横向内边距、表头纵向内边距。 |
| `--space-12` | `12px` | badge 横向内边距、卡片标题下间距、表格单元格纵向内边距。 |
| `--space-14` | `14px` | CTA 间距、KPI 网格间距、表格单元格横向内边距。 |
| `--space-16` | `16px` | 卡片内段落/tag 行下间距、decision-list 行内边距、callout 纵向内边距。 |
| `--space-18` | `18px` | eyebrow 下间距、KPI 横向内边距。 |
| `--space-20` | `20px` | 卡片网格间距、按钮横向内边距、导语上间距、callout 横向内边距、内容块上边距。 |
| `--space-24` | `24px` | 页面左右 gutter、diagram-block 内边距、related-box 横向内边距。 |
| `--space-28` | `28px` | 项目卡片内边距、badge 行上间距、导航链接间距、KPI 行上间距。 |
| `--space-32` | `32px` | progress-banner 下间距。 |
| `--space-36` | `36px` | CTA 行上间距、section-head 下间距。 |
| `--space-40` | `40px` | 页脚上内边距。 |
| `--space-48` | `48px` | 移动端 section 纵向内边距、移动端 hero 底部。 |
| `--space-64` | `64px` | section 纵向内边距、桌面 hero 底部、移动端 hero 顶部。 |
| `--space-96` | `96px` | 桌面 hero 顶部内边距。 |

### 圆角

| Token | 值 | 用途 |
|---|---|---|
| `--radius` | `10px` | 按钮、项目卡片、KPI、diagram-block、callout、截图框。 |
| `--radius-sm` | `6px` | tag。 |
| `--radius-pill` | `999px` | badge 与 status pill。 |
| `--radius-round` | `50%` | progress-banner 的状态圆点。 |

### 布局

| Token | 值 | 用途 |
|---|---|---|
| `--wrap-max` | `920px` | .wrap 最大宽度。 |
| `--nav-height` | `64px` | sticky 导航高度。 |
| `--scroll-offset` | `88px` | [id] 的 scroll-margin-top，避免锚点被导航遮挡。 |
| `--breakpoint-sm` | `640px` | 唯一断点：≤640px 缩小 hero 与 section 间距。 |
| `--border-hairline` | `1px` | 所有描边与分隔线。 |
| `--border-accent` | `3px` | note-box 左侧强调边（仅此一处）。 |
| `--focus-ring` | `2px` | 焦点环宽度与 offset，颜色 azure-bright。 |
| `--measure-lede` | `56ch` | hero 导语最大行宽。 |
| `--measure-section` | `60ch` | section-head 说明最大行宽。 |
| `--measure-title` | `15ch` | 首页 hero h1 最大宽度（项目页 24ch）。 |

### 字体族

| 变量 | 栈 |
|---|---|
| `--font-display` | `"Space Grotesk", sans-serif` |
| `--font-body` | `"IBM Plex Sans", sans-serif` |
| `--font-mono` | `"IBM Plex Mono", monospace` |

## 组件

| 组件 | 分组 | 说明 |
|---|---|---|
| `Badge` | Identity | 认证与技术栈的胶囊标签，系统的签名元素，有 default / azure / verified / pending 四态。 |
| `Button` | Actions | 两种按钮：主按钮（azure 实底）与次按钮（surface 描边）。 |
| `Callout` | Content | 三种提示框：related-box（相关项目）、note-box（方法/限制说明）、progress-banner（进行中提示）。 |
| `DataTable` | Content | 项目页的 metrics / stack 表格：mono 大写表头，首列加深。 |
| `DecisionList` | Content | 设计决策记录：每项一个粗体结论 + 一句理由，行间 `line` 分隔。 |
| `DiagramBlock` | Content | Mermaid 图或截图的承载框，下接图注。 |
| `Eyebrow` | Identity | 标题上方的 mono 大写眉标，前接 18px 的 azure 短横线。 |
| `Hero` | Layout | 页面开头：eyebrow + h1 + 导语 + badge 行 + CTA 行。 |
| `Kpi` | Content | 项目页的关键指标格：大号 azure 数字 + 一行说明。 |
| `MetaRow` | Content | 项目页 hero 下的 mono 元信息行（时间、平台、角色）。 |
| `ProjectCard` | Content | 首页的项目卡片：标题 + 状态胶囊 + 描述 + tag 行 + “View details →”。整张卡是一个链接。 |
| `SectionHead` | Layout | section 的 h2 与一段说明。 |
| `SiteFooter` | Layout | 页脚：版权与 GitHub / LinkedIn / Email 链接，用 “·” 分隔。 |
| `SiteNav` | Layout | 顶部 sticky 导航：左侧文字标 HanqinLyu，右侧 2–3 个文字链接。 |
| `StatusPill` | Identity | 项目卡片右上角的状态胶囊：一个大写单词说明项目对安全做了什么。 |
| `Tag` | Identity | 项目卡片底部的技术关键词，比 badge 更轻。 |

每个组件的完整用法见在线版；类名与样式见 `style.css`（补充项的 token 化版本见在线版 `components/bundle.css`）。
