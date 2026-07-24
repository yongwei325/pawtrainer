# PawTrainer — 后台（Decap CMS）部署与使用指南

本站用 **Decap CMS**（原 Netlify CMS）做后台：你在浏览器里填表单写文章、点保存就发布，
内容以 Markdown 提交进 GitHub 仓库，Cloudflare Pages 上的 Hugo 自动重建上线。**无需服务器、无需数据库、每月零成本。**

> 当前 `layouts/` 里是最小可用的占位模板（能跑通"写→发布→可见"）。
> 之后会把 `ui-design/` 里的 premium 设计（Fraunces/Newsreader、鼠尾草绿+暖琥珀）移植进 Hugo 模板。
> 广告位（`.ad`）和联盟卡已预留，接 AdSense/Ezoic 时往模板里塞代码即可。

---

## 一、首次部署（一次性）

### 1. 推到 GitHub
```bash
git init
git add .
git commit -m "initial: Hugo site + Decap CMS admin"
git remote add origin https://github.com/yongwei325/pawtrainer.git
git push -u origin main
```

### 2. 建一个免费的 GitHub OAuth 应用（Decap 登录用）
1. GitHub → 右上角头像 → **Settings** → 左侧 **Developer settings** → **OAuth Apps** → **New OAuth App**。
2. Application name：`PawTrainer Admin`
3. Homepage URL：`https://你的域名`（例如 `https://pawtrainer.com`）
4. Authorization callback URL：**`https://你的域名/admin/`**（结尾斜杠必须有）
5. 创建后复制 **Client ID**，填进 `static/admin/config.yml` 的 `client_id`。
   （Client Secret 只留在 OAuth 应用里，不需要写进仓库——Decap 在浏览器里完成 token 交换。）

### 3. 连接 Cloudflare Pages
1. Cloudflare 控制台 → **Workers & Pages** → **Create** → 连接 GitHub 仓库。
2. 构建命令：`hugo --minify`（或 `hugo --gc --minify`）
3. 构建输出目录：`public`
4. 环境变量（可选但推荐）：`HUGO_VERSION = 0.128.0`（锁定版本，避免日后 Hugo 大版本变动踩坑）
5. 部署。部署完成后访问 `https://你的域名/admin/` → 用 GitHub 授权登录 → 进入编辑后台。

---

## 二、日常使用

### 写文章
1. 后台左侧 **Collections → Articles → New Article**。
2. 填字段：
   - **Title** — 标题
   - **Publish Date** — 发布时间。**必须是"现在"或过去时间**（见下方"坑"）。
   - **Draft** — 写作时保持 ON；**要发布就取消勾选再 Save**。
   - **Category** — Puppy Basics / Behavior Problems / Commands / Gear & Reviews
   - **Tags** — 标签，会自动生成 `/tags/xxx` 内链页（利于 SEO 站内互链）
   - **Excerpt** — 卡片和搜索结果里的摘要
   - **Author** — 作者名 + bio（E-E-A-T 信号，建议每篇填真实经验）
   - **Hero Image** — 上传图片（存到 `static/images/`，自动用 WebP 前建议先压缩）
   - **Affiliate Product** — 可选，填产品名/联盟链接/价格/披露语（自动带 `rel="sponsored nofollow"`）
   - **Show AdSense ads** — 默认开
   - **Content** — 正文，Markdown 编辑器，可实时预览
3. 右上角 **Save**。GitHub 收到提交 → Cloudflare 自动重建 → 通常 1 分钟内上线。

### 写固定页
后台 **Pages** 里已预置 **About / Privacy Policy / Disclaimer**，填正文即可。
（AdSense 过审需要 Privacy Policy 和 About；Disclaimer 放医疗免责声明，规避 YMYL 风险。）

---

## 三、踩坑提醒

- **未来日期的文章不会显示。** Hugo 默认不发布"发布时间晚于当前"的文章。Decap 的日期控件若选了未来时间，文章会被静默隐藏。发布时把日期设为现在或过去即可。
- **Draft 开关 = 发布开关。** 新文章默认 `draft: true`（隐藏）。取消勾选并 Save 才对外可见。
- **改了 `config.yml` 要重新部署。** 集合字段改动需提交后等 Cloudflare 重建。
- **图片体积。** 上传前先压缩；Hugo 默认不自动转 WebP，靠你控制大小（速度直接影响广告 RPM）。

---

## 四、本地预览（可选）
```bash
hugo server -D      # -D 含草稿，本地 http://localhost:1313
```
> 注意：本地 `localhost:1313/admin/` 的 OAuth 回调与线上域名不一致，后台登录请在**已部署的线上域名** `/admin/` 操作。
> 本地想测后台可用 `npx decap-server` 起本地 OAuth 代理（进阶，搜 "Decap CMS local backend"）。

---

## 五、文件结构
```
config.toml                 # Hugo 配置（改 baseURL）
static/admin/
  index.html                # Decap 加载页（/admin/）
  config.yml                # 集合/字段配置（改 repo、client_id）
content/posts/*.md          # 文章（Decap 自动生成）
content/{about,privacy,disclaimer}.md
layouts/                    # 占位模板，后续替换为 premium 设计
archetypes/default.md
.gitignore                  # 忽略 /public 构建产物
```
