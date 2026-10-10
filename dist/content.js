window.CHAPTERS = [
  {
    "id": "backend",
    "number": "01",
    "title": "搭好后端的第一块积木",
    "subtitle": "从 Spring Boot 项目到可调试的数据接口。",
    "source": "https://docs.qq.com/doc/DYk51UU9QYmpLT1JL",
    "tags": [
      "Spring Boot",
      "MyBatis-Plus",
      "MySQL",
      "Knife4j"
    ],
    "sections": [
      {
        "id": "environment",
        "title": "开发环境与项目初始化",
        "intro": "先把运行环境打通，再进入业务开发。原文从 IDEA 与 Maven 开始，随后创建 Spring Boot 项目。网站将安装部分整理为环境检查清单。",
        "steps": [
          "准备可正常使用的 IDEA、JDK 和 MySQL；使用正版授权或适用的免费方案。",
          "创建 Maven 类型的 Spring Boot 项目，记录项目包名与所选 JDK、Spring Boot 版本。",
          "确认 Maven 能解析依赖；IDEA 可以使用配置好的 Maven，无需无目的地重复安装。",
          "运行启动类，查看控制台是否成功启动，再添加自己的代码。"
        ],
        "code": "src/main/java/你的包名/\n├── config/       # 配置\n├── controller/   # HTTP 请求入口\n├── service/      # 业务逻辑\n├── mapper/       # 数据访问\n└── pojo/         # 数据实体\nsrc/main/resources/\n└── application.yml",
        "lang": "text",
        "filename": "推荐目录结构",
        "note": "目录为按原文分层思路整理的示意；包名应与自己的项目一致。",
        "checks": [
          "启动类成功运行",
          "Maven 依赖无未解析标记"
        ]
      },
      {
        "id": "first-api",
        "title": "写出第一个测试接口",
        "intro": "测试接口用于确认浏览器请求能进入 Controller。先验证一个不依赖数据库的接口，能把项目启动问题与数据库问题分开排查。",
        "steps": [
          "在启动类所在包的子包中创建 controller。",
          "使用 @RestController 声明接口类，用映射注解声明路径。",
          "启动项目，用浏览器访问对应地址，确认收到响应。"
        ],
        "code": "@RestController\npublic class TestController {\n    @GetMapping(\"/hello\")\n    public String hello(@RequestParam(defaultValue = \"同学\") String name) {\n        return \"Hello, \" + name;\n    }\n}",
        "lang": "java",
        "filename": "TestController.java · 整理示例",
        "note": "代码展示核心片段，省略 package 和 import；测试地址中的端口以项目实际配置为准。",
        "checks": [
          "访问 /hello 能返回文本",
          "修改 name 参数能改变返回内容"
        ]
      },
      {
        "id": "database",
        "title": "连接数据库与创建 admin 表",
        "intro": "原文使用 admin 表贯穿后续练习，字段包括 id、username、userpwd、name、sex、tel、headurl。后端实体字段与前端属性需要保持对应。",
        "steps": [
          "在 pom.xml 中添加与所用 Spring Boot 版本兼容的 MySQL 驱动与 MyBatis-Plus 依赖。",
          "在 application.yml 配置数据库地址、用户名和密码；下方使用环境变量占位。",
          "创建 admin 表，设置主键，并给 username 建立唯一约束。",
          "原文提醒避免因 is 前缀导致布尔属性命名映射不一致；建表与实体设计时一并核对。"
        ],
        "code": "spring:\n  datasource:\n    url: ${DB_URL}\n    username: ${DB_USER}\n    password: ${DB_PASSWORD}\n\n# DB_URL 示例：\n# jdbc:mysql://localhost:3306/practice?useUnicode=true&characterEncoding=utf8",
        "lang": "yaml",
        "filename": "application.yml · 整理示例",
        "note": "连接地址为本地示例，需替换为自己的数据库配置。数据库密码不应写进公开教程或前端代码。",
        "checks": [
          "数据库连接成功",
          "username 有唯一约束",
          "表字段与实体字段对应"
        ]
      },
      {
        "id": "layers",
        "title": "实体、Mapper 与 Service 分层",
        "intro": "一次查询沿着 Controller → Service → Mapper → 数据库流动。实体类描述数据；Mapper 负责访问数据；Service 组织业务；Controller 接收请求并返回结果。",
        "steps": [
          "建立 Admin 实体，映射 admin 表及其主键。",
          "创建继承 BaseMapper<Admin> 的 AdminMapper，并配置 Mapper 扫描。",
          "定义 AdminService 与实现类，使用 MyBatis-Plus 提供的通用服务能力。",
          "在 AdminController 注入 Service，完成查询、新增、修改、删除的基础调用。"
        ],
        "code": "@Mapper\npublic interface AdminMapper extends BaseMapper<Admin> {}\n\npublic interface AdminService extends IService<Admin> {}\n\n@Service\npublic class AdminServiceImpl\n        extends ServiceImpl<AdminMapper, Admin>\n        implements AdminService {}",
        "lang": "java",
        "filename": "Mapper / Service · 整理示例",
        "note": "每个 public 类型分别放入同名 .java 文件；添加对应的 import。",
        "checks": [
          "Controller 不直接拼接 SQL",
          "Mapper 能被扫描到",
          "查询能读取测试记录"
        ]
      },
      {
        "id": "api-docs",
        "title": "用 Knife4j 调试接口",
        "intro": "原文接着引入接口文档：添加依赖、配置类与 Knife4j 配置项，并在接口上使用 Swagger / OpenAPI 注解。接口文档能帮助前端了解请求参数与返回值。",
        "steps": [
          "选择与当前 Spring Boot 版本匹配的 Knife4j / OpenAPI 依赖。",
          "在 config 包中编写文档配置，确认 Controller 包被纳入扫描。",
          "为接口添加描述，为参数和返回值补充说明。",
          "在接口文档页面发送测试请求，逐一验证数据库操作。"
        ],
        "code": "@Operation(summary = \"查询管理员\")\n@PostMapping(\"/admin/list\")\npublic R<?> list(@RequestBody Admin condition) {\n    // 这里接入自己的业务查询，并统一包装返回结果\n    return R.data(adminService.list());\n}",
        "lang": "java",
        "filename": "AdminController.java · 接口注解示意",
        "note": "R 是下一章的统一返回类。此片段仅展示注解与返回方式，条件查询在下一章完善。",
        "checks": [
          "接口在文档页可见",
          "请求参数与实际方法一致",
          "成功和失败结果都有说明"
        ]
      }
    ]
  },
  {
    "id": "backend-plus",
    "number": "02",
    "title": "让接口有一致的表达",
    "subtitle": "统一返回、分页筛选与业务异常处理。",
    "source": "https://docs.qq.com/doc/DYnJSSXBqTE9KQW9E",
    "tags": [
      "统一响应",
      "PageHelper",
      "模糊查询",
      "异常处理"
    ],
    "sections": [
      {
        "id": "response",
        "title": "统一返回结果",
        "intro": "前端需要稳定的响应结构。原文新增 R 与 ResponseCode：R 包装数据，ResponseCode 维护业务状态和提示，减少每个接口各自定义返回格式的情况。",
        "steps": [
          "新增 response 包，集中放置返回结构。原文提到包名曾拼写有误，自己的项目中保持一致即可。",
          "用 code、message、data 表达业务状态、提示与数据；字段名称由前后端共同约定。",
          "将查询结果用 R.data(...) 包装，将不带数据的成功操作用 R.success() 表示。",
          "业务失败使用 R.fail(...)，不要让前端通过提示文本猜测状态。"
        ],
        "code": "{\n  \"code\": 200,\n  \"message\": \"操作成功\",\n  \"data\": {\n    \"list\": [],\n    \"total\": 0,\n    \"pageNum\": 1,\n    \"pageSize\": 10\n  }\n}",
        "lang": "json",
        "filename": "统一响应结构 · 整理示例",
        "note": "此 JSON 展示结构，成功码 200 是示例约定；应与自己 ResponseCode 的实际定义一致。",
        "checks": [
          "新增、查询、修改、删除使用同一返回格式",
          "前端区分 HTTP 状态与业务状态"
        ]
      },
      {
        "id": "pagination",
        "title": "分页与模糊查询",
        "intro": "原文用 PageHelper 配合 LambdaQueryWrapper，对 username、name、tel 进行条件查询。请求体携带条件，查询参数携带 pageNum 与 pageSize。",
        "steps": [
          "添加 PageHelper 分页依赖并完成配置。",
          "为用户名、姓名、电话组合查询条件；空输入不应无意义地加入过滤。",
          "在真正执行查询前调用 PageHelper.startPage。",
          "把查询列表包装为 PageInfo，再放进 R.data 返回。"
        ],
        "code": "@PostMapping(\"/admin/list\")\npublic R<PageInfo<Admin>> list(\n        @RequestBody Admin admin,\n        @RequestParam Integer pageNum,\n        @RequestParam Integer pageSize) {\n    LambdaQueryWrapper<Admin> query = new LambdaQueryWrapper<>();\n    query.like(admin.getUsername() != null,\n            Admin::getUsername, admin.getUsername());\n    query.like(admin.getName() != null,\n            Admin::getName, admin.getName());\n    query.like(admin.getTel() != null,\n            Admin::getTel, admin.getTel());\n    PageHelper.startPage(pageNum, pageSize);\n    List<Admin> rows = adminService.list(query);\n    return R.data(new PageInfo<>(rows));\n}",
        "lang": "java",
        "filename": "AdminController.java · 按原文核心片段整理",
        "note": "保留原文查询顺序；完整实现还应校验分页参数、处理空白字符串，并限制允许的 pageSize。",
        "checks": [
          "第二页与第一页数据不同",
          "total 表示符合条件的总条数",
          "改变条件后从第一页开始查询"
        ]
      },
      {
        "id": "business-error",
        "title": "用业务异常表达预期失败",
        "intro": "用户名已存在、登录信息不正确等属于可以解释给用户的业务结果。原文使用 BusinessException 携带业务码和提示，再交给统一异常处理类。",
        "steps": [
          "在 exception 包中新建 BusinessException。",
          "为常见业务问题设置稳定的 ResponseCode。",
          "在业务判断不成立时抛出异常，由全局处理器转换为统一响应。"
        ],
        "code": "public class BusinessException extends RuntimeException {\n    private final Integer code;\n\n    public BusinessException(Integer code, String message) {\n        super(message);\n        this.code = code;\n    }\n\n    public Integer getCode() {\n        return code;\n    }\n}",
        "lang": "java",
        "filename": "BusinessException.java · 整理示例",
        "note": "这是不依赖 Lombok 的简化写法；可以按项目习惯补充 ResponseCode 构造方法。",
        "checks": [
          "异常保留业务码",
          "前端能显示清楚的失败原因"
        ]
      },
      {
        "id": "global-error",
        "title": "集中处理异常",
        "intro": "@RestControllerAdvice 配合 @ExceptionHandler 将分散的异常转成一致的响应。原文的 ControllerExceptionHandler 分别处理 BusinessException 和其他异常。",
        "steps": [
          "业务异常返回其业务码和消息。",
          "未预期异常记录服务端日志，对外返回通用提示。",
          "在接口文档或前端页面主动触发一次失败，确认响应格式没有变化。"
        ],
        "code": "@RestControllerAdvice\npublic class ControllerExceptionHandler {\n    @ExceptionHandler(BusinessException.class)\n    public R<?> handleBusiness(BusinessException e) {\n        return R.fail(e.getCode(), e.getMessage());\n    }\n}",
        "lang": "java",
        "filename": "ControllerExceptionHandler.java · 按原文整理",
        "note": "这里只展示业务异常处理片段。通用异常处理应配合日志，不向页面直接暴露内部堆栈。",
        "checks": [
          "业务异常不再变成难懂的报错页面",
          "失败响应能被请求封装统一处理"
        ]
      }
    ]
  },
  {
    "id": "frontend",
    "number": "03",
    "title": "把页面组织成一个应用",
    "subtitle": "Vue、路由、Element Plus 与可复用的后台布局。",
    "source": "https://docs.qq.com/doc/DYkpyekZnQ3RwbFVv",
    "tags": [
      "Vue 3",
      "TypeScript",
      "Element Plus",
      "Vue Router"
    ],
    "sections": [
      {
        "id": "vue-create",
        "title": "创建 Vue 项目",
        "intro": "原文通过命令创建 Vue 项目，选择 TypeScript、Vue Router 和 Pinia。先运行默认页面，再进行目录清理，能避免把初始化失败误认为自己的代码问题。",
        "steps": [
          "确认 Node.js 与 npm 可用。",
          "执行创建命令，按向导选择 TypeScript、Vue Router、Pinia。",
          "进入项目目录，安装依赖并启动开发服务器。",
          "删除不再使用的示例组件时，同时移除对应的 import 和样式引用。"
        ],
        "code": "npm create vue@latest\ncd your-project\nnpm install\nnpm run dev",
        "lang": "bash",
        "filename": "终端 · 按原文流程整理",
        "note": "your-project 替换为实际项目目录。创建工具可能随版本变化，界面选项以实际向导为准。",
        "checks": [
          "开发服务器启动",
          "浏览器能打开项目",
          "控制台没有失效导入"
        ]
      },
      {
        "id": "router",
        "title": "入口与路由先跑通",
        "intro": "原文创建 WelcomeView.vue，再修改 App.vue、main.ts 和 router/index.ts。App.vue 提供路由出口，路由配置决定路径对应哪个组件。",
        "steps": [
          "创建一个内容简单的欢迎页。",
          "在 App.vue 放置 RouterView。",
          "在 main.ts 注册 router，在路由表配置欢迎页。",
          "逐个访问路径，确认组件可以切换。"
        ],
        "code": "// router/index.ts\nimport { createRouter, createWebHistory } from 'vue-router'\n\nexport default createRouter({\n  history: createWebHistory(import.meta.env.BASE_URL),\n  routes: [\n    { path: '/', component: () => import('@/views/Index.vue'),\n      children: [\n        { path: '', component: () => import('@/views/WelcomeView.vue') }\n      ]\n    }\n  ]\n})",
        "lang": "typescript",
        "filename": "router/index.ts · 整理示例",
        "note": "Index.vue 同样需要 RouterView，才能显示其子路由。部署使用 history 路由时，服务器要支持页面刷新回退。",
        "checks": [
          "欢迎页可见",
          "父布局与子页面同时显示"
        ]
      },
      {
        "id": "element",
        "title": "引入 Element Plus 与图标",
        "intro": "原文依次引入 Element Plus、安装图标、使用图标，然后增加全局样式。统一组件库能让表单、表格、分页与弹窗保持一致。",
        "steps": [
          "安装 element-plus 与 @element-plus/icons-vue。",
          "在入口注册 Element Plus 并导入样式。",
          "在组件中按需导入图标，搭配 el-icon 使用。",
          "下一章中的中文空状态可通过中文语言包统一配置。"
        ],
        "code": "npm install element-plus @element-plus/icons-vue\nnpm install -D less\nnpm install dayjs",
        "lang": "bash",
        "filename": "终端 · 依赖整理",
        "note": "Less 用于后续全局样式；dayjs 对应原文页脚日期处理。依赖应记录在 package.json 中。",
        "checks": [
          "组件样式正常显示",
          "图标可见",
          "样式文件能编译"
        ]
      },
      {
        "id": "layout",
        "title": "拆分顶部、侧栏与内容区",
        "intro": "原文将后台界面拆成 Header.vue、LeftMenu.vue、Footer.vue，由 Index.vue 组合。内容区通过路由展示具体业务页面。",
        "steps": [
          "在 styles 目录建立 var.less 与 style.less，集中定义颜色、间距与布局规则。",
          "开发顶部标题栏，放置系统名称与用户相关入口。",
          "左侧菜单关联路由；中间内容区域放置 RouterView。",
          "把页脚独立为 Footer.vue，用 dayjs 处理显示日期。"
        ],
        "code": "<template>\n  <div class=\"app-shell\">\n    <Header />\n    <div class=\"app-body\">\n      <LeftMenu />\n      <main class=\"app-main\">\n        <RouterView />\n      </main>\n    </div>\n    <Footer />\n  </div>\n</template>",
        "lang": "vue",
        "filename": "Index.vue · 结构示例",
        "note": "组件导入与样式略。Header、LeftMenu、Footer 均对应原文中的组件拆分。",
        "checks": [
          "切换菜单不会丢失公共布局",
          "内容区显示当前路由",
          "页脚不遮挡表格"
        ]
      },
      {
        "id": "responsive",
        "title": "适配窗口变化",
        "intro": "原文通过计算区域高度适配窗口，并给 el-card 设置高度。关键是让内容区获得剩余空间，同时避免页面出现多余的双重滚动条。",
        "steps": [
          "先明确顶部、底部与内容区的布局关系。",
          "如果监听 resize 计算高度，组件卸载时也要移除监听。",
          "可使用下方补充的 Flex 布局，减少固定高度计算。",
          "缩小窗口检查菜单、表格和页脚是否仍可操作。"
        ],
        "code": ".app-shell { min-height: 100vh; display: flex; flex-direction: column; }\n.app-body { flex: 1; display: flex; min-height: 0; }\n.app-main { flex: 1; min-width: 0; padding: 24px; overflow: auto; }",
        "lang": "css",
        "filename": "布局补充示例",
        "note": "这是网站补充的 CSS 布局方案，不是对原文高度计算代码的逐字转录。",
        "checks": [
          "缩小窗口无内容重叠",
          "宽表格可横向滚动",
          "卸载组件后无残留监听"
        ]
      }
    ]
  },
  {
    "id": "admin",
    "number": "04",
    "title": "让数据在页面上流动",
    "subtitle": "请求封装、列表查询、表单校验与批量操作。",
    "source": "https://docs.qq.com/doc/DYmVHUHNoY2xYWEJT",
    "tags": [
      "Axios",
      "CRUD",
      "表单校验",
      "分页与排序"
    ],
    "sections": [
      {
        "id": "list-page",
        "title": "管理员列表与中文界面",
        "intro": "原文在 views/admin 中创建 List.vue，配置路由，并调整 Element Plus 的中文语言设置。此时先完成页面结构，再连接真实接口。",
        "steps": [
          "添加管理员列表页与对应路由。",
          "用 el-table 展示管理员信息，保留查询区、操作区、分页区。",
          "在 main.ts 配置中文语言包，统一空状态、分页等组件文字。"
        ],
        "code": "import ElementPlus from 'element-plus'\nimport zhCn from 'element-plus/es/locale/lang/zh-cn'\nimport 'element-plus/dist/index.css'\n\napp.use(ElementPlus, { locale: zhCn })",
        "lang": "typescript",
        "filename": "main.ts · 整理示例",
        "note": "app 指已通过 createApp 创建的应用实例；把这段放在 mount 之前。",
        "checks": [
          "菜单能进入列表页",
          "空数据时显示中文提示",
          "每列对应正确的字段"
        ]
      },
      {
        "id": "axios",
        "title": "把网络请求集中管理",
        "intro": "原文在 utils 中创建 constants.ts、utils.ts、request.ts，再在 api/admin-api.ts 封装业务接口。页面只调用接口函数，不重复配置地址和响应处理。",
        "steps": [
          "安装 axios；用环境变量维护接口基础地址。",
          "在 request.ts 创建实例，配置超时并统一处理网络错误。",
          "根据后端 R 的实际定义判断业务成功，再返回数据。",
          "constants.ts 放常量，utils.ts 放通用方法；避免组件之间到处复制请求逻辑。"
        ],
        "code": "import axios from 'axios'\n\nexport const request = axios.create({\n  baseURL: import.meta.env.VITE_APP_API_URL,\n  timeout: 10000\n})\n\n// .env.development 中设置自己的后端地址：\n// VITE_APP_API_URL=http://localhost:8080",
        "lang": "typescript",
        "filename": "utils/request.ts · 最小示例",
        "note": "原文还封装了 post、get 方法。此处仅演示 Axios 实例；后面的接口示例直接使用该实例，返回值保留 AxiosResponse。",
        "checks": [
          "请求地址指向后端",
          "网络失败有明确反馈",
          "业务失败不会显示为成功"
        ]
      },
      {
        "id": "admin-api",
        "title": "明确每一个接口的输入",
        "intro": "原文接口包括 /admin/add、/admin/update、/admin/delete 与 /admin/list，均使用 POST。列表条件放在请求体，分页参数放在查询字符串。",
        "steps": [
          "将页面与具体请求地址分离。",
          "查询方法同时接收条件、页码与每页数量。",
          "新增与修改传递表单对象；删除传递选中记录的 id 集合。"
        ],
        "code": "import { request } from '@/utils/request'\n\nexport const adminApi = {\n  add: (data: unknown) => request.post('/admin/add', data),\n  update: (data: unknown) => request.post('/admin/update', data),\n  remove: (ids: number[]) => request.post('/admin/delete', {}, {\n    params: { ids: ids.join(',') }\n  }),\n  queryPageList: (data: unknown, pageNum: number, pageSize: number) =>\n    request.post('/admin/list', data, { params: { pageNum, pageSize } })\n}",
        "lang": "typescript",
        "filename": "api/admin-api.ts · 按原文接口整理",
        "note": "使用 Axios params 替代原文手动拼接 URL。remove 是本页的方法名，对应原文的删除接口。",
        "checks": [
          "接口路径与后端一致",
          "请求体和查询参数位置正确",
          "删除参数支持多个 id"
        ]
      },
      {
        "id": "query-ui",
        "title": "渲染、查询、分页与跨域",
        "intro": "前端把后端分页响应中的 list 交给表格，把 total 交给分页组件。查询条件变化时重置页码，避免停留在已经不存在的某一页。",
        "steps": [
          "在 mounted 时加载列表，设置加载状态。",
          "提交查询时把 pageNum 改为 1，再重新请求。",
          "切换页码或 pageSize 后重新加载数据；不要对后端已分页的结果再次切片。",
          "前后端地址不同时按项目环境配置跨域；原文用 @CrossOrigin 处理开发联调。"
        ],
        "code": "const rows = ref<unknown[]>([])\nconst total = ref(0)\nconst loading = ref(false)\n\nasync function loadList() {\n  loading.value = true\n  try {\n    const response = await adminApi.queryPageList(\n      filters, pageNum.value, pageSize.value\n    )\n    const result = response.data // 后端 R\n    // 在统一请求封装中先校验 result 的业务状态\n    rows.value = result.data.list\n    total.value = result.data.total\n  } finally {\n    loading.value = false\n  }\n}",
        "lang": "typescript",
        "filename": "List.vue · 数据流示例",
        "note": "filters、pageNum、pageSize 由页面定义；请求封装应先完成业务码判断与错误提示。跨域允许来源应与自己的前端地址匹配。",
        "checks": [
          "筛选条件能影响结果",
          "分页显示正确总数",
          "失败后加载动画能结束"
        ]
      },
      {
        "id": "form",
        "title": "新增、修改与表单校验",
        "intro": "原文继续实现新增和修改，并补充用户名唯一性、电话格式验证与排序。表单校验要同时照顾页面体验和后端数据约束。",
        "steps": [
          "新增时初始化空表单，修改时复制当前行数据，避免未保存就改变列表。",
          "提交前校验必填项与电话格式，再调用 add 或 update。",
          "用户名唯一性由后端与数据库约束保证；编辑时排除当前记录本身。",
          "保存成功后关闭弹窗并刷新列表；失败时保留用户输入。",
          "配置列排序时明确只排序当前页还是让后端对全部结果排序。"
        ],
        "code": "function openEdit(row: AdminForm) {\n  Object.assign(form, { ...row })\n  editing.value = true\n  dialogVisible.value = true\n}\n\nasync function save() {\n  await formRef.value?.validate()\n  if (editing.value) await adminApi.update(form)\n  else await adminApi.add(form)\n  dialogVisible.value = false\n  await loadList()\n}",
        "lang": "typescript",
        "filename": "List.vue · 表单流程示例",
        "note": "AdminForm、formRef 与页面状态需按项目字段声明。调用接口时应先由请求层确认业务成功，再关闭弹窗。",
        "checks": [
          "重复用户名有提示",
          "取消修改不会影响原行",
          "保存后列表同步更新"
        ]
      },
      {
        "id": "delete",
        "title": "删除与批量删除",
        "intro": "原文后端通过 @RequestParam List<Long> ids 接收 id 集合，再使用 removeByIds 批量删除。前端单行删除和批量删除可以复用同一个接口。",
        "steps": [
          "监听表格 selection-change，保存选中的行。",
          "从行对象中提取 id，空选择时禁用批量删除。",
          "让用户确认目标记录，成功后清理选择并重新加载列表。",
          "如果删掉当前页最后一条记录，调整到仍然存在的页码。"
        ],
        "code": "@PostMapping(\"/admin/delete\")\npublic R<?> delete(@RequestParam List<Long> ids) {\n    adminService.removeByIds(ids);\n    return R.success();\n}",
        "lang": "java",
        "filename": "AdminController.java · 按原文整理",
        "note": "完整业务还应检查 id 列表与调用权限。前端确认与状态刷新属于配套步骤。",
        "checks": [
          "取消确认不发出请求",
          "批量删除使用所选 id",
          "删除后页码仍有效"
        ]
      }
    ]
  },
  {
    "id": "login",
    "number": "05",
    "title": "补齐登录体验的最后一环",
    "subtitle": "登录页面、验证码生成与前后端联调。",
    "source": "https://docs.qq.com/doc/DYnZFZXdSQU13Q0Zm",
    "tags": [
      "Login.vue",
      "验证码",
      "业务校验",
      "联调"
    ],
    "sections": [
      {
        "id": "login-page",
        "title": "组织登录页面",
        "intro": "原文将登录功能作为可选补充，创建 login.less、Login.vue，并修改路由。登录页与后台布局的职责不同，应能够独立访问。",
        "steps": [
          "把登录样式放入 styles/login.less，背景与 logo 使用自己的合适素材。",
          "登录表单包括账号、密码和验证码输入区。",
          "在路由中增加登录页，将表单提交与加载状态绑定。",
          "图片验证码需要支持刷新，同时保存与当前图片对应的验证码标识。"
        ],
        "code": "const form = reactive({\n  username: '',\n  userpwd: '',\n  captchaId: '',\n  captchaCode: ''\n})",
        "lang": "typescript",
        "filename": "Login.vue · 按原文字段整理",
        "note": "userpwd、captchaId、captchaCode 与原文后端字段对应；字段名称需保持前后端一致。",
        "checks": [
          "密码输入使用密码框",
          "必填项有提示",
          "刷新图片时同时更新 captchaId"
        ]
      },
      {
        "id": "captcha",
        "title": "验证码由后端生成和校验",
        "intro": "原文新增 CaptchaConfig、工具类和 CommonController，建立验证码生成与缓存流程。前端展示图片，后端保存对应答案与有效状态。",
        "steps": [
          "在 config 包中配置验证码生成器。",
          "在 util 包中组织验证码对象与缓存逻辑。",
          "通过 CommonController 返回图片数据与标识，前端通过 common-api.ts 调用。",
          "提交登录时一并发送 captchaId 与 captchaCode，让后端验证。"
        ],
        "code": "浏览器请求验证码\n      ↓\nCommonController 生成图片 + 标识\n      ↓\n后端缓存答案；前端显示图片\n      ↓\n提交 captchaId + captchaCode\n      ↓\n后端校验 → 消费验证码 → 继续登录",
        "lang": "text",
        "filename": "验证码流程 · 整理示意",
        "note": "验证码答案留在服务端。缓存应有过期与清理机制；单机内存示例不等同于多实例共享缓存。",
        "checks": [
          "图片与标识成对更新",
          "错误验证码会被拒绝",
          "已消费验证码不能再次使用"
        ]
      },
      {
        "id": "login-validation",
        "title": "先校验验证码，再验证账号",
        "intro": "原文在 AdminController 的 /admin/login 中先检查验证码标识与内容，再调用缓存校验，成功后移除验证码，最后查询账号信息。",
        "steps": [
          "验证码参数为空时返回验证码错误。",
          "验证码校验失败时停止后续登录逻辑。",
          "校验成功后移除验证码，再执行账号验证。",
          "账号不匹配时抛出 BusinessException，保持响应结构一致。"
        ],
        "code": "if (StringUtils.isBlank(admin.getCaptchaId())\n        || StringUtils.isBlank(admin.getCaptchaCode())) {\n    return R.fail(ResponseCode.CAPTCHA_ERROR);\n}\nboolean valid = captchaCache.validateCaptcha(\n    admin.getCaptchaId(), admin.getCaptchaCode());\nif (!valid) {\n    return R.fail(ResponseCode.CAPTCHA_ERROR);\n}\ncaptchaCache.removeCaptcha(admin.getCaptchaId());\n// 下一步进入账号验证逻辑",
        "lang": "java",
        "filename": "AdminController.java · 按原文验证码片段整理",
        "note": "片段省略方法定义与依赖注入。实际账号验证应使用密码哈希比对，返回对象不包含密码字段。",
        "checks": [
          "验证码失败时不继续登录",
          "失败结果通过统一异常或响应返回"
        ]
      },
      {
        "id": "login-integration",
        "title": "前后端联调与会话边界",
        "intro": "原文前端新增 common-api.ts 并修改 Login.vue，连接验证码和登录接口。原文登录代码中的 StpUtil 登录与 token 赋值语句处于注释状态，因此不能把该片段视为已完成会话认证。",
        "steps": [
          "先验证验证码接口可用，再验证登录成功与失败分支。",
          "登录失败后刷新验证码，并保留合理的用户输入。",
          "若需要真正保护后台接口，另外完成服务端会话或令牌校验。",
          "页面跳转不等于身份认证，前端路由拦截也不能替代后端权限控制。"
        ],
        "code": "POST /admin/login\nContent-Type: application/json\n\n{\n  \"username\": \"demo\",\n  \"userpwd\": \"示例密码\",\n  \"captchaId\": \"由验证码接口返回的标识\",\n  \"captchaCode\": \"用户输入的字符\"\n}",
        "lang": "http",
        "filename": "登录请求 · 整理示例",
        "note": "这是教学请求示意，不是本站的真实登录账号。本站是教程展示网站，不运行这套管理员后端。",
        "checks": [
          "正确输入能完成预期流程",
          "错误密码和验证码都有反馈",
          "会话能力与演示能力区分清楚"
        ]
      }
    ]
  }
];
