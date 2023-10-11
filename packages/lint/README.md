# lint

我们通常会在项目中使用 ESLint、Stylelint 来协助我们把控编码质量，为了实现低成本、高性能、更稳定地接入工具, 提供了开箱即用的 Lint 能力，包含以下特性：

1. 推荐配置：提供 ESLint 及 Stylelint 推荐配置，在发布系统执行检查时使用推荐配置
2. 统一的 CLI：提供 lint CLI，集成式调用 ESLint 和 Stylelint
3. 规则稳定：始终确保规则的稳定性，不会出现上游配置更新导致存量项目 lint 失败的情况

# 设计目标

在现有规范下，把分散在项目中的依赖统一集成到了zalint命令包中维护升级。对于规范将内置在zalint中，不提供外部配置方式。后续将使用 zalint 内置的规范执行


### 使用

#### 安装

```
yarn add @magijs/lint@latest
```

#### 执行命令

```bash
# 执行eslint检查js代码规范
zalint eslint

# 执行stylelint检查样式规范
zalint stylelint

# 生成报告，同时执行eslint和stylelint
zalint report

#
zalint staged
```

#### 自定义静态扫描目录

```bash
# 指定扫描client目录
zalint eslint -d client -fix

# 指定扫描client目录
zalint stylelint -d client -fix

# 指定扫描client目录
zalint report -d client
```

#### 与 Git 工作流结合

将 lint 与 Git 工作流结合使用，以便在提交代码时自动 lint 本次变更的代码。

git commit 流程检查:

- git commit 时会自动执行npm run precommit，若执行报错将终止提交
- 校验 commit 消息格式是否合法，若不合法将终止提交
- 校验 git config user.email 配置是否为众安(xxx@zhongan.com)邮箱，否则终止提交

### link

https://alloyteam.github.io/eslint-config-alloy/?language=zh-CN

内置的 ESLint 规则列表：

内置的 Stylelint 配置：
