//#region tool
export type Tree<T> = {
  value: T | null;
  children: Tree<T>[];
};
export const travelTree = <T>(
  tree: Tree<T>,
  callback: (node: Tree<T>) => void
) => {
  callback(tree);
  tree.children.forEach((child) => travelTree(child, callback));
};

export const getLeafCountOfTree = <T>(tree: Tree<T>): number => {
  let count = 0;
  travelTree(tree, (node) => {
    if (node.children.length === 0) count++;
  });
  return count;
};
export const getDepthOfTree = <T>(tree: Tree<T>): number => {
  return (
    tree.children.reduce(
      (max, child) => Math.max(max, getDepthOfTree(child)),
      0
    ) + 1
  );
};
export const getLeafCountOfTreeList = <T>(treeList: Tree<T>[]): number => {
  return treeList.reduce((sum, tree) => sum + getLeafCountOfTree(tree), 0);
};
export const getDepthOfTreeList = <T>(treeList: Tree<T>[]): number => {
  return treeList.reduce((max, tree) => Math.max(max, getDepthOfTree(tree)), 0);
};

export type TwoDimensionTable<T> = T[][];
export const createEmptyTwoDimensionTable = (
  rowCount: number,
  columnCount: number
): TwoDimensionTable<null> => {
  return Array.from({ length: rowCount }, () =>
    Array.from({ length: columnCount }, () => null)
  );
};
export const travelTwoDimensionTable = <T>(
  table: TwoDimensionTable<T>,
  callback: (cell: T, rowIndex: number, columnIndex: number) => void
) => {
  table.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      callback(cell, rowIndex, columnIndex);
    });
  });
};
export const mapTwoDimensionTable = <T, R>(
  table: TwoDimensionTable<T>,
  callback: (cell: T, rowIndex: number, columnIndex: number) => R
): TwoDimensionTable<R> => {
  return table.map((row, rowIndex) =>
    row.map((cell, columnIndex) => callback(cell, rowIndex, columnIndex))
  );
};
//#endregion

//#region base define
export type DimensionMeta = {
  code: string;
  name: string;
};
export const dimensionMetaEqual = (a: DimensionMeta, b: DimensionMeta) =>
  a.code === b.code;
export type DimensionValue = {
  meta: DimensionMeta; // 维度的元信息
  value: string; // 维度枚举值的值
  order: number; // 排序的绝对位置
};
export const isDimensionValueEqual = (a: DimensionValue, b: DimensionValue) => {
  const metaEqual = dimensionMetaEqual(a.meta, b.meta);
  const valueEqual = a.value === b.value;
  return metaEqual && valueEqual;
};
/**
 * a 是否是 b 的超集
 * @param a
 * @param b
 * @returns
 */
export const aIsBSuperSet = (a: DimensionValue[], b: DimensionValue[]) => {
  const bIna = b.every((bv) => a.some((av) => isDimensionValueEqual(av, bv)));
  return bIna;
};
export const dimensionValueEqualInMeta = (
  a: DimensionValue,
  b: DimensionValue
) => dimensionMetaEqual(a.meta, b.meta);

export type IndicatorMeta = {
  code: string;
  name: string;
};
export type IndicatorValue = {
  meta: IndicatorMeta;
  value: number; // todo: 细化 value
};

export type DimensionTableQuery = {
  // 维度顺序表示下钻的顺序
  dimensions: DimensionMeta[];
  // 指标本身无顺序，只是表达每一条信息需要返回这些字段
  indicators: IndicatorMeta[];
};
export type DimensionTableData = {
  records: {
    dimensions: DimensionValue[];
    indicators: IndicatorValue[];
  }[];
};
// 以 dimensionMetaList 为 key， 找到所有 key 的可能组合

const getAllDimensionValuesFromData = (
  data: DimensionTableData,
  dimensionMeta: DimensionMeta,
  shouldPick: (record: DimensionTableData["records"][number]) => boolean = () =>
    true
): DimensionValue[] => {
  let values: DimensionValue[] = [];
  for (const record of data.records) {
    if (!shouldPick(record)) continue;
    const dimensionValue = record.dimensions.find(
      (d) => d.meta.code === dimensionMeta.code
    );
    if (dimensionValue) {
      if (!values.some((v) => v.value === dimensionValue.value)) {
        values.push(dimensionValue);
      }
    }
  }
  return values;
};
//#endregion

//#region for ui, not for specific render. only config
export type UIConfigDimension =
  | {
      type: "dimension";
      meta: DimensionMeta;
      // 展示上是否委托于父节点。用途：层级结构在一列中展示，通过缩进等方式在一列中展示层级结构
      alignToParent?: boolean;
    }
  | {
      type: "indicator";
      meta: IndicatorMeta[]; // 应该是一组指标的描述。被当作伪维度时，IndicatorMeta 相当于维度枚举值，一组 IndicatorMeta 构成一个伪维度
      // 展示上是否委托于父节点。用途：层级结构在一列中展示，通过缩进等方式在一列中展示层级结构
      alignToParent?: boolean;
    };
export type UIHeaderNoIndicatorConfig = {
  dimensions: UIConfigDimension[];
};

export const isAlignToParent = (dimension: UIConfigDimension) =>
  Boolean(dimension.alignToParent);
export const isNotAlignToParent = (dimension: UIConfigDimension) =>
  !isAlignToParent(dimension);
