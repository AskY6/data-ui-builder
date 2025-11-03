//#region 测试数据
import type { DimensionMeta, DimensionTableData, DimensionTableUIConfig, IndicatorMeta } from "./dimensionTable";
import type { UIHeaderNoIndicatorConfig } from "./dimensionTable";
import type { UIHeaderWithIndicatorConfig } from "./dimensionTable";

const gmv: IndicatorMeta = { code: "gmv", name: "gmv" };
const profit: IndicatorMeta = { code: "profit", name: "profit" };

const region: DimensionMeta = { code: "region", name: "region" };
const bizLine: DimensionMeta = { code: "biz_line", name: "biz_line" };
const subBizLine: DimensionMeta = {
  code: "sub_biz_line",
  name: "sub_biz_line",
};
const dateDimension: DimensionMeta = { code: "date", name: "date" };

const withoutIndicatorConfig: UIHeaderNoIndicatorConfig = {
  dimensions: [
    { type: "dimension", meta: region },
    { type: "dimension", meta: bizLine, alignToParent: false },
    { type: "dimension", meta: subBizLine, alignToParent: true },
  ],
};
const withIndicatorConfig: UIHeaderWithIndicatorConfig = {
  dimensions: [{ type: "dimension", meta: dateDimension }],
  indicator: {
    meta: [{ meta: gmv }, { meta: profit, ignoreDimensions: [dateDimension] }],
    index: 0,
  },
};

// 根据 leftHeaderConfig 和 topHeaderConfig 构建 DimensionTableData。要求每一个维度度覆盖到一条具体的 record

export type IndicatorType = { vvalue: number }
export const tableData: DimensionTableData<IndicatorType, string> = {
  records: [
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line1", order: 1 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 100 } },
        { meta: profit, value: { vvalue: 0.1 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line1", order: 1 },
        { meta: dateDimension, value: "2025-10", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 200 } },
        { meta: profit, value: { vvalue: 0.2 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line1", order: 1 },
        { meta: dateDimension, value: "2025-11", order: 3 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 1100 } },
        { meta: profit, value: { vvalue: 0.11 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line2", order: 2 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 300 } },
        { meta: profit, value: { vvalue: 0.3 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line2", order: 2 },
        { meta: dateDimension, value: "2025-10", order: 2 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 400 }  },
        { meta: profit, value: { vvalue: 0.4 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line3", order: 3 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 400 } },
        { meta: profit, value: { vvalue: 0.99 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line3", order: 3 },
        { meta: dateDimension, value: "2025-10", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 1000 } },
        { meta: profit, value: { vvalue: 0.4 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line2", order: 1 },
        { meta: subBizLine, value: "sub_biz_line4", order: 3 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 500 } },
        { meta: profit, value: { vvalue: 0.5 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region2", order: 1 },
        { meta: bizLine, value: "biz_line3", order: 1 },
        { meta: subBizLine, value: "sub_biz_line5", order: 5 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 500 } },
        { meta: profit, value: { vvalue: 0.5 } },
      ],
    },
    {
      dimensions: [
        { meta: region, value: "region2", order: 1 },
        { meta: bizLine, value: "biz_line3", order: 1 },
        { meta: subBizLine, value: "sub_biz_line5", order: 5 },
        { meta: dateDimension, value: "2025-11", order: 3 },
      ],
      indicators: [
        { meta: gmv, value: { vvalue: 499 } },
        { meta: profit, value: { vvalue: 0.3 } },
      ],
    },
  ],
};

export const uiConfig: DimensionTableUIConfig = {
  type: "indicator_in_head",
  head: withIndicatorConfig,
  left: withoutIndicatorConfig,
};
export const uiConfig2: DimensionTableUIConfig = {
  type: "indicator_in_left",
  head: withoutIndicatorConfig,
  left: withIndicatorConfig,
};
export const uiConfig3: DimensionTableUIConfig = {
  type: "indicator_in_left",
  head: {
    dimensions: [
      { type: "dimension", meta: subBizLine },
      { type: "dimension", meta: dateDimension },
    ],
  },
  left: {
    dimensions: [
      { type: "dimension", meta: region },
      { type: "dimension", meta: bizLine },
    ],
    indicator: {
      meta: [{ meta: gmv }, { meta: profit }],
      index: 1,
    },
  },
};
//#endregion