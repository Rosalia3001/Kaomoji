# (◕‿◕✿) 颜文字收藏馆 · Kaomoji Collection

> 一个零依赖、纯静态的可爱颜文字收藏站。281 个颜文字，5 大类 29 小节，中 / 英 / 日三语界面，点一下就能复制。

[![Version](https://img.shields.io/github/v/tag/Rosalia3001/Kaomoji?style=flat-square&color=ff8fab&label=version)](https://github.com/Rosalia3001/Kaomoji/tags)
[![License](https://img.shields.io/github/license/Rosalia3001/Kaomoji?style=flat-square&color=ff8fab)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-ff8fab?style=flat-square)](#技术栈)
[![i18n](https://img.shields.io/badge/i18n-中文%20%7C%20English%20%7C%20日本語-ff8fab?style=flat-square)](#功能特性)

---

## 简介

颜文字（Kaomoji / 顔文字）是用日文字符与标点拼出的表情符号，相比西式 emoticon 更重眼睛、能表达动作甚至场景。

本项目把散落在各处的好看颜文字整理成一个可以直接打开就用的网页：**不用注册、不用联网等你加载、不装任何依赖**，打开页面点一下，颜文字就进剪贴板了。

## 功能特性

- **281 个颜文字**，按情绪与场景分 5 大类、29 个小节
- **点击即复制**：优先 `navigator.clipboard`，环境不支持时自动回退 `document.execCommand('copy')`
- **三语界面**：中文 / English / 日本語 一键切换，`localStorage` 记住偏好；首次访问按浏览器语言自动匹配
- **轻量交互**：分类切换淡入、卡片悬停位移、复制成功浮层提示（2 秒消失，Esc 可关）
- **键盘友好**：数字键 `1`–`5` 快速切换分类
- **响应式**：768px / 480px 两档断点，手机端自动转单列/双列
- **零构建**：没有 npm install、没有打包步骤，改完刷新即生效

## 内容构成

| 大类 | `id` | 小节 | 数量 |
| --- | --- | --- | ---: |
| 积极情绪 | `positive` | 喜悦 / 爱 / 害羞 / 安慰 | 41 |
| 消极情绪 | `negative` | 不满 / 生气 / 伤心 / 痛苦 / 害怕 | 50 |
| 中性情绪 | `neutral` | 不关心 / 困惑 / 怀疑 / 惊讶 | 40 |
| 各种动作 | `actions` | 问候 / 抱抱 / 眨眼 / 抱歉 / 鼻出血 / 隐身 / 跑步 / 写字 / 睡觉 | 86 |
| 动物 | `animals` | 猫 / 熊 / 狗 / 兔子 / 猪 / 鸟 / 其他动物 | 64 |
| **合计** | | **29 个小节** | **281** |

## 快速开始

不需要安装任何东西。三种方式任选：

```bash
# 方式 1：直接双击 index.html 用浏览器打开

# 方式 2：起一个本地静态服务器（推荐，剪贴板 API 行为更稳定）
git clone https://github.com/Rosalia3001/Kaomoji.git
cd Kaomoji
python -m http.server 8000
# 打开 http://localhost:8000
```

## 目录结构

```text
Kaomoji/
├── index.html       # 页面结构 + 全部颜文字内容（单页，281 条 data-kaomoji）
├── style.css        # 全部样式，粉系主题 + 响应式断点
├── script.js        # 三语切换、分类切换、复制逻辑、动效
├── bg.png           # 背景图
├── favicon.svg      # 站点图标
├── VERSION          # 当前版本号（单一真源）
├── CHANGELOG.md     # 版本变更记录
├── LICENSE          # MIT
├── README.md
├── .editorconfig    # 统一缩进 / 换行 / 编码
├── .gitattributes   # 仓库内统一 LF 换行
└── .gitignore
```

## 添加一个颜文字

颜文字是写在 `index.html` 里的纯 HTML，没有 JSON 数据源。找到对应大类（`<div class="category-content" id="...">`）下的小节，往 `kaomoji-grid` 里加一行即可：

```html
<div class="kaomoji-item" data-kaomoji="(◕ᴗ◕✿)">(◕ᴗ◕✿)</div>
```

注意两点：

- `data-kaomoji` 是**真正被复制的内容**，必须原样填写；标签之间的文字只是展示，可以省略多余字符
- 新增小节要同时补 `<h3 data-zh="…" data-en="…" data-ja="…">`，否则切换语言时会缺文案

## 版本规范

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)：`MAJOR.MINOR.PATCH`

| 位 | 什么时候加 |
| --- | --- |
| `MAJOR` | 页面结构或交互方式发生不兼容变化（例如改掉复制机制、重构数据源） |
| `MINOR` | 新增分类、新增语言、新增功能，向下兼容 |
| `PATCH` | 修 bug、补颜文字、调样式、改文案 |

发布一个版本的固定动作：

1. 更新 `VERSION` 文件
2. 在 `CHANGELOG.md` 顶部加一节，写清「新增 / 变更 / 修复」
3. 同步 `index.html` 页脚里的 `version-badge`
4. 提交并打 tag：`git tag -a v1.0.0 -m "v1.0.0" && git push --tags`
5. 在 GitHub 上用该 tag 建 Release，正文直接贴 CHANGELOG 对应段落

`VERSION`、页脚徽标、tag 三者需保持一致，PR 里请一并改。

## 部署

纯静态，任意静态托管都能跑，最省事的是 GitHub Pages：

1. 仓库 **Settings → Pages**
2. Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`
3. 保存后等一分钟，访问 `https://rosalia3001.github.io/Kaomoji/`

## 已知问题

- 281 条里有 2 条内容重复（唯一数 279），待整理时去重
- 复制项目前是 `div`，只能鼠标点击，暂不支持 Tab 聚焦后回车复制

## 贡献

欢迎提 Issue 或 PR 增补颜文字、补翻译、修样式：

- 颜文字请尽量附来源或说明所属情绪，便于归类
- 一次 PR 只做一类改动（如「新增 10 条动物颜文字」），方便 review
- 提交信息建议带前缀：`feat:` / `fix:` / `style:` / `docs:` / `chore:`

## 许可证

[MIT](LICENSE) © 2025-2026 Rosalia3001

可自由使用、修改、分发、商用，保留版权与许可声明即可。

## English

**Kaomoji Collection** — a zero-dependency, static gallery of 281 cute kaomoji, organized into 5 categories (positive / negative / neutral emotions, actions, animals). Click any entry to copy it to your clipboard. The UI switches between Chinese, English and Japanese, remembers your choice in `localStorage`, and falls back to your browser language on first visit.

No build step: just open `index.html`, or serve the folder with `python -m http.server 8000`. Licensed under [MIT](LICENSE).

---

<p align="center">为颜文字爱好者精心制作 ♡</p>