export const checkUIHeaderNoIndicatorConfig = (
  config: UIHeaderNoIndicatorConfig
) => {
  // alignToParent 的节点后，不允许再有独立的 dimension，也必须 alignToParent
  if (config.dimensions.every(isNotAlignToParent)) return true;

  const firstAlignIndex = config.dimensions.findIndex(isAlignToParent);

  return config.dimensions.slice(firstAlignIndex).every(isAlignToParent);
};

export type UIHeaderWithIndicatorConfig = UIHeaderNoIndicatorConfig & {
  // 数组顺序表示下钻维度
  indicator: {
    meta: IndicatorMeta;
    index: number; // 插入的位置，指标未必在末端，如果插入在维度列表的中间，那么处于 indicator 之后的维度需要被多次展开（不同指标下都要展开一次）
  };
};
export const checkUIHeaderWithIndicatorConfigValid = (
  config: UIHeaderWithIndicatorConfig
) => {
  const indicatorResult = config.indicator.index < config.dimensions.length;
  return checkUIHeaderNoIndicatorConfig(config) && indicatorResult;
};

export type IndicatorInHeadConfig = {
  type: "indicator_in_head";
  head: UIHeaderWithIndicatorConfig;
  left: UIHeaderNoIndicatorConfig;
};
export type IndicatorInLeftConfig = {
  type: "indicator_in_left";
  head: UIHeaderNoIndicatorConfig;
  left: UIHeaderWithIndicatorConfig;
};
export type DimensionTableUIConfig =
  | IndicatorInHeadConfig
  | IndicatorInLeftConfig;
//#endregion

// region for ui, for render
export type BaseCell = {
  // 计算出来唯一 key, 用来计算合并单元格的目的
  keyForMerge: string;
};
export type IndicatorCell = BaseCell & {
  indicator: IndicatorValue;
};
export type DimensionCell = BaseCell & {
  dimension: DimensionValue;
};
export type Cell = IndicatorCell | DimensionCell;
export type DataForDisplay = {
  cells: TwoDimensionTable<Cell>;
};
//#endregion

// 下钻路径可能是维度或者指标。
// 维度代表正常的下钻
// 指标代表伪维度
//  1. 只是对前序维度的一个透明代理
//  2. 如果指标本身配置了有效的维度，那么如果后续的维度无效，则不按后续的维度下钻，而是聚合成一个值
export type DrillPath = UIConfigDimension[];
export type DimensionNodeValue =
  | {
      type: "dimension";
      value: DimensionValue;
    }
  | {
      type: "indicator";
      value: IndicatorMeta;
    };
/**
 * 检查维度对于指标是否有意义
 * @param dimension
 * @param indicator
 */
export const isDimensionValidateForIndicator = (
  dimension: DimensionMeta,
  indicator: IndicatorMeta
): boolean => {
  throw new Error("not implemented");
};
export const createDimensionNodeValue = (
  value: DimensionValue
): DimensionNodeValue => {
  return { type: "dimension", value };
};
export const createIndicatorNodeValue = (
  value: IndicatorMeta
): DimensionNodeValue => {
  return { type: "indicator", value };
};

// 根据下钻路径和维度枚举值，构建 tree。 可以同时适用于 行 和 列
const buildTree = (
  drillPath: DrillPath,
  data: DimensionTableData,
  preDimensionValues: DimensionNodeValue[] = []
): Tree<DimensionNodeValue>[] => {
  if (drillPath.length === 0) return [];

  const firstPath = drillPath[0];
  const restPath = drillPath.slice(1);

  if (firstPath.type === "dimension") {
    // dimensionMeta -> dimensionValue[] -> Tree<DimensionValue>[]
    const dimensionValues = getAllDimensionValuesFromData(
      data,
      firstPath.meta,
      (record) => {
        const isDimensionListMatch = aIsBSuperSet(
          record.dimensions,
          preDimensionValues
            .filter((v) => v.type === "dimension")
            .map((v) => v.value)
        );
        const dimensionValidate = preDimensionValues
          .filter((v) => v.type === "indicator")
          .every((v) =>
            isDimensionValidateForIndicator(firstPath.meta, v.value)
          );
        return isDimensionListMatch && dimensionValidate;
      }
    );
    const treeList: Tree<DimensionNodeValue>[] = dimensionValues.map(
      (value) => {
        const nodeValue = createDimensionNodeValue(value);
        return {
          value: nodeValue,
          children: buildTree(restPath, data, [
            ...preDimensionValues,
            nodeValue,
          ]),
        };
      }
    );
    return treeList;
  }

  if (firstPath.type === "indicator") {
    // indicatorMeta -> IndicatorMeta[] -> Tree<DimensionNodeValue>[]
    const indicatorMeta = firstPath.meta;
    const treeList: Tree<DimensionNodeValue>[] = indicatorMeta.map((value) => {
      const nodeValue = createIndicatorNodeValue(value);
      return {
        value: nodeValue,
        children: buildTree(restPath, data, [...preDimensionValues, nodeValue]),
      };
    });
    return treeList;
  }

  return [];
};

const treeToDisplayCells = (
  treeList: Tree<DimensionNodeValue>[]
): DataForDisplay => {
  const leafCount = getLeafCountOfTreeList(treeList);
  const depth = getDepthOfTreeList(treeList);
  const emptyTable = createEmptyTwoDimensionTable(depth, leafCount);
  return {
    cells: mapTwoDimensionTable(
      emptyTable,
      (_, rowIndex, columnIndex): Cell => {
        throw new Error("not implemented");
      }
    ),
  };
};
export const configAndDataToDisplay = (
  drillPath: DrillPath,
  data: DimensionTableData
) => treeToDisplayCells(buildTree(drillPath, data));
