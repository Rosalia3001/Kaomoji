# (◕‿◕✿) 颜文字收藏馆 · Kaomoji Collection

> 一个零依赖、零构建的可爱颜文字收藏站。1926 个颜文字，8 大类 44 小节，可搜索，中 / 英 / 日三语界面，点一下就能复制。

[![Version](https://img.shields.io/github/v/tag/Rosalia3001/Kaomoji?style=flat-square&color=ff8fab&label=version)](https://github.com/Rosalia3001/Kaomoji/tags)
[![License](https://img.shields.io/github/license/Rosalia3001/Kaomoji?style=flat-square&color=ff8fab)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-ff8fab?style=flat-square)](#技术栈)
[![i18n](https://img.shields.io/badge/i18n-中文%20%7C%20English%20%7C%20日本語-ff8fab?style=flat-square)](#功能特性)

---

## 简介

颜文字（Kaomoji / 顔文字）是用日文字符与标点拼出的表情符号，相比西式 emoticon 更重眼睛、能表达动作甚至场景。

本项目把散落各处的好看颜文字整理成一个打开就能用的网页：**不用注册、不装任何依赖、没有构建步骤**，打开页面点一下，颜文字就进剪贴板了。

## 功能特性

- **1926 个颜文字**，8 大类、44 小节，紧凑网格一屏约 70 条
- **全局搜索**：吸顶搜索框即时过滤，支持按颜文字内容、分类名匹配（三语均可），显示结果数
- **点击即复制**：优先 `navigator.clipboard`，环境不支持时自动回退 `document.execCommand('copy')`
- **三语界面**：中文 / English / 日本語 一键切换，`localStorage` 记住语言与分类偏好；首次访问按浏览器语言自动匹配
- **键盘友好**：复制项是原生 `<button>`，可 Tab 聚焦回车复制；数字键 `1`–`8` 切换大类；`/` 聚焦搜索框；`Esc` 清空搜索
- **深度链接**：`#ascii` 这样的 hash 可以直接打开对应分类
- **长条目自适应**：按字符数自动缩字号，多行字符画用等宽字体跨两列展示
- **零构建**：没有 npm install、没有打包步骤，改完刷新即生效

## 内容构成

| 大类 | `id`（hash） | 小节数 | 数量 |
| --- | --- | ---: | ---: |
| 积极情绪 | `positive` | 5 | 601 |
| 消极情绪 | `negative` | 6 | 211 |
| 中性情绪 | `neutral` | 4 | 112 |
| 各种动作 | `actions` | 15 | 493 |
| 动物 | `animals` | 8 | 111 |
| 装饰边框 | `decorative` | 4 | 283 |
| 字符画 | `ascii` | 1 | 52 |
| 次文化 | `otaku` | 1 | 63 |
| **合计** | | **44** | **1926** |

## 快速开始

不需要安装任何东西。两种方式任选：

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
├── index.html       # 页面外壳：顶栏、搜索、折叠介绍、空容器（条目由 JS 渲染）
├── kaomoji.js       # 数据文件：window.KAOMOJI_DATA，全部 1926 条内容都在这里
├── script.js        # 渲染与交互：分类、搜索、三语切换、复制
├── style.css        # 全部样式：紧凑网格、字号分档、响应式断点
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

技术栈：原生 HTML / CSS / JavaScript，无任何运行时依赖。

## 添加一个颜文字

内容统一放在 `kaomoji.js` 的 `items` 数组里，每条一行：

```js
{ t: "(◕ᴗ◕✿)", c: "positive", s: "cute" },
```

- `t` 是**真正被复制的内容**；多行字符画直接在字符串里写 `\n`
- `c` 是大类 id，`s` 是小节 id，两者必须已存在于上方 `categories` 声明中
- 新增小节时在对应大类的 `subs` 里补一条（含中 / 英 / 日名），无需改其他文件
- 提交前请确认没有与现有条目重复

## 版本规范

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)：`MAJOR.MINOR.PATCH`

| 位 | 什么时候加 |
| --- | --- |
| `MAJOR` | 页面结构或交互方式发生不兼容变化（例如改掉复制机制、更换数据格式） |
| `MINOR` | 大批量新增内容、新增分类、新增功能，向下兼容 |
| `PATCH` | 修 bug、补少量颜文字、调样式、改文案 |

发布一个版本的固定动作：

1. 更新 `VERSION` 文件
2. 在 `CHANGELOG.md` 顶部加一节，写清「新增 / 变更 / 修复」
3. 同步 `index.html` 页脚里的 `version-badge`
4. 提交并打 tag：`git tag -a v1.1.0 -m "v1.1.0" && git push origin main v1.1.0`
5. 在 GitHub 上用该 tag 建 Release，正文直接贴 CHANGELOG 对应段落

`VERSION`、页脚徽标、tag 三者需保持一致，PR 里请一并改。

## 部署

纯静态，任意静态托管都能跑，最省事的是 GitHub Pages：

1. 仓库 **Settings → Pages**
2. Source 选 `Deploy from a branch`，分支 `main`、目录 `/ (root)`
3. 保存后等一分钟，访问 `https://rosalia3001.github.io/Kaomoji/`

## 已知问题

- 多行字符画在小屏上可能需要横向滚动才能看全（卡片内已支持左右滑动）
- 搜索目前是即时前缀包含匹配，暂不支持拼音与模糊匹配

## 贡献

欢迎提 Issue 或 PR 增补颜文字、补翻译、修样式：

- 颜文字请尽量附来源或说明所属情绪，便于归类
- 一次 PR 只做一类改动（如「新增 10 条动物颜文字」），方便 review
- 提交信息建议带前缀：`feat:` / `fix:` / `style:` / `docs:` / `chore:`

## 来源与致谢

- 最初的 281 条为站主手工整理
- 扩容部分导入自 [kaomojikan/kaomoji-data](https://github.com/kaomojikan/kaomoji-data)（MIT License, Copyright (c) 2026 kaomojikan），经去重、清洗后按本站分类体系重新归位
- 感谢所有颜文字创作者 ♡

## 许可证

[MIT](LICENSE) © 2025-2026 Rosalia3001

可自由使用、修改、分发、商用，保留版权与许可声明即可。

## English

**Kaomoji Collection** — a zero-dependency, zero-build gallery of **1926** cute kaomoji in 8 categories (positive / negative / neutral emotions, actions, animals, decorative frames, ASCII art, otaku). Live search, click-to-copy, and a UI in Chinese / English / Japanese.

No build step: just open `index.html`, or serve the folder with `python -m http.server 8000`. Content lives in `kaomoji.js`. Licensed under [MIT](LICENSE); expanded content is adapted from [kaomojikan/kaomoji-data](https://github.com/kaomojikan/kaomoji-data) (MIT).

---

<p align="center">为颜文字爱好者精心制作 ♡</p>
