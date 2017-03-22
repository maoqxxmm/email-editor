## email-editor

### 目的

以前端熟悉的方式生成带有velocity模板语言的邮件，
使用 `scss`, `Handlebars` 进行开发。

### 开发过程

#### src目录为开发目录，以下是src的目录结构

`/data`: 放置 `hbs` 模板中使用的变量，目的是辅助 `gulp` 生成多语言 `html`

`/entry`: 放置 `hbs` 模板，`hbs`模板是邮件页面的入口，一个 `entry` 对应 `data` 中的一个 `json` 文件

`/img`: 存放 `icon`，可以自行扩展一下，打包成 `sprite`

`/partials`: 共用的 `hbs`

`/styles`: `scss` 目录

#### 开发

1. `npm run watch` 进行gulp watch
2. `npm run start` 开启node服务，可通过 `/mail/:page` 预览效果，映射关系在 `routes/index.js`
3. `mock/mails` 中可对java端给的数据进行mock，以路由page字段为key

#### build

`npm run build` 通过 `gulp` 生成最终的html文件，并产生对应的title文件（java端发送邮件需要使用），产生的最终文件在 `build` 目录下。复制整个目录替换 `web` 项目中的 `view/mail`

#### 验证

页面本地开发完成后需实际发送邮件验证在邮箱中的实际情况,
访问 `/send` 可使用nodemailer发送邮件进行验证

### Usage

1. `npm i`
2. `npm run watch`
3. `npm run build`
