# lint

我们通常会在项目中使用 ESLint、Stylelint 来协助我们把控编码质量，为了实现低成本、高性能、更稳定地接入工具, 提供了开箱即用的 Lint 能力，包含以下特性：

1. 推荐配置：提供 ESLint 及 Stylelint 推荐配置，在发布系统执行检查时使用推荐配置
2. 统一的 CLI：提供 lint CLI，集成式调用 ESLint 和 Stylelint
3. 规则稳定：始终确保规则的稳定性，不会出现上游配置更新导致存量项目 lint 失败的情况

### 配置原则

我们依据以下三条原则，研读了 ESLint 所有的配置项，定制出了心目中的「完美」ESLint 配置。

1. 能够帮助发现代码错误的规则，全部开启
2. 配置不应该依赖于某个具体项目，而应尽可能的合理
3. 帮助保持团队的代码风格统一，而不是限制开发体验

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

#### 指定静态扫描目录

```bash
# 指定扫描client目录
zalint eslint client

# 指定扫描client目录
zalint stylelint client

# 指定扫描client目录
zalint report client
```

#### 与 Git 工作流结合

我们也推荐使用 lint-staged 和 Husky，将 lint 与 Git 工作流结合使用，以便在提交代码时自动 lint 本次变更的代码。

#### 自定义配置规则

zalintrc.json 配置文件，并且上传配置数据

```json
{
  "eslintrc": {
    "rules": {
      "indent": "error"
    }
  },
  "stylelintrc": {
    "rules": {}
  },
  "prettierrc": {
    "rules": {
      "arrowParens": "always"
    }
  }
}
```

### link

https://alloyteam.github.io/eslint-config-alloy/?language=zh-CN

内置的 ESLint 规则列表：


内置的 Stylelint 配置：