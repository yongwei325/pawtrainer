# 项目启动手册（小白版）— 狗狗训练站从零到上线

> 你是小白，我是你的 PM + 操作员。这份手册把"从买域名到网站赚钱"拆成一步一步，**每一步都标了谁来做**：
> - 🟢 **[你]** = 需要你的账号/钱，照着点就行（我给了精确步骤）
> - 🔧 **[我准备]** = 我帮你把文件/配置都弄好，你不用管
> - ▶️ **[你执行]** = 我给你现成命令或点击顺序，你照做
>
> 原则：**最少账号、最少花钱、全免费托管**。最终架构 = GitHub（存代码）+ Cloudflare（域名+托管，全免费）+ Decap 后台（网页写文章）。

---

## 0. 先发给我的信息（开工前必填）

你直接回复我下面这几项，我就能把配置全部填好：

1. **想用的品牌名 / 域名**（给 1–3 个备选，例如 `pawandpraise`、`goodpup`）
   - 后缀建议：`.com`（最稳，约 $10–12/年）或 `.dog` / `.pet`（更贴狗主题，约 $20–40/年）
2. **你的邮箱**（用来注册 GitHub / Cloudflare，不会存密码）
3. **GitHub 用户名想叫什么**（没有就现场注册）

> 收到后我会：把 `config.toml` 的域名、`static/admin/config.yml` 的仓库名等全部填好，并给你一个"专属下一步清单"。

---

## 总览流程（一眼看懂）

```
[你] 注册 GitHub  ─┐
[你] 买域名        │
[你] 注册 Cloudflare┘──► [我准备] 本地站点已就绪
                            │
[你执行] GitHub Desktop 把文件夹推上去
                            │
[你执行] Cloudflare Pages 连 GitHub 自动部署
                            │
[你执行] 建 GitHub OAuth → 后台 /admin 可用
                            │
[你执行] 提交 Google Search Console（收录）
                            │
[你] 持续写文章（AI 起草+你精修）
                            │
[你] 约 20–30 篇后申请 AdSense → 开始赚广告费
```

---

## 阶段 1：注册 GitHub（免费）🟢[你]

1. 打开 https://github.com → 点 **Sign up**
2. 填邮箱、设密码、选用户名（用阶段 0 第 3 项）
3. 验证邮箱 → 完成
4. **装 GitHub Desktop**（图形界面，小白专用，不用敲命令）：
   https://desktop.github.com → 下载安装 → 用刚注册的账号登录

> 为什么用 GitHub Desktop 而不是命令行：零命令、点几下就发布，最适合新手。

---

## 阶段 2：买域名 🟢[你]

**最省事方案：在 Cloudflare 一站买域名+托管**（一个账号搞定，不用改 DNS）。

1. 先注册 Cloudflare 账号：https://cloudflare.com → Sign up（用同一邮箱）
2. 进入 **Registrar**（域名注册）页面 → 搜索你想要的域名（阶段 0 第 1 项）
3. 选一个能注册的后缀（`.com` / `.dog` / `.pet` 等）→ 下单付款
4. 付款后域名归你，Cloudflare 自动管理

> 备选：若 Cloudflare 没有心仪后缀，去 **Namecheap**（https://namecheap.com，UI 更友好）买，之后在 Cloudflare 加站点时把 Nameserver 改成 Cloudflare 给的两个地址即可（一次性）。
>
> 💡 花费：约 **¥70–300/年**，视后缀。这是整个项目唯一必需的花费。

---

## 阶段 3：Cloudflare 加站点 + DNS 🟢[你]

（若域名已在 Cloudflare Registrar 买的，这步基本自动跳过）

1. Cloudflare 控制台 → **Add a Site** → 输入你的域名
2. 按提示把域名的 Nameserver 改成 Cloudflare 提供的两个地址
3. 等待生效（几分钟到几小时，Cloudflare 会邮件通知）

---

## 阶段 4：把网站推到 GitHub ▶️[你执行]

