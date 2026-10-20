# 更新日志

本项目所有值得记录的变更都会写在这里。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本（SemVer）](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中

- 增加「收藏」功能，把常用颜文字固定在顶部
- 补充键盘可访问性（复制项支持 Tab 聚焦与回车触发）

## [1.0.0] - 2026-10-20

首个正式发布版本。将 2025-10-21 起的全部历史提交归并为 `1.0.0`。

### 新增

- 281 个颜文字，按 5 大类、29 个小节组织：积极情绪（喜悦 / 爱 / 害羞 / 安慰）、消极情绪（不满 / 生气 / 伤心 / 痛苦 / 害怕）、中性情绪（不关心 / 困惑 / 怀疑 / 惊讶）、各种动作（问候 / 抱抱 / 眨眼 / 抱歉 / 鼻出血 / 隐身 / 跑步 / 写字 / 睡觉）、动物（猫 / 熊 / 狗 / 兔子 / 猪 / 鸟 / 其他动物）
- 中 / 英 / 日三语界面切换，语言偏好写入 `localStorage`；首次访问按浏览器语言自动选择
- 点击任意颜文字复制到剪贴板，优先使用 `navigator.clipboard`，不可用时回退到 `document.execCommand('copy')`
- 复制成功浮层提示，2 秒后自动消失，Esc 可手动关闭
- 分类切换淡入动效、卡片悬停位移、页面载入渐显
- 数字键 `1`–`5` 快速切换分类
- 移动端响应式布局（768px / 480px 两档断点）

### 工程化

- 新增 `README.md`：项目说明、内容清单、本地运行、颜文字添加规范、版本约定
- 新增 `LICENSE`：MIT
- 新增 `VERSION` 与 `CHANGELOG.md`，建立语义化版本基线
- 新增 `.gitignore`、`.editorconfig`、`.gitattributes`，统一编辑器行为与换行符（仓库内 LF）
- 新增 `favicon.svg`
- `index.html` 补充 `description` / `keywords` / Open Graph 等页面元信息
- 页脚展示当前版本号与许可证入口

[未发布]: https://github.com/Rosalia3001/Kaomoji/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Rosalia3001/Kaomoji/releases/tag/v1.0.0
