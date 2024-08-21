## [1.2.2] - 2024-8-21

### Fix

- 修复表格有垂直滚动条时，列右固定显示不对齐问题 (commit: 3df6d73046d99ef6e277e9e94e24d7c037d2f5a4)


## [1.2.1] - 2024-8-20

### Fix

- 修复懒加载不支持表格单选的问题 (commit: b68481caa3106a5499e063c02b61038c1a4ed5be)
- 修复总结栏的跨列计算没有考虑 勾选能力 和 隐藏列能力 的问题 (commit: bbeba291bb1b442caecb125a3902c7249be5653e)

## [1.2.0] - 2024-8-19

### Feature

- 补充动态输入项[开启 loading][关闭loading]的 rels 输出项 (commit: fde6b0cf2c35bc856e033a351910df1adb014a13)

## [1.1.99] - 2024-8-19

### fix

- 树结构支持默认展开所有项 (commit: 046a9ac6bb3911ee4e3595bf27ab5d68542df575)

## [1.1.98] - 2024-8-19

### fix

- customOptRender 样式不生效 (commit: 8bc13561d625ed9468ed62a1a7b17d6c8955963c)

## [1.1.97] - 2024-8-16

### Feature

- 修改 table-body 选择器，解决组件 css 统一修改 ant 前缀后无法选中问题
- commit: 401fec2f5d88c7af3ee0400792f5cf3b0d86ef76

## [1.1.96] - 2024-8-15

### Feature

- 表格唯一 key 展示、设置优化 (mr: https://github.com/mybricks/comlib-pc-normal/pull/1568)

## [1.1.95] - 2024-8-8

### Chore

- 调整 types，去除类型报红 (commit: 4916fa1fdc7a1ae6414b2a2685f6f6b9a3eeadf2)

## [1.1.94] - 2024-8-8

### Fixed

- 修复表格在兼容模式下，用户传入的字段值为 0 时不展示的问题 (commit: cce6aba3015d77b9046d814466d06374c6a0fdcf)