（我准备的本地站点就在 `D:\Yongwei\探讨\`，已含 Hugo+Decap 后台）

1. 打开 **GitHub Desktop**
2. **File → Add Local Repository** → 选文件夹 `D:\Yongwei\探讨`
3. 右上角 **Publish repository**
   - Name：`pawtrainer`（或你的品牌名）
   - 勾选 **Public**
   - 点 **Publish**
4. 等进度条完成 → 代码已在 GitHub

> 之后每次在后台 `/admin` 发文章，Decap 会自动往这个仓库提交，Cloudflare 自动重建——你不用再碰 GitHub Desktop。

---

## 阶段 5：Cloudflare Pages 连 GitHub 自动部署 🟢[你]

1. Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权并选中刚建的仓库 `pawtrainer`
3. 构建设置：
   - **Framework preset**：Hugo
   - **Build command**：`hugo --minify`
   - **Build output directory**：`public`
4. 点 **Save and Deploy**
5. 部署完成后，Cloudflare 会给一个 `xxx.pages.dev` 临时网址 → 先打开看看站点在不在
6. **绑自定义域名**：Pages → Custom domains → 输入你的域名 → 按提示确认（Cloudflare 自动配好 HTTPS）

✅ 此刻网站已上线！打开你的域名就能看到。

---

## 阶段 6：开启后台 /admin（写文章的地方）🟢[你]

Decap CMS 需要用一个免费的 GitHub OAuth 应用来验证你的身份：

1. 打开 https://github.com/settings/developers → **New OAuth App**
2. 填写：
   - **Application name**：`PawTrainer CMS`（随意）
   - **Homepage URL**：`https://你的域名`（阶段 2 买的）
   - **Authorization callback URL**：`https://你的域名/admin/`
3. 创建后，复制 **Client ID**
4. 把 Client ID 发给我（或直接告诉我，我来填进 `static/admin/config.yml` 的 `client_id`）
5. 我改完你再推一次（GitHub Desktop 里 Commit & Push）
6. 打开 `https://你的域名/admin/` → 用 GitHub 登录 → 进入后台

后台里你能：填标题、写正文、传图、勾选"发布"（取消 Draft）、点 Save 即上线。

---

## 阶段 7：提交 Google Search Console（收录）🟢[你]

1. 打开 https://search.google.com/search-console → 用 Google 账号登录
2. **Add Property** → 输入你的域名
3. 验证方式选 **DNS** → 复制 Google 给的 TXT 记录 → 到 Cloudflare DNS 里加一条 TXT → 回 Search Console 点验证
4. 左侧 **Sitemaps** → 提交 `https://你的域名/sitemap.xml`
5. 之后在这里看收录量、展示量、平均排名

---

## 阶段 8：内容生产 SOP（赚钱的核心）🟢[你] + 🔧[我准备]

- 🔧 我已备好：3 套文章模板 + 关键词地图框架（见 `ui-design/` 与计划书）
- 🟢 你每周精修 **3–5 篇**长尾文（AI 起草 70% + 你补真实经验 30%）
- 每篇记得：加作者 bio、引权威外链（AKC 等）、末尾医疗免责
- 只写训练/行为，不写医疗诊断（避 YMYL 风险）

> 节奏：前 3 个月 30–50 篇，6–12 个月到"能提现"量级。别期待前 3 个月有钱。

---

## 阶段 9：申请 AdSense（开始赚钱）🟢[你]

**门槛**：≥20–30 篇原创 + 已有 About/Privacy/Disclaimer 页 + 已提交 Search Console 后再申，避免被拒伤域名信誉。

1. https://www.google.com/adsense → 用 Google 账号申请
2. 填站点域名、收款信息（牵扯你的税务，必须你自己填）
3. 把 Google 给的广告代码发我 → 我注入预留的广告位（文章页已有 `Advertisement` 位）
4. 通过后广告自动展示，按月结算（满 $100 提现）

> 月访问过万可转 **Ezoic** 提 RPM；过 5 万冲 **Mediavine**。联盟营销（Amazon Associates）可同时叠加。

---

## 花费汇总（真实地板价）

| 项目 | 费用 | 必须？ |
|---|---|---|
| 域名 | ¥70–300/年 | ✅ 必需 |
| GitHub | 免费 | ✅ |
| Cloudflare Pages 托管+CDN | 免费 | ✅ |
| Decap 后台 | 免费 | ✅ |
| Google Search Console / GA4 | 免费 | ✅ |
| AdSense 申请 | 免费 | ✅（赚钱用） |
| **总计** | **≈ ¥70–300/年** | 其余全是你的时间 |

---

## 你现在马上要做的事 ✅

1. **回复我**：品牌名/域名备选、邮箱、GitHub 用户名 → 我填好所有配置
2. 按阶段 1 注册 GitHub + 装 GitHub Desktop
3. 按阶段 2 买域名

做完第 1 步，后面我每一步都会给你"对着点"的精确指引。慢慢来，不急。
