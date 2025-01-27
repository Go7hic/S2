---
title: Tooltip
order: 4
---

## Tooltip

object **必选**,_default：null_ 功能描述： tooltip 配置

| 参数               | 类型                                    | 必选  | 默认值 | 功能描述                                                                                                     |
| ------------------ | --------------------------------------- | :---: | ------ | ------------------------------------------------------------------------------------------------------------ |
| showTooltip        | `boolean`                               |       | `true` | 是否展示 tooltip                                                                                             |
| operation          | [TooltipOperation](#tooltipoperation)   |       |        | tooltip 操作配置项                                                                                           |
| row                | [BaseTooltipConfig](#basetooltipconfig) |       |        | 行头配置                                                                                                     |
| col                | [BaseTooltipConfig](#basetooltipconfig) |       |        | 列头配置                                                                                                     |
| cell               | [BaseTooltipConfig](#basetooltipconfig) |       |        | 单元格配置                                                                                                   |
| renderTooltip      | [RenderTooltip](#rendertooltip)         |       |        | 自定义整个 tooltip, 可以继承 BaseTooltip 自己重写一些方法                                                    |
| tooltipComponent   | `JSX.Element`                           |       |        | 自定义 tooltip 弹框组件                                                                                      |
| autoAdjustBoundary | `container` \| `body`                   |       | `body` | 当 tooltip 超过边界时自动调整显示位置, container: 图表区域, body: 整个浏览器窗口, 设置为 `null` 可关闭此功能 |

### BaseTooltipConfig

| 参数             | 类型                                  | 必选  | 默认值 | 功能描述                |
| ---------------- | ------------------------------------- | :---: | ------ | ----------------------- |
| showTooltip      | `boolean`                             |       | `true` | 是否展示 tooltip        |
| operation        | [TooltipOperation](#tooltipoperation) |       |        | tooltip 操作配置项      |
| tooltipComponent | `JSX.Element`                         |       |        | 自定义 tooltip 弹框组件 |

### TooltipOperation

object **必选**,_default：null_ 功能描述： tooltip 操作配置项

| 参数          | 类型      | 必选  | 默认值  | 功能描述                      |
| ------------- | --------- | :---: | ------- | ----------------------------- |
| hiddenColumns | `boolean` |       | `true`  | 是否开启隐藏列 （明细表有效） |
| trend         | `boolean` |       | `false` | 是否显示趋势图 icon           |
| sort          | `boolean` |       | `false` | 是否开启组内排序              |

### RenderTooltip

```js
RenderTooltip = (spreadsheet: BaseSpreadSheet) => BaseTooltip;
```

功能描述：行列布局结构自定义回调函数

| 参数        | 类型                                                | 必选  | 默认值 | 功能描述                         |
| ----------- | --------------------------------------------------- | :---: | ------ | -------------------------------- |
| spreadsheet | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |       |        | 表类实例，可以访问任意的配置信息 |
