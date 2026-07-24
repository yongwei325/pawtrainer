# 项目长期记忆：狗狗训练站 PawTrainer（pawtrainer.com）

## 项目方向（已验证可做）
- 狗狗训练/宠物行为 niche，窄切"新手养狗的训练与行为矫正"，面向美/英/加/澳英语用户。
- 流量：100% Google 自然搜索，不买量。变现：AdSense 广告 + 联盟营销（Amazon + 训犬课程，佣金最高 $103–148/单）双收入。
- 技术栈：Hugo（静态生成器）+ Cloudflare Pages（免费托管）。后台用 Decap CMS（git 驱动、免费、无服务器无数据库）。
- 差异化定位（USP）：正向强化 / 科学派（Force-Free, Science-Based），不写医疗诊断（避 YMYL）。
- 站外引流：以 Pinterest 为主，辅以 Reddit/Quora/HARO；**全站不使用邮件订阅/Newsletter**（用户明确决策）。
- 现实时间线：6–12 个月到"能提现"量级；AdSense 申请门槛 ≥20–30 篇原创。

## 用户协作偏好（重要）
- 用户自述**小白**，要**最简单方式**，希望"把信息发我、我来操作"。
- 边界：涉及钱/身份的步骤（买域名、注册 GitHub/Cloudflare/AdSense、填税务）必须用户自己做；我负责文件/配置/步骤指引。
- 推荐路径：Cloudflare 一站买域名+托管；用 **GitHub Desktop（GUI）** 推代码，避免命令行。

## 已交付物（D:\Yongwei\探讨\）
- `ui-design/`：premium 前端设计稿（index.html/article.html/styles.css/design-system.md），爪印+鼠尾草绿+暖琥珀，Fraunces/Newsreader 字体。尚未移植进 Hugo 模板。
- Hugo 站点骨架：`config.toml`、`static/admin/`(Decap)、`layouts/`、`content/posts/`(示范文)、`ADMIN.md`、`LAUNCH.md`(小白启动手册)。
- 验证坑：Hugo 默认不发布"发布时间晚于当前"的文章（draft/未来日期会被静默隐藏）。

## ⚠️ Cloudflare Pages 关键坑（2026-07-24 实战踩坑）
- **`functions/` 目录部署后不被识别**：项目用 Hugo 预设创建，根目录有 `functions/api/auth.js`，但 Cloudflare Pages 部署后「函数」标签页完全为空、线上 /api/auth 返回静态首页（200 OK），函数根本没执行。GitHub 仓库里文件存在、路径正确也无济于事。
- **解决方案（已验证可行）**：改用 Cloudflare Pages **Advanced Mode**——把 OAuth 代理写成 `static/_worker.js`（Hugo 会原样复制到 `public/_worker.js`），用 `export default { async fetch(request, env) {...} }` 模块语法，`/api/auth` 走 OAuth 逻辑、其余路径 `return env.ASSETS.fetch(request)` 转发静态资源。`_worker.js` 在 `public/` 下 Pages 必定识别。
- **重要**：一旦存在 `_worker.js`，整个 `functions/` 目录会被忽略（Cloudflare 设计如此），所以两者不能混用——已删除 `functions/` 目录。
- Decap CMS 的 `base_url` 必须填 **纯 origin**（`https://pawtrainer.pages.dev`），不能带路径。因为 Decap 的 `Authenticator` 会强制校验弹窗 `e.origin === this.base_url`，而 `e.origin` 永远是协议+主机（无路径）。若 `base_url` 写成 `https://pawtrainer.pages.dev/api`，Decap 会把弹窗来源判定为不匹配，导致 token 被丢弃、无法登录。
- 因此 Worker 必须同时拦截 `/auth`（Decap 实际请求）和 `/api/auth`（兼容旧配置/旧 OAuth callback URL）。
- Cloudflare Pages 环境变量（生产）：`GITHUB_PAT`（PAT 模式，纯文本）或 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`（OAuth 模式）。
- 每次本地改完，用 GitHub Desktop 点 Push origin → Cloudflare 自动重新部署（约 30–60 秒）。bash 环境无 GitHub 凭据，push 会失败，必须由用户用 Desktop 推。

## 已锁定信息（用户 2026-07-24 提供）
- 品牌名：**PawTrainer**；域名：**pawtrainer.com**（路线 A：先用免费子域 **pawtrainer.pages.dev** 上线，baseURL 已切到 pages.dev；待用户有外币卡或走国内平台买真域名后，再改回并绑 Custom domain）
- 邮箱：**全部账号统一用 70579579@qq.com**（GitHub / Cloudflare / AdSense 同一邮箱，用户 2026-07-24 明确决策）。GitHub 用户名 yongwei325。
- GitHub 用户名：**yongwei325**；仓库：yongwei325/pawtrainer；GitHub OAuth Client ID：`0v231iWKpgZb7lu3up9U`。
- 当前线上地址：**https://pawtrainer.pages.dev**（路线 A：Cloudflare Pages 免费子域，零成本，后续可绑定真域名）。
- 全部占位已替换为 PawTrainer / yongwei325/pawtrainer / pawtrainer.pages.dev（全局 Grep 0 残留）。

## 下一步
- 阶段 3 进行中：用户建 GitHub OAuth 应用 → 把 Client ID 发我 → 我填进 static/admin/config.yml，后台 /admin/ 才能登录。
- 后台可用后，先把 About / Privacy / Disclaimer / Contact 四个合规页面补齐（AdSense 必需）。
- 之后把 ui-design 的 premium 设计移植进 Hugo 模板，注入 AdSense/联盟代码。
