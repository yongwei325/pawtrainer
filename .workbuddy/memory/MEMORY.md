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

## 已锁定信息（用户 2026-07-24 提供）
- 品牌名：**PawTrainer**；域名：**pawtrainer.com**（路线 A：先用免费子域 **pawtrainer.pages.dev** 上线，baseURL 已切到 pages.dev；待用户有外币卡或走国内平台买真域名后，再改回并绑 Custom domain）
- 邮箱：**全部账号统一用 70579579@qq.com**（GitHub / Cloudflare / AdSense 同一邮箱，用户 2026-07-24 明确决策）。GitHub 用户名 yongwei325。
- GitHub 用户名：**yongwei325**；仓库：yongwei325/pawtrainer
- 全部占位已替换为 PawTrainer / yongwei325/pawtrainer / pawtrainer.com（全局 Grep 0 残留）。

## 下一步
- 路线 A 进行中：用户用 70579579@qq.com 注册 Cloudflare → 建 Pages 项目连 yongwei325/pawtrainer → 部署（hugo --minify / public / HUGO_VERSION=0.128.0）→ 得 pawtrainer.pages.dev。
- 阶段 6 建 GitHub OAuth 应用后把 Client ID 发我 → 填进 static/admin/config.yml，后台 /admin/ 才可登录。
- 之后把 ui-design 的 premium 设计移植进 Hugo 模板，注入 AdSense/联盟代码。
