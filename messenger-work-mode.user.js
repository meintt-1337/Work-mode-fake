// ==UserScript==
// @name         Work Mode Fake
// @namespace    https://github.com/meintt-1337/Work-mode-fake
// @version      1.5.0
// @description  Khoác giao diện hộp thư Gmail lên Messenger web
// @match        https://www.messenger.com/*
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/meintt-1337/Work-mode-fake/main/messenger-work-mode.user.js
// @downloadURL  https://raw.githubusercontent.com/meintt-1337/Work-mode-fake/main/messenger-work-mode.user.js
// ==/UserScript==

/*
 * Bản userscript (chỉ giao diện Gmail) của MegaKorea/Work-mode-fake — MIT License.
 * Giữ nguyên LICENSE của repo gốc. Icon: Material Icons (Apache 2.0).
 * Gmail và logo Gmail là nhãn hiệu của Google LLC; dự án không liên kết với Google hay Meta.
 *
 * Khác bản tiện ích Chrome:
 *  - Không có popup: dùng menu Tampermonkey (bấm icon Tampermonkey khi đang ở trang Messenger).
 *  - Không nhúng font Roboto / Be Vietnam Pro: dùng font hệ thống.
 *  - Không có giao diện Outlook.
 */
(function () {
  'use strict';
  if (window.top !== window) return;

  const GMS = {};

  // ================================================================
  // 1. CSS (nhúng thẳng, không tải file ngoài)
  // ================================================================

  // ---- tokens.css + page.css + thread.css: áp dụng lên trang ----
  const PAGE_CSS = String.raw`
html.gms-on {
  --md-primary: #0b57d0;
  --md-on-primary: #ffffff;
  --md-primary-container: #d3e3fd;
  --md-on-primary-container: #041e49;
  --md-tertiary-container: #c2e7ff;
  --md-on-tertiary-container: #001d35;
  --md-error: #b3261e;
  --md-star: #f4b400;

  --md-surface: #f6f8fc;
  --md-surface-container-lowest: #ffffff;
  --md-surface-container-low: #f2f6fc;
  --md-surface-container: #f0f4f9;
  --md-surface-container-high: #e9eef6;
  --md-surface-container-highest: #dde3ea;
  --md-on-surface: #1f1f1f;
  --md-on-surface-variant: #444746;
  --md-outline: #747775;
  --md-outline-variant: #c4c7c5;
  --md-scrim: rgba(0, 0, 0, .32);

  --md-state-hover: rgba(68, 71, 70, .08);
  --md-state-pressed: rgba(68, 71, 70, .12);

  --md-shape-xs: 4px;
  --md-shape-sm: 8px;
  --md-shape-md: 12px;
  --md-shape-lg: 16px;
  --md-shape-xl: 28px;
  --md-shape-full: 999px;

  --md-elevation-1: 0 1px 2px rgba(0, 0, 0, .3), 0 1px 3px 1px rgba(0, 0, 0, .15);
  --md-elevation-2: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px 2px rgba(0, 0, 0, .15);
  --md-elevation-3: 0 1px 3px rgba(0, 0, 0, .3), 0 4px 8px 3px rgba(0, 0, 0, .15);

  --md-ease: cubic-bezier(.2, 0, 0, 1);
  --md-ease-emphasized: cubic-bezier(.3, 0, 0, 1);
  --md-dur-short: 150ms;
  --md-dur-medium: 250ms;

  --md-font-brand: "Google Sans", "Be Vietnam Pro", Roboto, "Segoe UI", Arial, sans-serif;
  --md-font-plain: Roboto, "Segoe UI", Arial, sans-serif;
}

html.gms-boot body { opacity: 0 !important; }
html.gms-boot { background: #f6f8fc !important; }

html.gms-on {
  --gms-top: 64px;
  --gms-side: 252px;
  --gms-head: 116px;
  --gms-reply-h: 110px;
}
html.gms-on.gms-collapsed { --gms-side: 72px; }
html.gms-on, html.gms-on body { background: var(--md-surface) !important; }

#gms-shell { display: none !important; }
html.gms-on #gms-shell {
  display: block !important;
  position: fixed !important; inset: 0 !important;
  z-index: 2147483000 !important;
  pointer-events: none !important;
  visibility: hidden;
}
html.gms-on #gms-shell.gms-ready { visibility: visible; }

html.gms-on .gms-main {
  position: fixed !important;
  top: calc(var(--gms-top) + var(--gms-head)) !important;
  left: var(--gms-side) !important;
  right: 16px !important;
  bottom: 16px !important;
  width: auto !important; height: auto !important;
  min-width: 0 !important; min-height: 0 !important;
  max-width: none !important; max-height: none !important;
  margin: 0 !important; transform: none !important;
  z-index: 1 !important;
  background: var(--md-surface-container-lowest) !important;
  border-radius: 0 0 var(--md-shape-lg) var(--md-shape-lg) !important;
  overflow: hidden !important;
  padding-left: 56px !important;
  box-sizing: border-box !important;
  font-family: var(--md-font-plain) !important;
  color-scheme: light !important;
  --primary-text: var(--md-on-surface); --secondary-text: var(--md-on-surface-variant); --placeholder-text: #5f6368;
  --accent: var(--md-primary); --blue-link: var(--md-primary); --primary-button-background: var(--md-primary);
  --primary-icon: var(--md-on-surface-variant); --secondary-icon: var(--md-on-surface-variant); --disabled-icon: var(--md-outline-variant);
  --comment-background: var(--md-surface-container); --surface-background: #fff; --card-background: #fff;
  --web-wash: #fff; --wash: var(--md-surface-container); --messenger-card-background: #fff;
  --chat-composer-button-color: var(--md-on-surface-variant); --mwp-primary-theme-color: var(--md-primary);
  --divider: #e0e0e0; --media-inner-border: #e0e0e0;
}
html.gms-on:not(.gms-thread) .gms-main { visibility: hidden !important; }
html.gms-on.gms-thread .gms-main { clip-path: inset(100% 0 0 0) !important; pointer-events: none !important; }
html.gms-on.gms-thread.gms-unclip .gms-main { clip-path: none !important; }
html.gms-on .gms-main * { font-family: inherit !important; }
html.gms-on .gms-unx {
  transform: none !important; filter: none !important; perspective: none !important;
  contain: none !important; will-change: auto !important; backdrop-filter: none !important;
}
html.gms-on .gms-hidelist,
html.gms-on [role="banner"]:not(:has(.gms-main)),
html.gms-on [role="complementary"]:not(:has(.gms-main)) {
  opacity: 0 !important; pointer-events: none !important;
}
html.gms-on .gms-hide { display: none !important; }

html.gms-on .gms-main .gms-flat { background: #fff !important; background-image: none !important; }
html.gms-on .gms-main .gms-bubble {
  background: var(--md-surface-container) !important; background-image: none !important;
  color: var(--md-on-surface) !important;
}
html.gms-on .gms-main .gms-bubble.gms-out { background: var(--md-primary-container) !important; }
html.gms-on .gms-main .gms-bubble,
html.gms-on .gms-main .gms-bubble * { color: var(--md-on-surface) !important; }
html.gms-on .gms-main .gms-bubble a,
html.gms-on .gms-main .gms-bubble a * { color: var(--md-primary) !important; }

html.gms-on .gms-main .gms-composer {
  background: var(--md-surface-container-lowest) !important; background-image: none !important;
  border: 1px solid var(--md-outline-variant) !important; border-radius: var(--md-shape-xl) !important;
  transition: border-color var(--md-dur-short) var(--md-ease), box-shadow var(--md-dur-short) var(--md-ease);
}
html.gms-on .gms-main .gms-composer:focus-within {
  border-color: var(--md-primary) !important; box-shadow: 0 0 0 1px var(--md-primary);
}
html.gms-on .gms-main [contenteditable="true"][role="textbox"] { color: var(--md-on-surface) !important; }

html.gms-on .gms-main ::-webkit-scrollbar { width: 16px; height: 16px; }
html.gms-on .gms-main ::-webkit-scrollbar-thumb { background: rgba(31, 31, 31, .2); border: 4px solid transparent; background-clip: padding-box; border-radius: 8px; }
html.gms-on .gms-main ::-webkit-scrollbar-track { background: #fff !important; }
`;

  // ---- shell.css: nằm trong Shadow DOM ----
  const SHELL_CSS = String.raw`
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; }

.gms-app {
  position: absolute; inset: 0;
  pointer-events: none;
  color: var(--md-on-surface);
  font: 400 14px/20px var(--md-font-plain);
  -webkit-font-smoothing: antialiased;
  text-align: left; letter-spacing: normal;
}
.gms-app > * { pointer-events: auto; }
button { font: inherit; color: inherit; background: none; border: 0; margin: 0; padding: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }
:is(button, a, .gms-row, .gms-cb):focus-visible { outline: 2px solid var(--md-primary); outline-offset: -2px; }

.gms-ico { width: 24px; height: 24px; fill: currentColor; flex: none; display: block; }
.gms-spacer { flex: 1; }

.gms-ib {
  width: 48px; height: 48px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  color: #444746; flex: none;
  transition: background-color .15s;
}
.gms-ib:hover { background: rgba(68, 71, 70, .08); }
.gms-ib:active { background: rgba(68, 71, 70, .12); }
.gms-ib.sm { width: 40px; height: 40px; }
.gms-ib.sm .gms-ico { width: 20px; height: 20px; }
.gms-ib[disabled] { opacity: .38; cursor: default; }
.gms-ib[disabled]:hover { background: none; }

.gms-top {
  position: absolute; top: 0; left: 0; right: 0; height: var(--gms-top);
  display: flex; align-items: center; padding: 8px 12px 8px 8px;
  background: var(--md-surface);
}
.gms-top-left { display: flex; align-items: center; width: calc(var(--gms-side) - 8px); min-width: 230px; flex: none; }
.gms-logo { display: flex; align-items: center; gap: 12px; margin-left: 4px; height: 48px; }
.gms-logo-mark { width: 30px; height: 22.5px; flex: none; }
.gms-logo span { font: 500 21px/24px var(--md-font-brand); color: #5f6368; letter-spacing: -.2px; }

.gms-search {
  flex: 1 1 auto; max-width: 720px; height: 48px;
  display: flex; align-items: center; padding: 0 4px;
  background: #eaf1fb; border-radius: 24px;
  transition: background-color .15s, box-shadow .15s;
}
.gms-search:focus-within { background: #fff; box-shadow: 0 1px 1px 0 rgba(65, 69, 73, .3), 0 1px 3px 1px rgba(65, 69, 73, .15); }
.gms-search input {
  flex: 1; min-width: 0; height: 46px; padding: 0 4px; margin: 0;
  border: 0; outline: 0; background: transparent; box-shadow: none;
  font: 400 16px/24px var(--md-font-plain); color: var(--md-on-surface);
}
.gms-search input::placeholder { color: #5f6368; opacity: 1; }

.gms-top-right { display: flex; align-items: center; margin-left: auto; padding-left: 16px; }
.gms-spark { width: 24px; height: 24px; }
.gms-upgrade {
  width: 108px; height: 40px; margin: 0 8px; padding: 0 16px; flex: none;
  border-radius: 20px; background: #d3e3fd; color: #041e49;
  font: 500 14px/20px var(--md-font-brand); letter-spacing: .1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;
  transition: box-shadow .15s;
}
.gms-upgrade:hover { box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .3), 0 1px 3px 1px rgba(60, 64, 67, .15); }
.gms-avatar {
  width: 32px; height: 32px; margin: 0 8px 0 4px; border-radius: 50%; flex: none;
  background: #1e8e3e; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font: 600 14px/1 var(--md-font-brand); cursor: pointer;
  box-shadow: 0 0 0 4px var(--md-surface);
}

.gms-side {
  position: absolute; top: var(--gms-top); left: 0; bottom: 0; width: var(--gms-side);
  background: var(--md-surface); overflow: hidden auto; padding-right: 16px;
}
.gms-compose {
  display: inline-flex; align-items: center; gap: 12px;
  height: 56px; min-width: 56px; margin: 8px 0 16px 5px; padding: 0 20px 0 16px;
  background: #c2e7ff; color: #001d35;
  border-radius: 16px; font: 500 14px/20px var(--md-font-brand); letter-spacing: .25px; white-space: nowrap;
  transition: box-shadow .15s;
}
.gms-compose:hover { box-shadow: 0 1px 3px 0 rgba(60, 64, 67, .3), 0 4px 8px 3px rgba(60, 64, 67, .15); }
.gms-compose .gms-ico { width: 24px; height: 24px; }

.gms-folder {
  display: flex; align-items: center; height: 32px;
  padding: 0 12px 0 22px; border-radius: 0 16px 16px 0;
  color: #1f1f1f; font: 400 14px/20px var(--md-font-plain); cursor: pointer;
}
.gms-folder .gms-ico { width: 20px; height: 20px; margin-right: 18px; color: #444746; }
.gms-folder .gms-fname { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gms-folder .gms-count { font-size: 12px; letter-spacing: .2px; color: #444746; }
.gms-folder:hover { background: #e8eaed; }
.gms-folder.on { background: #d3e3fd; font-weight: 700; color: #001d35; }
.gms-folder.on .gms-ico, .gms-folder.on .gms-count { color: #001d35; }
.gms-folder.on .gms-count { font-weight: 700; }
.gms-labels-h {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 20px; padding: 0 4px 0 22px;
  font: 500 16px/24px var(--md-font-brand); color: #1f1f1f;
}

:host(.gms-collapsed) .gms-side { padding-right: 0; }
:host(.gms-collapsed) .gms-compose { padding: 0; width: 56px; justify-content: center; margin-left: 8px; }
:host(.gms-collapsed) .gms-compose span,
:host(.gms-collapsed) .gms-fname,
:host(.gms-collapsed) .gms-count,
:host(.gms-collapsed) .gms-labels-h { display: none; }
:host(.gms-collapsed) .gms-folder { width: 56px; margin-left: 8px; padding: 0; justify-content: center; border-radius: 16px; }
:host(.gms-collapsed) .gms-folder .gms-ico { margin: 0; }
:host(.gms-collapsed) .gms-top-left { width: auto; min-width: 0; }
@media (max-width: 900px) { .gms-upgrade { display: none; } }
@media (max-width: 700px) { .gms-logo span, .gms-top-right .gms-ib { display: none; } }

.gms-gutter-r { position: absolute; top: var(--gms-top); right: 0; bottom: 0; width: 16px; background: var(--md-surface); }
.gms-gutter-b { position: absolute; left: var(--gms-side); right: 0; bottom: 0; height: 16px; background: var(--md-surface); }

.gms-card {
  position: absolute; top: var(--gms-top); left: var(--gms-side); right: 16px; bottom: 16px;
  background: #fff; border-radius: 16px; overflow: hidden;
  display: flex; flex-direction: column;
}
.gms-listview, .gms-threadview { display: flex; flex-direction: column; min-height: 0; }
.gms-listview { flex: 1; }
:host(.gms-thread) .gms-card { background: transparent; overflow: visible; pointer-events: none; }
:host(.gms-thread) .gms-listview { display: none; }
:host(:not(.gms-thread)) .gms-threadview { display: none; }
.gms-threadview { pointer-events: auto; background: #fff; border-radius: 16px 16px 0 0; height: var(--gms-head); flex: none; }

.gms-toolbar { display: flex; align-items: center; height: 48px; padding: 0 12px 0 16px; flex: none; color: #444746; }
.gms-range { font-size: 12px; line-height: 16px; color: #444746; margin-right: 10px; white-space: nowrap; letter-spacing: .3px; }
.gms-sep { width: 1px; height: 20px; background: #c4c7c5; margin: 0 8px; }
.gms-caret { width: 20px; margin-right: 0; }
.gms-caret .gms-ico { width: 20px; height: 20px; }
.gms-first { margin-left: 11px; }
.gms-input-tools { width: 48px; gap: 0; font-size: 15px; margin-left: 4px; }
.gms-input-tools span { font: 500 15px/1 var(--md-font-plain); text-decoration: underline; text-underline-offset: 2px; }
.gms-input-tools .gms-ico { width: 20px; height: 20px; }

.gms-cb {
  width: 18px; height: 18px; margin: 0 11px; flex: none; position: relative;
  border: 2px solid #5f6368; border-radius: 2px; cursor: pointer; display: inline-block;
}
.gms-cb.on { background: #444746; border-color: #444746; }
.gms-cb.on::after {
  content: ""; position: absolute; left: 4px; top: 0; width: 5px; height: 10px;
  border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg);
}
.gms-cb-all { margin-left: 1px; margin-right: 0; }

.gms-tabs { display: flex; height: 56px; border-bottom: 1px solid #f1f3f4; flex: none; }
.gms-tab {
  width: 254px; max-width: 25%; min-width: 0; display: flex; align-items: center; gap: 16px;
  padding: 0 16px; color: #444746; font: 500 14px/20px var(--md-font-brand); letter-spacing: .1px;
  position: relative; cursor: default; white-space: nowrap;
}
.gms-tab span { overflow: hidden; text-overflow: ellipsis; }
.gms-tab:hover { background: #f1f3f4; }
.gms-tab .gms-ico { width: 20px; height: 20px; }
.gms-tab.on { color: #0b57d0; }
.gms-tab.on:hover { background: transparent; }
.gms-tab.on::after { content: ""; position: absolute; left: 8px; right: 8px; bottom: 0; height: 3px; border-radius: 3px 3px 0 0; background: #0b57d0; }

.gms-scroll { flex: 1; min-height: 0; overflow-y: auto; }

.gms-row {
  display: flex; align-items: center; height: 40px; padding: 0 16px 0 0;
  background: #f2f6fc; border-bottom: 1px solid rgba(100, 121, 143, .12);
  cursor: pointer; position: relative; color: #1f1f1f;
}
.gms-row.is-unread { background: #fff; }
.gms-row.is-checked { background: #c2dbff; }
.gms-row:hover { box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60, 64, 67, .3), 0 1px 3px 1px rgba(60, 64, 67, .15); z-index: 2; }
.gms-row .gms-cb { margin: 0 11px 0 17px; border-color: #c4c7c5; }
.gms-row:hover .gms-cb { border-color: #5f6368; }
.gms-row .gms-cb.on { border-color: #444746; }
.gms-star { width: 20px; height: 20px; margin-right: 10px; display: inline-flex; align-items: center; justify-content: center; color: #c4c7c5; flex: none; }
.gms-star .gms-ico { width: 20px; height: 20px; }
.gms-row:hover .gms-star { color: #5f6368; }
.gms-star.on, .gms-row:hover .gms-star.on { color: #f4b400; }
.gms-sender { width: 200px; flex: none; padding-right: 32px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1f1f1f; font-size: 14px; }
.gms-line { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #5e5e5e; font-size: 14px; }
.gms-subj { color: #1f1f1f; }
.gms-date { flex: none; width: 76px; text-align: right; font: 400 12px/16px var(--md-font-plain); color: #5e5e5e; letter-spacing: .3px; }
.gms-row.is-unread .gms-sender,
.gms-row.is-unread .gms-subj,
.gms-row.is-unread .gms-date { font-weight: 700; color: #1f1f1f; }
.gms-acts { display: none; position: absolute; right: 8px; top: 0; height: 40px; align-items: center; background: inherit; padding-left: 8px; }
.gms-row:hover .gms-acts, .gms-row:focus-visible .gms-acts { display: flex; }
.gms-row:hover .gms-date, .gms-row:focus-visible .gms-date { visibility: hidden; }

.gms-empty { padding: 48px 24px; text-align: center; color: #444746; font-size: 14px; }
.gms-foot {
  display: flex; justify-content: space-between; gap: 24px;
  padding: 16px 24px 24px; font-size: 12px; line-height: 16px; color: #5e5e5e;
}
.gms-foot span:last-child { text-align: right; }

.gms-subjectbar { display: flex; align-items: center; height: 68px; padding: 0 16px 0 72px; gap: 12px; }
.gms-subjectbar .gms-h2 {
  font: 500 22px/28px var(--md-font-brand); color: #1f1f1f;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;
}
.gms-chip {
  flex: none; display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 4px 0 8px;
  background: #ddd; border-radius: 4px; font-size: 12px; color: #444746;
}
.gms-chip i { font-style: normal; font-size: 13px; padding: 0 2px; cursor: pointer; }

::-webkit-scrollbar { width: 16px; height: 16px; }
::-webkit-scrollbar-thumb { background: rgba(31, 31, 31, .2); border: 4px solid transparent; background-clip: padding-box; border-radius: 8px; }
::-webkit-scrollbar-thumb:hover { background-color: rgba(31, 31, 31, .35); }
::-webkit-scrollbar-track { background: transparent; }

.gms-conv {
  position: absolute; left: 0; right: 0; top: var(--gms-head); bottom: 0;
  background: #fff; border-radius: 0 0 16px 16px;
  overflow-y: auto; overflow-anchor: none; pointer-events: auto; display: none;
}
:host(.gms-thread) .gms-conv { display: block; }
.gms-conv-in { padding: 0 24px 32px 72px; }

.gms-sum {
  display: inline-flex; align-items: center; gap: 8px; height: 36px; margin: 0 0 12px;
  padding: 0 16px 0 12px; border: 1px solid #747775; border-radius: 18px; background: #fff;
  font: 500 14px/20px var(--md-font-brand); color: #1f1f1f;
}
.gms-sum .gms-ico { width: 20px; height: 20px; }
.gms-sum:hover { background: #f6f8fc; }
.gms-sum + .gms-sum { margin-left: 8px; }

.gms-msg {
  display: flex; align-items: center; gap: 16px; padding: 10px 0;
  border-top: 1px solid #e8eaed; cursor: pointer;
}
.gms-msg.open { align-items: flex-start; cursor: default; padding: 14px 0 8px; }
.gms-msg a { color: #0b57d0; text-decoration: none; }
.gms-msg a:hover { text-decoration: underline; }
.gms-av {
  width: 40px; height: 40px; border-radius: 50%; flex: none; object-fit: cover;
  background: #5f6368; color: #fff; display: flex; align-items: center; justify-content: center;
  font: 500 16px/1 var(--md-font-brand);
}
.gms-av.me { background: #1e8e3e; }
.gms-msg-b { flex: 1; min-width: 0; }
.gms-msg-n { font-weight: 700; color: #1f1f1f; }
.gms-msg-s { color: #5e5e5e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gms-msg-t { flex: none; font: 400 12px/16px var(--md-font-plain); color: #5e5e5e; letter-spacing: .3px; }
.gms-mstar { flex: none; width: 20px; height: 20px; color: #5f6368; display: inline-flex; }
.gms-mstar .gms-ico { width: 20px; height: 20px; }
.gms-msg-top { display: flex; align-items: baseline; gap: 6px; }
.gms-msg-top .gms-msg-t { margin-right: 44px; }
.gms-msg-e { font-size: 12px; color: #5e5e5e; }
.gms-msg-to { font-size: 12px; color: #5e5e5e; margin-bottom: 14px; }
.gms-msg-body { font-size: 14px; line-height: 20px; color: #1f1f1f; white-space: pre-wrap; word-break: break-word; }
.gms-msg-body > div { margin-bottom: 14px; }
.gms-quote { margin-top: 18px; font-size: 13px; color: #1f1f1f; }
.gms-dots { display: inline-block; margin-top: 8px; padding: 0 6px; background: #e8eaed; border-radius: 4px; font-size: 12px; line-height: 14px; color: #5f6368; }
.gms-replybar { display: flex; gap: 12px; margin: 24px 0 8px; }
.gms-rb {
  display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 20px 0 16px;
  border: 1px solid #747775; border-radius: 20px; background: #fff;
  font: 500 14px/20px var(--md-font-brand); color: #1f1f1f;
}
.gms-rb.round { width: 40px; padding: 0; justify-content: center; }
.gms-rb:hover { background: #f6f8fc; }
.gms-rb .gms-ico { width: 20px; height: 20px; }

:host(.gms-reply) .gms-replybar { display: none; }
.gms-replybox { display: none; margin: 0 24px 32px 72px; padding: 12px 16px; border: 1px solid #c4c7c5; border-radius: 16px; background: #fff; box-shadow: 0 1px 3px rgba(60,64,67,.2); }
:host(.gms-reply) .gms-replybox { display: block; }
.gms-replyto { font-size: 12px; color: #5e5e5e; margin-bottom: 8px; }
.gms-replybox textarea { display: block; width: 100%; min-height: 72px; max-height: 240px; resize: vertical; border: 0; outline: 0; background: transparent; font: 400 14px/20px var(--md-font-plain); color: #1f1f1f; }
.gms-replybar2 { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.gms-send { height: 36px; padding: 0 24px; border-radius: 18px; background: #0b57d0; color: #fff; font: 500 14px/20px var(--md-font-brand); }
.gms-send:hover { box-shadow: 0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15); }
.gms-media { display: inline-block; position: relative; margin: 4px 8px 8px 0; border-radius: 12px; overflow: hidden; cursor: pointer; background: #f1f3f4; vertical-align: top; }
.gms-media img { display: block; max-width: 320px; max-height: 260px; object-fit: cover; }
.gms-media.vid .gms-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.25); color: #fff; }
.gms-media.vid .gms-play .gms-ico { width: 48px; height: 48px; }
.gms-media.nopost { width: 240px; height: 140px; background: #444746; }
.gms-files { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.gms-files:empty { display: none; }
.gms-fchip { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 4px 0 10px; background: #e8eaed; border-radius: 12px; font-size: 12px; color: #1f1f1f; max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.gms-fchip i { font-style: normal; cursor: pointer; padding: 0 4px; }
`;

  const addPageCss = (css) => {
    try { if (typeof GM_addStyle === 'function') { GM_addStyle(css); return; } } catch (e) { /* dùng cách dự phòng */ }
    const st = document.createElement('style');
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  };

  function attachShadowCss(sr) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(SHELL_CSS);
      sr.adoptedStyleSheets = [sheet];
    } catch (e) {
      const st = document.createElement('style');
      st.textContent = SHELL_CSS;
      sr.prepend(st);
    }
  }

  // ================================================================
  // 2. CÀI ĐẶT (thay cho popup + chrome.storage)
  // ================================================================
  // Sửa giá trị mặc định ở đây, hoặc dùng menu Tampermonkey để đổi nhanh.
  const DEFAULTS = Object.freeze({
    enabled: true,
    avatar: 'M',
    myAvatar: '', // URL ảnh đại diện của bạn trong khung thư (để trống = dùng chữ cái)
    titleTpl: 'Hộp thư đến ({n}) - Gmail', // {n} = số chat chưa đọc
    favicon: true,
    hideThreadHeader: true,
    forceLight: true, // ép Messenger sang nền sáng (khung chat dễ đổi màu hơn)
  });

  const gmGet = (k, d) => { try { return typeof GM_getValue === 'function' ? GM_getValue(k, d) : d; } catch (e) { return d; } };
  const gmSet = (k, v) => { try { if (typeof GM_setValue === 'function') GM_setValue(k, v); } catch (e) { /* bỏ qua */ } };

  GMS.DEFAULTS = DEFAULTS;
  GMS.root = document.documentElement;
  GMS.settings = { ...DEFAULTS, ...(gmGet('gms_settings', {}) || {}) };
  GMS.stars = gmGet('gms_stars', {}) || {}; // { [đường dẫn đoạn chat]: 1 }
  GMS.ui = { shell: null };
  GMS.state = {
    mode: 'list', // 'list' | 'thread'
    folder: 'inbox',
    query: '',
    threads: [],
    current: null,
    collapsedManual: false,
    lastHtml: '',
    checked: new Set(),
    reply: false,
    expanded: new Set(),
    lastConv: '',
    stickUntil: 0,
  };
  GMS.msgs = [];

  GMS.isMsgPage = () =>
    /(^|\.)messenger\.com$/.test(location.hostname) ||
    /^\/messages(\/|$)/.test(location.pathname);
  GMS.active = () => GMS.settings.enabled && GMS.isMsgPage();

  // Gán innerHTML, có đường dự phòng nếu trang bật Trusted Types.
  let ttPolicy = null;
  GMS.setHtml = (el, html) => {
    try { el.innerHTML = html; }
    catch (e) {
      try {
        if (window.trustedTypes && !ttPolicy) ttPolicy = window.trustedTypes.createPolicy('gms-skin', { createHTML: (s) => s });
      } catch (e2) { /* bỏ qua */ }
      el.innerHTML = ttPolicy ? ttPolicy.createHTML(html) : html;
    }
  };

  // ================================================================
  // 3. ICON, LOGO, FAVICON
  // ================================================================
  const PATHS = {
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    search: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    help: 'M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z',
    settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    apps: 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    inbox: 'M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5a2 2 0 00-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z',
    star_border: 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
    star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    expand: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    refresh: 'M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    left: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    right: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    archive: 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z',
    report: 'M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z',
    del: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    markread: 'M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z',
    unread: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    print: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z',
    open: 'M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
    promo: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
    social: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    send_o: 'M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z',
    draft_o: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z',
    bag: 'M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z',
    info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    drop: 'M7 10l5 5 5-5z',
    reply: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',
    forward: 'M12 8V4l8 8-8 8v-4H4V8z',
    mood: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
    play: 'M8 5v14l11-7z',
    attach: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
  };

  GMS.ico = (name, cls = '') =>
    `<svg class="gms-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${PATHS[name]}"/></svg>`;

  const GMAIL_PATHS =
    '<path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>' +
    '<path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>' +
    '<path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>' +
    '<path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>' +
    '<path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>';
  GMS.LOGO = `<svg class="gms-logo-mark" viewBox="52 42 88 66" aria-hidden="true">${GMAIL_PATHS}</svg>`;

  GMS.SPARKLE =
    '<svg class="gms-ico gms-spark" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="gms-g" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0" stop-color="#1c7dff"/><stop offset=".55" stop-color="#4f8cf5"/><stop offset="1" stop-color="#a07cf0"/></linearGradient></defs>' +
    '<path fill="url(#gms-g)" d="M12 1.5c.6 6.2 4.3 9.9 10.5 10.5-6.2.6-9.9 4.3-10.5 10.5-.6-6.2-4.3-9.9-10.5-10.5C7.7 11.4 11.4 7.7 12 1.5z"/></svg>';

  GMS.FAVICON = 'data:image/svg+xml,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66">${GMAIL_PATHS}</svg>`);

  // ================================================================
  // 4. TIỆN ÍCH: escape HTML, bỏ dấu, định dạng số và thời gian
  // ================================================================
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  GMS.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

  GMS.fold = (s) =>
    String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();

  GMS.fmtN = (n) => n.toLocaleString('vi-VN');

  const pad = (n) => String(n).padStart(2, '0');

  function fmtDate(d) {
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if (d.getFullYear() === now.getFullYear()) return `${d.getDate()} thg ${d.getMonth() + 1}`;
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  const MS = { minute: 6e4, hour: 36e5, day: 864e5, week: 6048e5, month: 2592e6, year: 31536e6 };
  const UNIT_OF = [
    [/^(phút|m|min|mins)$/, MS.minute],
    [/^(giờ|h|hr|hrs)$/, MS.hour],
    [/^(ngày|d)$/, MS.day],
    [/^(tuần|w|wk)$/, MS.week],
    [/^(tháng|mo)$/, MS.month],
  ];
  const WEEKDAY = {
    cn: 0, 'th 2': 1, 'th 3': 2, 'th 4': 3, 'th 5': 4, 'th 6': 5, 'th 7': 6,
    th2: 1, th3: 2, th4: 3, th5: 4, th6: 5, th7: 6,
    sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
  };

  GMS.toDateLabel = (t) => {
    if (!t) return '';
    const s = t.trim().toLowerCase();
    if (/^(vừa xong|now|just now)$/.test(s)) return fmtDate(new Date());

    const rel = s.match(/^(\d+)\s*(phút|m|min|mins|giờ|h|hr|hrs|ngày|d|tuần|w|wk|tháng|mo|năm|y|yr)$/);
    if (rel) {
      const unit = (UNIT_OF.find(([re]) => re.test(rel[2])) || [, MS.year])[1];
      return fmtDate(new Date(Date.now() - +rel[1] * unit));
    }
    if (s in WEEKDAY) {
      const d = new Date();
      d.setDate(d.getDate() - ((d.getDay() - WEEKDAY[s] + 7) % 7 || 7));
      return fmtDate(d);
    }
    const clock = t.match(/^(\d{1,2}):(\d{2})\s?([AP]M)?/i);
    if (clock) {
      let h = +clock[1];
      if (clock[3]) {
        if (/pm/i.test(clock[3]) && h < 12) h += 12;
        if (/am/i.test(clock[3]) && h === 12) h = 0;
      }
      return `${pad(h)}:${clock[2]}`;
    }
    return t;
  };

  // ================================================================
  // 5. PARSER: đọc danh sách đoạn chat từ DOM của Messenger
  // ================================================================
  (() => {
    const { state, ui } = GMS;

    const THREAD_RE = /\/t\/[^/?#]+\/?$/;
    const NOISE = /^(·|Đang hoạt động|Active now|Đánh dấu là đã đọc|Mark as read|Tùy chọn khác|More options|Đã xem|Seen|Đã gửi|Sent|Đã tắt thông báo|Muted|Tin nhắn chưa đọc:?|Unread message:?|Ghim|Pinned)$/i;
    const TIME_RE = /^(vừa xong|now|just now|\d+\s*(phút|giờ|ngày|tuần|tháng|năm|m|min|mins|h|hr|hrs|d|w|wk|mo|y|yr)|\d{1,2}:\d{2}(\s?[AP]M)?|Th\s?[2-7]|CN|Mon|Tue|Wed|Thu|Fri|Sat|Sun|\d{1,2}\s*thg\s*\d{1,2}|\d{1,2}\/\d{1,2}(\/\d{2,4})?|[A-Z][a-z]{2}\s\d{1,2})$/i;
    const UNREAD_RE = /chưa đọc|unread/i;

    GMS.threadLinks = (scope = document) => {
      const out = [];
      const seen = new Set();
      for (const a of scope.querySelectorAll('a[href*="/t/"]')) {
        if (ui.shell && ui.shell.contains(a)) continue;
        if (a.closest('.gms-main')) continue;
        let path;
        try { path = new URL(a.getAttribute('href'), location.href).pathname; } catch { continue; }
        if (!THREAD_RE.test(path) || seen.has(path)) continue;
        seen.add(path);
        out.push({ a, path });
      }
      return out;
    };

    function looksUnread(a, text, snippet) {
      if (UNREAD_RE.test(text) || UNREAD_RE.test(a.getAttribute('aria-label') || '')) return true;
      if (!snippet) return false;
      const probe = snippet.slice(0, 18);
      for (const sp of a.querySelectorAll('span, div[dir="auto"]')) {
        const t = (sp.textContent || '').trim();
        if (t.length > 2 && (t.startsWith(probe) || snippet.startsWith(t.slice(0, 18))) &&
            parseInt(getComputedStyle(sp).fontWeight, 10) >= 600) return true;
      }
      return false;
    }

    function parseLink({ a, path }) {
      const text = a.innerText || '';
      const lines = text.split('\n').map((s) => s.trim())
        .filter((s) => s && !NOISE.test(s) && !/^(Tin nhắn chưa đọc|Unread message)/i.test(s));
      const name = lines[0] || '(Không có tên)';
      const parts = lines.slice(1).flatMap((s) => s.split(/\s+·\s+/)).map((s) => s.trim()).filter((s) => s && s !== '·');
      let time = '';
      if (parts.length && TIME_RE.test(parts[parts.length - 1])) time = parts.pop();
      const snippet = parts.join(' ').replace(/\s*·\s*$/, '');

      return {
        path,
        href: a.getAttribute('href'),
        name,
        snippet,
        time,
        date: GMS.toDateLabel(time),
        unread: looksUnread(a, text, snippet),
        avatar: a.querySelector('img')?.src || '',
        top: a.getBoundingClientRect().top,
      };
    }

    function hideMessengerList(links) {
      if (links.length < 2) return;
      const main = document.querySelector('.gms-main');
      let node = links[0].a;
      let best = null;
      while (node && node !== document.body) {
        if (main && node.contains(main)) break;
        best = node;
        node = node.parentElement;
      }
      if (best && !best.classList.contains('gms-hidelist')) {
        document.querySelectorAll('.gms-hidelist').forEach((x) => x !== best && x.classList.remove('gms-hidelist'));
        best.classList.add('gms-hidelist');
      }
    }

    // [Tối ưu B] Cache kết quả parse: chỉ parse lại khi chữ của đoạn chat đổi.
    let parseCache = new WeakMap();
    GMS.resetScanCache = () => { parseCache = new WeakMap(); };

    GMS.scan = () => {
      const links = GMS.threadLinks();
      state.threads = links.map((l) => {
        const sig = l.a.textContent + '|' + (l.a.getAttribute('aria-label') || '');
        let c = parseCache.get(l.a);
        if (!c || c.sig !== sig || c.path !== l.path) {
          c = { sig, path: l.path, data: parseLink(l) };
          parseCache.set(l.a, c);
        }
        c.data.top = l.a.getBoundingClientRect().top;
        return c.data;
      }).sort((x, y) => x.top - y.top);
      hideMessengerList(links);
      return state.threads;
    };

    function scrollParent(el) {
      for (let n = el && el.parentElement; n && n !== document.body; n = n.parentElement) {
        const oy = getComputedStyle(n).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 10) return n;
      }
      return null;
    }

    let loadMoreAt = 0;
    GMS.loadMore = () => {
      if (Date.now() - loadMoreAt < 800) return;
      loadMoreAt = Date.now();
      const links = GMS.threadLinks();
      const sp = links.length && scrollParent(links[links.length - 1].a);
      if (sp) sp.scrollTop = sp.scrollHeight;
      setTimeout(() => { GMS.scan(); GMS.render(); }, 900);
    };
  })();

  // ================================================================
  // 6. SHELL: khung hộp thư Gmail (Shadow DOM)
  // ================================================================
  (() => {
    const { state, ui, root, ico, esc, fold, fmtN } = GMS;

    const FOLDERS = [
      ['inbox', 'inbox', 'Hộp thư đến'],
      ['starred', 'star_border', 'Có gắn dấu sao'],
      ['snoozed', 'clock', 'Đã tạm ẩn'],
      ['sent', 'send_o', 'Đã gửi'],
      ['drafts', 'draft_o', 'Thư nháp'],
      ['purchases', 'bag', 'Giao dịch mua'],
    ];

    const EMPTY = {
      inbox: 'Hộp thư đến của bạn trống.',
      starred: 'Không có thư nào được gắn dấu sao. Gắn dấu sao cho thư để dễ dàng tìm lại về sau.',
      snoozed: 'Không có cuộc hội thoại nào bị tạm ẩn.',
      sent: 'Không có thư nào đã gửi! Gửi một thư ngay bây giờ!',
      drafts: 'Bạn không có thư nháp nào đã lưu.',
      purchases: 'Không có thư nào trong mục Giao dịch mua.',
    };

    const SENT_RE = /^(Bạn|You)\s*:\s*/i;

    const ib = (title, icon, { act, sm = true, cls = '', disabled = false } = {}) =>
      `<button class="gms-ib${sm ? ' sm' : ''}${cls ? ' ' + cls : ''}"${act ? ` data-act="${act}"` : ''} title="${title}" aria-label="${title}"${disabled ? ' disabled' : ''}>${ico(icon)}</button>`;

    const folderHtml = ([key, icon, title]) =>
      `<a class="gms-folder" href="#" data-folder="${key}" title="${title}">${ico(icon)}<span class="gms-fname">${title}</span><span class="gms-count" data-count="${key}"></span></a>`;

    const SHELL_HTML = `
<div class="gms-top">
  <div class="gms-top-left">
    ${ib('Menu chính', 'menu', { act: 'menu', sm: false })}
    <a class="gms-logo" href="#" data-act="home" title="Gmail">${GMS.LOGO}<span>Gmail</span></a>
  </div>
  <div class="gms-search">
    ${ib('Tìm kiếm', 'search', { sm: false })}
    <input id="gms-q" type="text" placeholder="Tìm kiếm trong thư" aria-label="Tìm kiếm trong thư" autocomplete="off" spellcheck="false">
    ${ib('Hiển thị tùy chọn tìm kiếm', 'tune', { sm: false })}
  </div>
  <div class="gms-top-right">
    ${ib('Hỗ trợ', 'help', { sm: false })}
    ${ib('Cài đặt', 'settings', { sm: false })}
    <button class="gms-ib" title="Gemini" aria-label="Gemini">${GMS.SPARKLE}</button>
    <button class="gms-upgrade" title="Nâng cấp bộ nhớ">Nâng cấp bộ nhớ</button>
    ${ib('Ứng dụng của Google', 'apps', { sm: false })}
    <div class="gms-avatar" id="gms-avatar"></div>
  </div>
</div>
<div class="gms-side">
  <button class="gms-compose" data-act="compose" title="Soạn thư">${ico('edit')}<span>Soạn thư</span></button>
  <nav class="gms-folders">
    ${FOLDERS.map(folderHtml).join('')}
    <a class="gms-folder" href="#" data-act="noop" title="Hiện thêm">${ico('expand')}<span class="gms-fname">Hiện thêm</span></a>
  </nav>
  <div class="gms-labels-h"><span>Nhãn</span>${ib('Tạo nhãn mới', 'add')}</div>
</div>
<div class="gms-gutter-r"></div><div class="gms-gutter-b"></div>
<div class="gms-card">
  <div class="gms-listview">
    <div class="gms-toolbar">
      <span class="gms-cb gms-cb-all" data-act="checkall" title="Chọn"></span>
      ${ib('Chọn', 'drop', { cls: 'gms-caret' })}
      ${ib('Làm mới', 'refresh', { act: 'refresh', cls: 'gms-first' })}
      ${ib('Thêm', 'more')}
      <div class="gms-spacer"></div>
      <span class="gms-range" id="gms-range"></span>
      ${ib('Mới hơn', 'left', { disabled: true })}
      ${ib('Cũ hơn', 'right', { act: 'older' })}
      <button class="gms-ib sm gms-input-tools" title="Công cụ nhập" aria-label="Công cụ nhập"><span>ê</span>${ico('drop')}</button>
    </div>
    <div class="gms-tabs">
      <div class="gms-tab on">${ico('inbox')}<span>Chính</span></div>
      <div class="gms-tab">${ico('promo')}<span>Quảng cáo</span></div>
      <div class="gms-tab">${ico('social')}<span>Mạng xã hội</span></div>
      <div class="gms-tab">${ico('info')}<span>Nội dung cập nhật</span></div>
    </div>
    <div class="gms-scroll" id="gms-scroll">
      <div id="gms-rows"></div>
      <div class="gms-foot">
        <span>Đã dùng 2,31 GB (15%) trong tổng số 15 GB</span>
        <span>Điều khoản · Quyền riêng tư · Chính sách chương trình</span>
        <span>Hoạt động gần đây nhất trên tài khoản: 0 phút trước<br>Chi tiết</span>
      </div>
    </div>
  </div>
  <div class="gms-threadview">
    <div class="gms-toolbar">
      ${ib('Quay lại Hộp thư đến', 'back', { act: 'back' })}
      ${ib('Lưu trữ', 'archive')}
      ${ib('Báo cáo spam', 'report')}
      ${ib('Xóa', 'del')}
      <span class="gms-sep"></span>
      ${ib('Đánh dấu là chưa đọc', 'unread')}
      ${ib('Tạm ẩn', 'clock')}
      ${ib('Thêm', 'more')}
      <div class="gms-spacer"></div>
      <span class="gms-range" id="gms-trange"></span>
      ${ib('Mới hơn', 'left', { act: 'prev' })}
      ${ib('Cũ hơn', 'right', { act: 'next' })}
    </div>
    <div class="gms-subjectbar">
      <div class="gms-h2" id="gms-subject"></div>
      <span class="gms-chip">Hộp thư đến<i>×</i></span>
      <div class="gms-spacer"></div>
      ${ib('In tất cả', 'print')}
      ${ib('Trong cửa sổ mới', 'open')}
    </div>
  </div>
  <div class="gms-conv" id="gms-conv"><div class="gms-conv-in" id="gms-conv-in"></div>
    <div class="gms-replybox">
      <div class="gms-replyto" id="gms-replyto"></div>
      <div class="gms-files" id="gms-files"></div>
      <textarea id="gms-reply-text" placeholder="Nhập nội dung trả lời (có thể dán ảnh)" spellcheck="false"></textarea>
      <input type="file" id="gms-file" accept="image/*,video/*" multiple hidden>
      <div class="gms-replybar2">
        <button class="gms-send" data-act="send">Gửi</button>
        ${ib('Đính kèm hình ảnh / video', 'attach', { act: 'attach' })}
        <div class="gms-spacer"></div>
        ${ib('Hủy bản nháp', 'del', { act: 'discard' })}
      </div>
    </div>
  </div>
</div>`;

    const q = (sel) => ui.shell.querySelector(sel);

    function renderFiles() {
      if (!ui.shell) return;
      GMS.setHtml(q('#gms-files'), (state.files || []).map((f, i) =>
        `<span class="gms-fchip">${esc(f.name || 'ảnh dán')}<i data-rm="${i}" title="Bỏ tệp">×</i></span>`).join(''));
    }
    function addFiles(list) {
      state.files = (state.files || []).concat(list.filter((f) => /^(image|video)\//.test(f.type)));
      renderFiles();
    }

    function buildShell() {
      ui.host = document.createElement('div');
      ui.host.id = 'gms-shell';
      const sr = ui.host.attachShadow({ mode: 'open' });
      const el = document.createElement('div');
      el.className = 'gms-app';
      GMS.setHtml(el, SHELL_HTML);
      sr.appendChild(el);
      attachShadowCss(sr);
      ui.host.classList.add('gms-ready');
      el.addEventListener('click', onShellClick);
      el.addEventListener('keydown', onShellKey);
      el.querySelector('#gms-q').addEventListener('input', (e) => {
        state.query = e.target.value;
        if (state.mode !== 'list') GMS.setMode('list');
        GMS.render(true);
      });
      el.querySelector('#gms-file').addEventListener('change', (e) => { addFiles([...e.target.files]); e.target.value = ''; });
      el.querySelector('#gms-reply-text').addEventListener('paste', (e) => {
        const fs = [...((e.clipboardData && e.clipboardData.files) || [])].filter((f) => /^image\//.test(f.type));
        if (fs.length) { e.preventDefault(); addFiles(fs); }
      });
      el.querySelector('#gms-scroll').addEventListener('scroll', (e) => {
        const s = e.currentTarget;
        if (s.scrollTop + s.clientHeight > s.scrollHeight - 120) GMS.loadMore();
      });
      el.querySelector('#gms-conv').addEventListener('scroll', (e) => {
        if (state.mode === 'thread' && e.currentTarget.scrollTop < 200) GMS.loadOlder();
      });
      return el;
    }

    GMS.ensureShell = () => {
      if (!document.body) return false;
      if (!ui.shell) ui.shell = buildShell();
      if (!ui.host.isConnected) document.body.appendChild(ui.host);
      syncHostClasses();
      const av = q('#gms-avatar');
      const letter = (GMS.settings.avatar || 'M').trim().charAt(0).toUpperCase() || 'M';
      if (av.textContent !== letter) av.textContent = letter;
      return true;
    };

    // ---------- sự kiện ----------
    function toggleStar(path) {
      if (GMS.stars[path]) delete GMS.stars[path]; else GMS.stars[path] = 1;
      gmSet('gms_stars', GMS.stars);
      GMS.render(true);
    }

    function toggleChecked(path) {
      state.checked.has(path) ? state.checked.delete(path) : state.checked.add(path);
      GMS.render(true);
    }

    function stepThread(dir) {
      const list = visibleThreads();
      const i = list.findIndex((t) => state.current && t.path === state.current.path);
      if (i >= 0 && list[i + dir]) openThread(list[i + dir].path);
    }

    const ACTIONS = {
      home() {
        state.folder = 'inbox';
        state.query = '';
        q('#gms-q').value = '';
        GMS.setMode('list');
        GMS.render(true);
      },
      menu() { state.collapsedManual = !state.collapsedManual; GMS.applyClasses(); },
      back() { GMS.setMode('list'); },
      refresh() { GMS.resetScanCache(); GMS.scan(); GMS.render(true); q('#gms-scroll').scrollTop = 0; },
      older() { GMS.loadMore(); },
      olderMsgs() { GMS.loadOlder(); },
      compose() { compose(); },
      checkall() {
        if (state.checked.size) state.checked.clear();
        else visibleThreads().forEach((t) => state.checked.add(t.path));
        GMS.render(true);
      },
      prev() { stepThread(-1); },
      next() { stepThread(1); },
      reply() {
        state.reply = true;
        GMS.applyClasses();
        const to = q('#gms-replyto');
        if (to) to.textContent = 'đến ' + ((state.current && state.current.name) || '');
        setTimeout(() => { const sc = q('#gms-conv'); sc.scrollTop = sc.scrollHeight; q('#gms-reply-text').focus(); }, 60);
      },
      forward() { ACTIONS.reply(); },
      attach() { q('#gms-file').click(); },
      discard() { q('#gms-reply-text').value = ''; state.files = []; renderFiles(); state.reply = false; GMS.applyClasses(); },
      send() {
        const ta = q('#gms-reply-text');
        const text = ta.value.trim();
        const files = state.files || [];
        if (!text && !files.length) return;
        const ok = files.length ? GMS.sendFiles(files, text) : GMS.sendMessage(text);
        if (!ok) { if (files.length) alert('Không tìm thấy ô tải ảnh của Messenger. Thử mở lại đoạn chat.'); return; }
        ta.value = ''; state.files = []; renderFiles();
        state.reply = false; state.stickUntil = Date.now() + 5000;
        GMS.applyClasses();
      },
    };

    function onShellClick(e) {
      const starBtn = e.target.closest('[data-star]');
      if (starBtn) { e.preventDefault(); e.stopPropagation(); toggleStar(starBtn.dataset.star); return; }

      const cb = e.target.closest('.gms-row .gms-cb');
      if (cb) { e.stopPropagation(); toggleChecked(cb.closest('.gms-row').dataset.path); return; }

      if (e.target.closest('.gms-acts')) { e.stopPropagation(); return; }

      const row = e.target.closest('.gms-row');
      if (row) { openThread(row.dataset.path); return; }

      const f = e.target.closest('[data-folder]');
      if (f) { e.preventDefault(); state.folder = f.dataset.folder; GMS.setMode('list'); GMS.render(true); return; }

      const rm = e.target.closest('[data-rm]');
      if (rm) { e.stopPropagation(); state.files.splice(+rm.dataset.rm, 1); renderFiles(); return; }

      const med = e.target.closest('[data-mi]');
      if (med) { e.stopPropagation(); GMS.peekMedia(+med.dataset.mi); return; }

      const msg = e.target.closest('.gms-msg[data-i]');
      if (msg) {
        if (e.target.closest('a')) return;
        if (!msg.dataset.fixed) {
          const i = +msg.dataset.i;
          state.expanded.has(i) ? state.expanded.delete(i) : state.expanded.add(i);
          GMS.renderConv(true);
        }
        return;
      }

      const a = e.target.closest('[data-act]');
      if (!a) return;
      e.preventDefault();
      ACTIONS[a.dataset.act]?.();
    }

    function onShellKey(e) {
      if (e.target.id === 'gms-reply-text') {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ACTIONS.send(); }
        else if (e.key === 'Escape') { e.preventDefault(); ACTIONS.discard(); }
        e.stopPropagation();
        return;
      }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const row = e.target.closest?.('.gms-row');
      if (row && e.target === row) { e.preventDefault(); openThread(row.dataset.path); }
    }

    // ---------- hiển thị ----------
    function visibleThreads() {
      let list = state.threads;
      if (state.folder === 'starred') list = list.filter((t) => GMS.stars[t.path]);
      else if (state.folder === 'sent') list = list.filter((t) => SENT_RE.test(t.snippet));
      else if (state.folder !== 'inbox') list = [];
      const query = fold(state.query.trim());
      if (query) list = list.filter((t) => fold(t.name + ' ' + t.snippet).includes(query));
      return list;
    }
    GMS.visibleThreads = visibleThreads;

    function rowHtml(t) {
      const starred = !!GMS.stars[t.path];
      const checked = state.checked.has(t.path);
      const sender = SENT_RE.test(t.snippet) ? `tôi, ${t.name}` : t.name;
      const body = t.snippet.replace(SENT_RE, '') || '(không có nội dung)';
      return `<div class="gms-row${t.unread ? ' is-unread' : ''}${checked ? ' is-checked' : ''}" data-path="${esc(t.path)}" role="button" tabindex="0">
<span class="gms-cb${checked ? ' on' : ''}" title="Chọn"></span>
<button class="gms-star${starred ? ' on' : ''}" data-star="${esc(t.path)}" title="${starred ? 'Có gắn dấu sao' : 'Không gắn dấu sao'}" aria-label="${starred ? 'Bỏ dấu sao' : 'Gắn dấu sao'}">${ico(starred ? 'star' : 'star_border')}</button>
<span class="gms-sender">${esc(sender)}</span>
<span class="gms-line"><span class="gms-subj">${esc(body)}</span></span>
<span class="gms-date">${esc(t.date)}</span>
<span class="gms-acts">
  ${ib('Lưu trữ', 'archive')}${ib('Xóa', 'del')}${ib('Đánh dấu là đã đọc', 'markread')}${ib('Tạm ẩn', 'clock')}
</span></div>`;
    }

    // ---------- khung đọc thư (hội thoại kiểu Gmail) ----------
    const WD = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    const nameOf = (x, them) => (x.out ? 'Tôi' : them);

    function avatar(out) {
      const cur = state.current || {};
      const url = out ? GMS.settings.myAvatar : cur.avatar;
      if (url) return `<img class="gms-av" src="${esc(url)}" alt="" referrerpolicy="no-referrer">`;
      const letter = String(out ? (GMS.settings.avatar || 'M') : (cur.name || '?')).trim().charAt(0).toUpperCase();
      return `<span class="gms-av${out ? ' me' : ''}">${esc(letter)}</span>`;
    }

    const mediaHtml = (g) => (g.media || []).map((md) =>
      `<span class="gms-media${md.vid ? ' vid' : ''}${md.vid && !md.src ? ' nopost' : ''}" data-mi="${md.i}" title="Mở bản gốc">${md.src ? `<img src="${esc(md.src)}" alt="" referrerpolicy="no-referrer">` : ''}${md.vid ? `<span class="gms-play">${ico('play')}</span>` : ''}</span>`).join('');

    function closedMsg(x, i, them) {
      return `<div class="gms-msg" data-i="${i}">${avatar(x.out)}<div class="gms-msg-b"><div class="gms-msg-n">${esc(nameOf(x, them))}</div><div class="gms-msg-s">${esc((x.text || '[Hình ảnh / video]').replace(/\s+/g, ' '))}</div></div><span class="gms-msg-t">${esc(x.time)}</span><span class="gms-mstar">${ico('star_border')}</span></div>`;
    }

    function openMsg(group, i, them, email, prev) {
      const x = group[0];
      const mail = x.out ? 'me@gmail.com' : email;
      let quote = '';
      if (prev) {
        const d = new Date();
        const pm = prev.out ? 'me@gmail.com' : email;
        quote = `<div class="gms-quote">Vào ${WD[d.getDay()]}, ${d.getDate()} thg ${d.getMonth() + 1}, ${d.getFullYear()} vào lúc ${esc(prev.time || group[group.length - 1].time)} ${esc(nameOf(prev, them))} &lt;<a href="mailto:${esc(pm)}">${esc(pm)}</a>&gt; đã viết:<br><span class="gms-dots">···</span></div>`;
      }
      return `<div class="gms-msg open" data-i="${i}"${prev ? ' data-fixed="1"' : ''}>${avatar(x.out)}<div class="gms-msg-b">
<div class="gms-msg-top"><span class="gms-msg-n">${esc(nameOf(x, them))}</span><span class="gms-msg-e">&lt;${esc(mail)}&gt;</span><span class="gms-spacer"></span><span class="gms-msg-t">${esc(group[group.length - 1].time)}</span></div>
<div class="gms-msg-to">đến ${x.out ? esc(them) : 'tôi'} ▾</div>
<div class="gms-msg-body">${group.map((g) => `<div>${g.text ? linkify(g.text) : ''}${mediaHtml(g)}</div>`).join('')}</div>${quote}
</div></div>`;
    }

    function convHtml() {
      const msgs = GMS.msgs || [];
      if (!msgs.length) return '<div class="gms-empty">Đang tải cuộc trò chuyện…</div>';
      const them = (state.current && state.current.name) || 'Người dùng';
      const email = (fold(them).replace(/[^a-z0-9]/g, '') || 'user') + '@gmail.com';
      let start = msgs.length - 1;
      while (start > 0 && msgs[start - 1].out === msgs[start].out) start--;
      let html = `<button class="gms-sum">${GMS.SPARKLE}Tóm tắt email này</button><button class="gms-sum" data-act="olderMsgs">${ico('refresh')}Tải tin cũ hơn</button>`;
      msgs.slice(0, start).forEach((x, i) => {
        html += state.expanded.has(i) ? openMsg([x], i, them, email, null) : closedMsg(x, i, them);
      });
      html += openMsg(msgs.slice(start), start, them, email, start > 0 ? msgs[start - 1] : { out: !msgs[start].out, text: '', time: '' });
      html += `<div class="gms-replybar"><button class="gms-rb" data-act="reply">${ico('reply')}Trả lời</button><button class="gms-rb" data-act="forward">${ico('forward')}Chuyển tiếp</button><button class="gms-rb round" title="Phản hồi bằng biểu tượng cảm xúc">${ico('mood')}</button></div>`;
      return html;
    }

    GMS.renderConv = (force) => {
      if (!ui.shell || state.mode !== 'thread') return;
      const html = convHtml();
      if (!force && html === state.lastConv) return;
      const sc = q('#gms-conv');
      const oldH = sc.scrollHeight, oldT = sc.scrollTop;
      GMS.setHtml(q('#gms-conv-in'), html);
      state.lastConv = html;
      if (GMS.prepended > 0) {
        // tin cũ vừa được chèn lên đầu: giữ nguyên vị trí đang đọc
        sc.scrollTop = oldT + (sc.scrollHeight - oldH);
        GMS.prepended = 0;
      } else if (Date.now() < state.stickUntil) sc.scrollTop = 1e9;
    };

    GMS.render = (force = false) => {
      if (!ui.shell) return;
      const list = visibleThreads();
      // [Tối ưu C] Đang đọc thread thì không dựng lại HTML cả danh sách mỗi tick.
      if (state.mode === 'list' || force) {
        const html = list.length
          ? list.map(rowHtml).join('')
          : `<div class="gms-empty">${state.query ? 'Không có thư nào khớp với tìm kiếm của bạn.' : EMPTY[state.folder] || EMPTY.inbox}</div>`;
        if (force || html !== state.lastHtml) {
          GMS.setHtml(q('#gms-rows'), html);
          state.lastHtml = html;
        }
      }
      const unread = state.threads.filter((t) => t.unread).length;
      q('[data-count="inbox"]').textContent = unread ? fmtN(unread) : '';
      q('#gms-range').textContent = list.length ? `1–${fmtN(list.length)} trong số ${fmtN(list.length)}` : '';
      ui.shell.querySelectorAll('.gms-folder[data-folder]').forEach((f) => f.classList.toggle('on', f.dataset.folder === state.folder));
      q('.gms-cb-all').classList.toggle('on', state.checked.size > 0);
      if (state.current) {
        const i = list.findIndex((t) => t.path === state.current.path);
        q('#gms-trange').textContent = i >= 0 ? `${fmtN(i + 1)} trong số ${fmtN(list.length)}` : '';
        q('#gms-subject').textContent = state.current.name;
      }
      GMS.renderConv(force);
      GMS.setTitle(unread);
    };

    // ---------- mở đoạn chat / soạn thư / chuyển chế độ ----------
    function openThread(path) {
      const rt = q('#gms-reply-text'); if (rt) rt.value = '';
      state.files = []; renderFiles();
      state.reply = false; state.expanded.clear(); state.lastConv = '';
      state.stickUntil = Date.now() + 2500; GMS.msgs = [];
      GMS.resetMsgCache(); GMS.prepended = 0;
      const t = state.threads.find((x) => x.path === path) || { path, name: '' };
      const link = GMS.threadLinks().find((x) => x.path === path);
      state.current = t;
      if (link) link.a.click();
      else if (t.href) { location.assign(t.href); return; }
      GMS.setMode('thread');
      GMS.render(true);
    }

    function compose() {
      const a = [...document.querySelectorAll('a[href]')].find((x) =>
        /\/(messages\/)?new\/?$/.test(new URL(x.getAttribute('href'), location.href).pathname) && !ui.shell.contains(x));
      state.current = { path: '', name: 'Thư mới' };
      if (a) { a.click(); GMS.setMode('thread'); GMS.render(true); }
      else location.assign(location.hostname.includes('messenger.com') ? '/new' : '/messages/new');
    }

    GMS.setMode = (m) => {
      if (m === 'list') state.reply = false;
      state.mode = m;
      GMS.applyClasses();
      if (m === 'thread') setTimeout(GMS.tick, 300); else GMS.render(true);
    };

    const STATE_CLASSES = ['gms-thread', 'gms-collapsed', 'gms-reply'];
    function syncHostClasses() {
      if (!ui.host) return;
      for (const c of STATE_CLASSES) ui.host.classList.toggle(c, root.classList.contains(c));
    }

    GMS.applyClasses = () => {
      const on = GMS.active();
      const narrow = window.innerWidth < 900;
      root.classList.toggle('gms-on', on);
      root.classList.toggle('gms-thread', on && state.mode === 'thread');
      root.classList.toggle('gms-reply', on && state.mode === 'thread' && state.reply);
      root.classList.toggle('gms-collapsed', on && (state.collapsedManual || narrow));
      syncHostClasses();
    };
  })();

  // ================================================================
  // 7. THREAD: vùng chat thật của Messenger đóng vai khung đọc thư
  // ================================================================
  (() => {
    const { root, ui } = GMS;

    const CALL_LABEL_RE = /cuộc gọi|gọi thoại|gọi video|voice call|video call|start a call/i;
    const countLinks = (n) => n.querySelectorAll('a[href*="/t/"]').length;
    const textbox = (scope) => scope.querySelector('[contenteditable="true"][role="textbox"]');

    function pickMain() {
      const tb = [...document.querySelectorAll('[contenteditable="true"][role="textbox"]')]
        .find((x) => !(ui.shell && ui.shell.contains(x)));
      if (tb) {
        const m = tb.closest('[role="main"]');
        if (m && countLinks(m) < 3) return m;
        let node = tb, best = null;
        while (node && node !== document.body) {
          if (countLinks(node) >= 3) break;
          best = node;
          node = node.parentElement;
        }
        return best;
      }
      return [...document.querySelectorAll('[role="main"]')].find((m) => countLinks(m) < 3) || null;
    }

    function needsUnwrap(cs) {
      return cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' ||
        /paint|layout|strict|content/.test(cs.contain) || /transform|filter/.test(cs.willChange) ||
        (cs.backdropFilter && cs.backdropFilter !== 'none');
    }

    GMS.applyMain = () => {
      const m = pickMain();
      document.querySelectorAll('.gms-main').forEach((x) => x !== m && x.classList.remove('gms-main'));
      if (!m) return null;
      m.classList.add('gms-main');
      for (let p = m.parentElement; p && p !== root; p = p.parentElement) {
        if (!p.classList.contains('gms-unx') && needsUnwrap(getComputedStyle(p))) p.classList.add('gms-unx');
      }
      return m;
    };

    // Đọc màu "rgb(...)", "rgba(...)" hoặc "rgb(r g b / a)".
    function parseRgb(c) {
      const mt = /rgba?\(([^)]+)\)/.exec(c || '');
      if (!mt) return null;
      const p = mt[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }

    // Có nền (màu hoặc ảnh/gradient). Màu trắng cũng tính, kể cả trắng bán trong suốt.
    function isPainted(cs) {
      const c = parseRgb(cs.backgroundColor);
      return (c && c.a > 0.05) || (cs.backgroundImage && cs.backgroundImage !== 'none');
    }

    // Leo từ `start` lên tối đa `maxUp` cấp, trả về phần tử đầu tiên bo góc >= `radius` và có nền.
    // allowEmpty: nếu không có phần tử nào có nền thì lấy phần tử bo góc đầu tiên.
    function findPainted(start, stop, maxUp, radius, allowEmpty = false) {
      let node = start;
      let fallback = null;
      for (let i = 0; i < maxUp && node && node !== stop; i++, node = node.parentElement) {
        const cs = getComputedStyle(node);
        if (parseFloat(cs.borderTopLeftRadius) < radius) continue;
        if (isPainted(cs)) return node;
        fallback = fallback || node;
      }
      return allowEmpty ? fallback : null;
    }

    function styleBubbles(m, mr) {
      const mid = mr.left + mr.width / 2;
      let n = 0;
      for (const t of m.querySelectorAll('div[dir="auto"]:not([data-gms-b]), span[dir="auto"]:not([data-gms-b])')) {
        if (++n > 400) break;
        if (t.closest('[contenteditable="true"]')) { t.setAttribute('data-gms-b', '0'); continue; }
        const bubble = findPainted(t, m, 9, 8, true);
        if (!bubble) { t.setAttribute('data-gms-b', '0'); continue; }
        const r = bubble.getBoundingClientRect();
        if (r.width === 0) continue; // chưa render: thử lại ở lần sau
        t.setAttribute('data-gms-b', '1');
        bubble.classList.add('gms-bubble');
        bubble.classList.toggle('gms-out', r.left + r.width / 2 > mid && r.right > mr.right - mr.width * 0.25);
      }
    }

    // Nền chủ đề cuộc trò chuyện (ảnh, màu hồng...) và các thanh rộng có màu -> trắng.
    function flattenBackdrops(m, mr) {
      let n = 0;
      for (const el of m.querySelectorAll('div:not([data-gms-bg])')) {
        if (++n > 250) break;
        const r = el.getBoundingClientRect();
        if (r.width < 1) continue; // chưa render: thử lại ở lần sau
        el.setAttribute('data-gms-bg', '1');
        if (r.width < mr.width * 0.6 || r.height < 36) continue;
        if (el.classList.contains('gms-bubble')) continue;
        const cs = getComputedStyle(el);
        const c = parseRgb(cs.backgroundColor);
        const hasImg = cs.backgroundImage && cs.backgroundImage !== 'none';
        const tinted = c && c.a > 0.05 && !(c.r >= 245 && c.g >= 245 && c.b >= 245);
        if (hasImg || tinted) el.classList.add('gms-flat');
      }
    }

    function styleComposer(m) {
      const tb = textbox(m);
      if (!tb || m.querySelector('.gms-composer')) return;
      findPainted(tb.parentElement, m, 8, 12)?.classList.add('gms-composer');
    }

    function hideThreadHeader(m, mr) {
      if (m.querySelector('.gms-hide')) return;
      const callBtn = [...m.querySelectorAll('[aria-label]')].find((x) => CALL_LABEL_RE.test(x.getAttribute('aria-label')));
      if (!callBtn) return;
      let node = callBtn;
      for (let i = 0; i < 12 && node && node !== m; i++, node = node.parentElement) {
        const r = node.getBoundingClientRect();
        if (r.width >= mr.width * 0.8 && r.height >= 40 && r.height <= 110 && r.top - mr.top < 30) {
          node.classList.add('gms-hide');
          break;
        }
      }
    }

    const TIME_IN = /(\d{1,2}:\d{2}(?:\s?[AP]M)?)\s*$/i;
    const SEP_OK = /^[\p{L}\d\s,.:/-]{3,40}$/u;
    // Chữ ẩn dành cho trình đọc màn hình: "Nhập, Tin nhắn do Bạn gửi lúc 09:59: ..."
    // Nhóm 1/2 = người gửi (Bạn / You / tên người kia), nhóm 3 = giờ.
    // Dấu ":" là tùy chọn: tin chỉ có ảnh/video/sticker thì nhãn kết thúc ngay sau giờ.
    const ACC_RE = /^(?:(?:Nhập|Enter)\s*[,.]\s*)?(?:Tin nhắn do (.{1,80}?) gửi lúc|Message (?:sent )?(?:by|from) (.{1,80}?) (?:at|sent at))\s*(\d{1,2}:\d{2}(?:\s?[AP]M)?)\s*(?::\s*|[.,]?\s*$)/i;
    const SELF_RE = /^(bạn|you)$/i;

    GMS.mediaEls = [];
    GMS.peek = { on: false, seen: false, at: 0 };

    GMS.focusComposer = () => {
      const m = document.querySelector('.gms-main');
      if (m) textbox(m)?.focus();
    };

    // Nhấn Enter trong ô nhập thật của Messenger (có nút gửi dự phòng).
    function submit(m, tb) {
      const ev = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true };
      tb.focus();
      tb.dispatchEvent(new KeyboardEvent('keydown', ev));
      tb.dispatchEvent(new KeyboardEvent('keyup', ev));
      setTimeout(() => {
        const btn = [...m.querySelectorAll('[aria-label]')].find((x) =>
          /^(nhấn enter để gửi|press enter to send|gửi|send)$/i.test(x.getAttribute('aria-label')));
        if (btn && ((tb.textContent || '').trim() || m.querySelector('img[src^="blob:"]'))) btn.click();
      }, 500);
    }

    // Gõ chữ vào ô nhập thật của Messenger rồi nhấn Enter.
    GMS.sendMessage = (text) => {
      const m = document.querySelector('.gms-main');
      const tb = m && textbox(m);
      if (!tb) return false;
      tb.focus();
      document.execCommand('selectAll', false);
      document.execCommand('delete', false);
      text.split('\n').forEach((line, i) => {
        if (i) document.execCommand('insertLineBreak', false);
        if (line) document.execCommand('insertText', false, line);
      });
      setTimeout(() => submit(m, tb), 80);
      return true;
    };

    // Đưa tệp vào ô chọn tệp ẩn của Messenger, đợi nó tải lên rồi gửi.
    GMS.sendFiles = (files, text) => {
      const m = document.querySelector('.gms-main');
      const tb = m && textbox(m);
      if (!tb) return false;
      const input = (m.querySelector('input[type="file"]')) ||
        [...document.querySelectorAll('input[type="file"]')].find((x) => !(ui.shell && ui.shell.contains(x)));
      if (!input) return false;
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      input.files = dt.files;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(() => {
        if (text) GMS.sendMessage(text);
        else submit(m, tb);
      }, 1400);
      return true;
    };

    // Mở trình xem hình/video gốc của Messenger (khung Gmail tạm ẩn).
    GMS.peekMedia = (i) => {
      const el = GMS.mediaEls[i];
      if (!el) return;
      GMS.peek = { on: true, seen: false, at: Date.now() };
      el.click();
    };

    const blobCache = new Map();
    function dataToBlobUrl(uri) {
      const key = uri.length + ':' + uri.slice(-48);
      let u = blobCache.get(key);
      if (u !== undefined) return u;
      try {
        const mime = (/^data:([^;,]+)/.exec(uri) || [])[1] || 'image/jpeg';
        const bin = atob(uri.slice(uri.indexOf(',') + 1));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        u = URL.createObjectURL(new Blob([bytes], { type: mime }));
      } catch (e) { u = ''; }
      if (blobCache.size > 150) {
        const k = blobCache.keys().next().value;
        if (blobCache.get(k)) URL.revokeObjectURL(blobCache.get(k));
        blobCache.delete(k);
      }
      blobCache.set(key, u);
      return u;
    }

    GMS.readMessages = (m) => {
      const cur = GMS.state.current;
      const norm = (s) => s.replace(/\/$/, '');
      if (cur && cur.path && !norm(location.pathname).endsWith(norm(cur.path))) return [];
      const mr = m.getBoundingClientRect();
      const mid = mr.left + mr.width / 2;
      GMS.mediaEls = [];

      // 1) Đọc chữ. Mỗi tin có thể xuất hiện 2 lần: bản "chữ ẩn" (có người gửi + giờ) và bản hiển thị.
      const acc = [];
      const plain = [];
      for (const b of m.querySelectorAll('.gms-bubble')) {
        if (b.closest('[contenteditable="true"]') || b.parentElement.closest('.gms-bubble')) continue;
        const r = b.getBoundingClientRect();
        if (r.width < 1) continue;
        const leaves = [...b.querySelectorAll('[dir="auto"]')].filter((x) => !x.querySelector('[dir="auto"]'));
        const raw = leaves.length ? leaves.map((x) => x.textContent.trim()) : [b.textContent.trim()];
        const lines = [];
        let who = null;
        let own = '';
        let att = false;
        for (const x of raw) {
          if (!x) continue;
          const mt = ACC_RE.exec(x);
          let t = x;
          if (mt) {
            who = (mt[1] || mt[2] || '').trim();
            own = GMS.toDateLabel(mt[3]);
            t = x.slice(mt[0].length).trim();
            if (!t) att = true; // tin chỉ có ảnh/video/sticker
          }
          if (t && t !== lines[lines.length - 1]) lines.push(t);
        }
        const text = lines.join('\n');
        if (!text) {
          if (att) acc.push({ top: r.top, out: SELF_RE.test(who), text: '', own, att: true });
          continue;
        }
        if (who !== null) acc.push({ top: r.top, out: SELF_RE.test(who), text, own });
        else plain.push({ top: r.top, out: r.left + r.width / 2 > mid && r.right > mr.right - mr.width * 0.25, text });
      }

      // 2) Ghép mỗi bản "chữ ẩn" với bản hiển thị cùng nội dung gần nhất rồi bỏ bản thừa (chống lặp tin).
      const used = new Set();
      for (const a of acc) {
        let best = -1;
        let bd = Infinity;
        plain.forEach((p, k) => {
          if (used.has(k) || p.text !== a.text) return;
          const d = Math.abs(p.top - a.top);
          if (d < bd) { bd = d; best = k; }
        });
        if (best >= 0) { used.add(best); a.top = plain[best].top; }
      }
      const accUniq = acc.filter((a, i) =>
        !acc.slice(0, i).some((b) => b.text === a.text && b.own === a.own && Math.abs(b.top - a.top) < 4));
      const items = [...accUniq, ...plain.filter((_, k) => !used.has(k))];

      // 3) Hình / video
      const seen = new Set();
      for (const el of m.querySelectorAll('img, video')) {
        if (el.closest('[contenteditable="true"]') || el.closest('.gms-composer')) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 80 || r.height < 60) continue;
        const half = Math.min(r.width, r.height) / 2 - 1;
        const square = Math.abs(r.width - r.height) < 6;
        if (square && (parseFloat(getComputedStyle(el).borderTopLeftRadius) >= half ||
            (el.parentElement && parseFloat(getComputedStyle(el.parentElement).borderTopLeftRadius) >= half))) continue; // ảnh đại diện tròn
        const vid = el.tagName === 'VIDEO';
        let src = vid ? (el.poster || '') : (el.currentSrc || el.src || '');
        if (!vid && (!src || /emoji|rsrc\.php/.test(src))) continue;
        // Ảnh vừa gửi thường là data:image/...;base64 -> đổi sang blob URL (có cache) để khỏi nhét chuỗi khổng lồ vào HTML
        if (src.startsWith('data:')) src = dataToBlobUrl(src);
        if (!vid && !src) continue;
        const key = src || 'v' + Math.round(r.top);
        if (seen.has(key)) continue;
        seen.add(key);
        GMS.mediaEls.push(el);
        items.push({
          top: r.top,
          out: r.left + r.width / 2 > mid && r.right > mr.right - mr.width * 0.25,
          media: { vid, src, i: GMS.mediaEls.length - 1 },
        });
      }

      // 4) Mốc thời gian giữa đoạn chat
      for (const el of m.querySelectorAll('[dir="auto"]')) {
        if (el.querySelector('[dir="auto"]') || el.closest('.gms-bubble') || el.closest('[contenteditable="true"]')) continue;
        const t = (el.textContent || '').trim();
        const mt = SEP_OK.test(t) && TIME_IN.exec(t);
        if (mt) items.push({ top: el.getBoundingClientRect().top, time: GMS.toDateLabel(mt[1]) });
      }

      items.sort((a, b) => a.top - b.top);

      // Gắn mỗi ảnh với nhãn "tin nhắn ảnh" gần nhất phía trên nó
      const atts = items.filter((i) => i.att);
      for (const md of items) {
        if (!md.media) continue;
        let best = null;
        for (const a of atts) if (a.top <= md.top + 20 && (!best || a.top > best.top)) best = a;
        if (best) best.hasMedia = true;
      }

      const msgs = [];
      let time = '';
      for (const it of items) {
        if (it.media) msgs.push({ out: it.out, text: '', time, media: [it.media] });
        else if (it.att) {
          time = it.own || time;
          // Không tìm thấy ảnh -> hiện placeholder thay vì nhãn thô
          if (!it.hasMedia) msgs.push({ out: it.out, text: '[Hình ảnh / video]', time });
        }
        else if (it.text === undefined) time = it.time;
        else msgs.push({ out: it.out, text: it.text, time: it.own || time });
      }
      return msgs;
    };

    // ---------- gộp tin đã đọc + tải tin cũ hơn ----------
    // Key không gồm giờ/URL ảnh vì chúng có thể đổi giữa các lần đọc.
    const mkey = (x) => (x.out ? 'o' : 'i') + '|' +
      ((x.media || x.text === '[Hình ảnh / video]') ? 'M' + (x.media ? x.media.map((md) => (md.vid ? 'v' : 'p')).join('') : 'p') : (x.text || ''));
    const MAX_CACHED = 500;
    GMS.msgCache = { path: null, list: [] };
    GMS.resetMsgCache = () => { GMS.msgCache = { path: null, list: [] }; };
    GMS.prepended = 0;

    // Tin chỉ còn trong cache (đã rời khỏi DOM) thì không còn phần tử để mở bản gốc.
    const detach = (list) => list.map((x) => (x.media
      ? { ...x, media: x.media.map((md) => ({ ...md, i: -1 })) }
      : x));

    GMS.mergeMsgs = (fresh) => {
      const st = GMS.state;
      const path = st.current ? st.current.path : '';
      const c = GMS.msgCache;
      if (c.path !== path) { c.path = path; c.list = []; }
      if (!fresh.length) return c.list;
      const old = c.list;
      if (!old.length) { c.list = fresh.slice(); return c.list; }

      const fk = fresh.map(mkey);
      const ok = old.map(mkey);
      const F = fk.length, O = ok.length;
      const need = Math.min(3, F, O);
      // off = vị trí của fresh[0] so với old[0]; tìm độ lệch khớp toàn bộ phần chồng nhau
      const overlapAt = (off) => {
        const a = Math.max(0, -off), b = Math.min(F - 1, O - 1 - off);
        if (b < a) return 0;
        for (let k = a; k <= b; k++) if (fk[k] !== ok[k + off]) return 0;
        return b - a + 1;
      };
      let bestOff = null, bestLen = 0;
      const maxPossible = Math.min(F, O);
      const first = overlapAt(0);
      if (first >= need) { bestOff = 0; bestLen = first; }
      if (bestLen < maxPossible) {
        for (let off = -(F - 1); off <= O - 1; off++) {
          if (off === 0) continue;
          const len = overlapAt(off);
          if (len >= need && len > bestLen) { bestOff = off; bestLen = len; if (len === maxPossible) break; }
        }
      }
      if (bestOff === null) { c.list = fresh.slice(); return c.list; } // không khớp: thay hẳn

      const head = bestOff > 0 ? detach(old.slice(0, bestOff)) : [];
      const tail = bestOff + F < O ? detach(old.slice(bestOff + F)) : [];
      let merged = head.concat(fresh, tail);
      if (bestOff < 0) {
        const n = -bestOff;
        GMS.prepended += n;
        st.expanded = new Set([...st.expanded].map((i) => i + n));
      }
      if (merged.length > MAX_CACHED) merged = merged.slice(-MAX_CACHED);
      c.list = merged;
      return merged;
    };

    // Tìm vùng cuộn thật của Messenger rồi kéo lên đầu để nó tải tin cũ hơn.
    function findScroller(m) {
      const tb = textbox(m);
      let best = null, bh = 0;
      for (const el of m.querySelectorAll('div')) {
        if (el.clientHeight < 80 || el.scrollHeight <= el.clientHeight + 10 || el.scrollHeight <= bh) continue;
        if (tb && el.contains(tb)) continue;
        const oy = getComputedStyle(el).overflowY;
        if (oy !== 'auto' && oy !== 'scroll') continue;
        bh = el.scrollHeight; best = el;
      }
      return best;
    }

    let olderAt = 0;
    GMS.loadOlder = () => {
      const now = Date.now();
      if (now - olderAt < 1500) return false;
      const m = document.querySelector('.gms-main');
      const sp = m && findScroller(m);
      if (!sp) return false;
      olderAt = now;
      root.classList.add('gms-unclip'); // clip-path có thể khiến Messenger tưởng khung không hiển thị
      sp.scrollTop = 0;
      setTimeout(() => { sp.scrollTop = sp.scrollHeight; }, 1200); // trả về cuối để tin mới nhất vẫn nằm trong DOM
      setTimeout(() => root.classList.remove('gms-unclip'), 1400);
      return true;
    };

    GMS.styleThread = (m) => {
      if (!m) return;
      const mr = m.getBoundingClientRect();
      if (mr.width < 50) return;
      styleBubbles(m, mr);
      flattenBackdrops(m, mr);
      styleComposer(m);
      if (GMS.settings.hideThreadHeader) hideThreadHeader(m, mr);
    };
  })();

  // ================================================================
  // 8. PAGE: tiêu đề tab và favicon
  // ================================================================
  (() => {
    const { state, settings } = GMS;

    let settingTitle = false;
    GMS.setTitle = (unread) => {
      if (!GMS.active()) return;
      const n = unread ?? state.threads.filter((t) => t.unread).length;
      let t = (settings.titleTpl || DEFAULTS.titleTpl).replace('{n}', GMS.fmtN(n));
      if (!n) t = t.replace(/\s*\(\s*0\s*\)/, '').replace(/\s*\(\)\s*/, ' ');
      if (document.title !== t) { settingTitle = true; document.title = t; settingTitle = false; }
    };

    const titleObs = new MutationObserver(() => { if (!settingTitle && GMS.active()) GMS.setTitle(); });
    GMS.watchTitle = () => {
      if (document.head) titleObs.observe(document.head, { subtree: true, childList: true, characterData: true });
    };

    GMS.setFavicon = () => {
      if (!settings.favicon) { GMS.restoreFavicon(); return; }
      const fav = GMS.FAVICON;
      const links = document.querySelectorAll('link[rel~="icon"]');
      if (!links.length && document.head) {
        const l = document.createElement('link');
        l.rel = 'icon'; l.dataset.gmsAdded = '1'; l.href = fav;
        document.head.appendChild(l);
        return;
      }
      links.forEach((l) => {
        if (!l.dataset.gmsOrig && l.href !== fav) l.dataset.gmsOrig = l.href;
        if (l.href !== fav) l.href = fav;
      });
    };

    GMS.restoreFavicon = () => {
      document.querySelectorAll('link[rel~="icon"]').forEach((l) => {
        if (l.dataset.gmsAdded) l.remove();
        else if (l.dataset.gmsOrig) { l.href = l.dataset.gmsOrig; delete l.dataset.gmsOrig; }
      });
    };
  })();

  // ================================================================
  // 9. MAIN: vòng lặp cập nhật, điều hướng SPA, phím tắt, menu cài đặt
  // ================================================================
  (() => {
    const { root, state, settings } = GMS;

    addPageCss(PAGE_CSS);

    // Khởi động: tránh nháy giao diện Messenger gốc (chỉ khi đang ở trang tin nhắn).
    let bootTimer = null;
    if (GMS.active()) {
      root.classList.add('gms-boot');
      bootTimer = setTimeout(() => root.classList.remove('gms-boot'), 1500);
    }

    let tickTimer = null;

    // ---------- ép nền sáng: Messenger dùng class này trên <html> để bật Dark mode ----------
    const DARK = '__fb-dark-mode';
    const LIGHT = '__fb-light-mode';
    let forcedDark = false;
    let hadLight = null;

    function forceLight() {
      if (!GMS.active() || !settings.forceLight) return;
      const cl = root.classList;
      if (hadLight === null) hadLight = cl.contains(LIGHT);
      if (cl.contains(DARK)) { cl.remove(DARK); forcedDark = true; }
      if (!cl.contains(LIGHT)) cl.add(LIGHT);
    }

    function restoreTheme() {
      if (!forcedDark) return;
      forcedDark = false;
      const cl = root.classList;
      cl.add(DARK);
      if (!hadLight) cl.remove(LIGHT);
    }

    // Messenger có thể tự gắn lại class tối: giữ nguyên chế độ sáng.
    new MutationObserver(forceLight).observe(root, { attributes: true, attributeFilter: ['class'] });

    GMS.tick = () => {
      GMS.applyClasses();
      if (!GMS.active()) return;
      forceLight();
      if (!GMS.ensureShell()) return;
      const pk = GMS.peek;
      if (pk && pk.on) {
        const dlg = !!document.querySelector('[role="dialog"]');
        if (dlg) pk.seen = true;
        if (!dlg && (pk.seen || Date.now() - pk.at > 2500)) pk.on = false;
      }
      GMS.ui.host.style.visibility = pk && pk.on ? 'hidden' : '';
      const m = GMS.applyMain();
      GMS.scan();
      if (state.mode === 'thread') { GMS.styleThread(m); GMS.msgs = m ? GMS.mergeMsgs(GMS.readMessages(m)) : []; }
      GMS.render();
      GMS.setFavicon();
    };

    function teardown() {
      GMS.applyClasses();
      GMS.ui.host?.remove();
      ['gms-main', 'gms-unx', 'gms-hidelist', 'gms-bubble', 'gms-out', 'gms-composer', 'gms-hide', 'gms-flat'].forEach((c) =>
        document.querySelectorAll('.' + c).forEach((x) => x.classList.remove(c)));
      document.querySelectorAll('[data-gms-b], [data-gms-bg]').forEach((x) => { x.removeAttribute('data-gms-b'); x.removeAttribute('data-gms-bg'); });
      GMS.restoreFavicon();
      restoreTheme();
    }

    const refresh = () => (GMS.active() ? GMS.tick() : teardown());

    // ---------- cài đặt (thay cho popup) ----------
    function onSettingsChanged() {
      if (!settings.enabled) state.mode = 'list';
      if (!settings.hideThreadHeader) document.querySelectorAll('.gms-hide').forEach((x) => x.classList.remove('gms-hide'));
      if (!settings.forceLight) restoreTheme();
      refresh();
    }

    function saveSettings(patch) {
      Object.assign(settings, patch);
      gmSet('gms_settings', { ...settings });
      onSettingsChanged();
    }

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Bật / tắt giao diện hộp thư (Alt+Shift+G)', () => saveSettings({ enabled: !settings.enabled }));
      GM_registerMenuCommand('Đổi chữ trên ảnh đại diện', () => {
        const v = prompt('Chữ cái trên ảnh đại diện:', settings.avatar);
        if (v !== null) saveSettings({ avatar: v.trim().charAt(0) || 'M' });
      });
      GM_registerMenuCommand('Đổi ảnh đại diện của tôi (URL ảnh)', () => {
        const v = prompt('Dán URL ảnh (để trống = dùng chữ cái):', settings.myAvatar || '');
        if (v !== null) saveSettings({ myAvatar: v.trim() });
      });
      GM_registerMenuCommand('Đổi tiêu đề tab', () => {
        const v = prompt('Tiêu đề tab ({n} = số chat chưa đọc):', settings.titleTpl);
        if (v !== null && v.trim()) saveSettings({ titleTpl: v.trim() });
      });
      GM_registerMenuCommand('Bật / tắt icon Gmail trên tab', () => saveSettings({ favicon: !settings.favicon }));
      GM_registerMenuCommand('Ẩn / hiện thanh tên trong đoạn chat', () => saveSettings({ hideThreadHeader: !settings.hideThreadHeader }));
      GM_registerMenuCommand('Ép khung chat sang nền sáng (bật / tắt)', () => saveSettings({ forceLight: !settings.forceLight }));
      GM_registerMenuCommand('Debug: in thông tin ảnh/video trong chat', () => {
        const m = document.querySelector('.gms-main');
        if (!m) return console.log('[GMS] chưa có .gms-main');
        console.table([...m.querySelectorAll('img, video')].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height),
            radius: getComputedStyle(el).borderTopLeftRadius,
            parentRadius: el.parentElement && getComputedStyle(el.parentElement).borderTopLeftRadius,
            inComposer: !!(el.closest('.gms-composer') || el.closest('[contenteditable="true"]')),
            inHidden: !!el.closest('.gms-hide'),
            src: (el.currentSrc || el.src || el.poster || '').slice(0, 60),
          };
        }));
        console.log('[GMS v1.4.2] msgs đọc được:');
        console.table((GMS.msgs || []).map((x) => ({
          out: x.out, text: (x.text || '').slice(0, 40), time: x.time,
          media: x.media ? x.media.map((md) => (md.vid ? 'video' : 'img') + ':' + (md.src || '').slice(0, 30)).join(' ') : '',
        })));
      });
    }

    if (typeof GM_addValueChangeListener === 'function') {
      GM_addValueChangeListener('gms_settings', (name, oldV, newV, remote) => {
        if (!remote || !newV) return;
        Object.assign(settings, newV);
        onSettingsChanged();
      });
      GM_addValueChangeListener('gms_stars', (name, oldV, newV, remote) => {
        if (!remote) return;
        GMS.stars = newV || {};
        GMS.render(true);
      });
    }

    // ---------- điều hướng trong SPA của Facebook ----------
    let lastHref = location.href;
    setInterval(() => {
      if (location.href === lastHref) return;
      const wasMsg = /^\/messages/.test(new URL(lastHref).pathname);
      lastHref = location.href;
      if (!wasMsg && GMS.isMsgPage()) state.mode = 'list';
      refresh();
    }, 400);

    // ---------- phím tắt: Alt+Shift+G bật/tắt; "u" / Esc quay lại; "/" tìm kiếm ----------
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'G' || e.key === 'g' || e.code === 'KeyG')) {
        e.preventDefault();
        if (GMS.isMsgPage()) saveSettings({ enabled: !settings.enabled });
        return;
      }
      if (!GMS.active() || e.ctrlKey || e.metaKey || e.altKey) return;
      const tgt = e.composedPath()[0];
      const typing = tgt && (tgt.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tgt.tagName));
      if (!typing && state.mode === 'thread' && (e.key === 'u' || e.key === 'Escape') && !document.querySelector('[role="dialog"]')) {
        e.preventDefault(); e.stopPropagation();
        GMS.setMode('list');
      }
      if (!typing && e.key === '/' && state.mode === 'list' && GMS.ui.shell) {
        e.preventDefault();
        GMS.ui.shell.querySelector('#gms-q').focus();
      }
    }, true);

    window.addEventListener('resize', GMS.applyClasses);

    // ---------- khởi động ----------
    const start = () => {
      GMS.watchTitle();
      refresh();
      if (bootTimer) clearTimeout(bootTimer);
      root.classList.remove('gms-boot');
      // [Tối ưu A] Không chạy khi tab bị ẩn, giãn chu kỳ lên 1000ms.
      if (!tickTimer) tickTimer = setInterval(() => { if (GMS.active() && !document.hidden) GMS.tick(); }, 1000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
    };
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start, { once: true });
  })();
})();
