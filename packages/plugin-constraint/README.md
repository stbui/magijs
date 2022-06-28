# 强约束规则

## 开启、禁用和检查状态

### 开启强约束

```js
export default {
    strict: {},
};
```

### 启用额外规则

所有规则是默认开启的，但以下规则除外

    FILES_ALL_TYPESCRIPT

如有需要，可通过 strict.rules 开启

```js
export default defineConfig({
    strict: {
        rules: {
            FILES_ALL_TYPESCRIPT: true,
        },
    },
});
```

### 规则禁用

原则上不允许禁用规则

### 检查开启禁用状态

执行 magi constraint 命令

## 规则列表

### DEP_MAGI_LATEST

magi 版本不允许写死，只能使用 ^ 前缀。

```
// bad
"@magi/magi": "1.0.0"
// still bad
"@magi/magi": "~1.0.0"

// good
"@magi/magi": "^1.0.0"
```

如果出于某些原因使用了 beta 版，也需使用 ^ 前缀保证正式版发布后能自动匹配到。

```
// bad
"@magi/magi": "1.0.0-beta.1"

// good
"@magi/magi": "^1.0.0-beta.1"
"@magi/magi": "^1.0.0-0"
```
