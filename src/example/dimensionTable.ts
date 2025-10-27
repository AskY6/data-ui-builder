//#region tool
export type Tree<T> = {
  value: T | null;
  children: Tree<T>[];
};
/**
 * @param row 第 row 个节点对应的下钻路径
 * @param depth 下钻路径的第 depth 个元素
 */
export const findNodeByRowAndDepth = <T>(
  tree: Tree<T>[],
  row: number,
  depth: number
): Tree<T> | null => {
  const treeLeafCountList = tree.map(getLeafCountOfTree);

  let accRowCount = 0;
  for (let i = 0; i < treeLeafCountList.length; i++) {
    const nextAccRowCount = (accRowCount += treeLeafCountList[i]);
    if (nextAccRowCount > row) {
      const nextTree = tree[i];
      // 结束条件
      if (depth === 0) {
        return tree[i];
      } else {
        return findNodeByRowAndDepth(
          nextTree.children,
          row -
            treeLeafCountList.slice(0, i).reduce((acc, next) => acc + next, 0),
          depth - 1
        );
      }
    }
  }
  return null;
};
export const travelTree = <T>(
  tree: Tree<T>,
  callback: (node: Tree<T>, nodePath: Tree<T>[]) => void,
  nodePath: Tree<T>[] = []
) => {
  const newNodePath: Tree<T>[] = [...nodePath, tree];
  callback(tree, newNodePath);
  tree.children.forEach((child) => travelTree(child, callback, newNodePath));
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
export const createEmptyTwoDimensionTableWithCell = <T>(
  rowCount: number,
  columnCount: number,
  getT: (rowIndex: number, columnIndex: number) => T
): TwoDimensionTable<T> => {
  return createEmptyTwoDimensionTable(rowCount, columnCount).map(
    (row, rowIndex) => row.map((_, columnIndex) => getT(rowIndex, columnIndex))
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

export const getNodesInRowToRight = <T>(
  table: TwoDimensionTable<T>,
  rowIndex: number,
  columnIndex: number
): T[] => {
  return table[rowIndex].slice(columnIndex);
};
export const getNodesInRowToLeft = <T>(
  table: TwoDimensionTable<T>,
  rowIndex: number,
  columnIndex: number
): T[] => {
  return table[rowIndex].slice(0, columnIndex);
};
export const getNodesInColToTop = <T>(
  table: TwoDimensionTable<T>,
  rowIndex: number,
  colIndex: number
): T[] => {
  const colItems: T[] = [];
  for (let i = 0; i < rowIndex; i++) {
    for (let j = 0; j <= colIndex; j++) {
      if (j === colIndex) {
        colItems.push(table[i][j]);
      }
    }
  }
  return colItems;
};
export const getNodeInColToBottom = <T>(
  table: TwoDimensionTable<T>,
  rowIndex: number,
  columnIndex: number
): T[] => {
  const tableRowCount = table[0].length;

  const colItems: T[] = [];
  for (let i = rowIndex; i < tableRowCount; i++) {
    const newItem = table[i][columnIndex];
    colItems.push(newItem);
  }
  return colItems;
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
  const values: DimensionValue[] = [];
  for (const record of data.records) {
    if (!shouldPick(record)) continue;
    const dimensionValue = record.dimensions.find(
      (d) => d.meta.code === dimensionMeta.code
    );
    if (dimensionValue) {
      // 去重
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
      meta: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] }[]; // 应该是一组指标的描述。被当作伪维度时，IndicatorMeta 相当于维度枚举值，一组 IndicatorMeta 构成一个伪维度
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
    meta: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] }[];
    index: number; // 插入的位置，指标未必在末端，如果插入在维度列表的中间，那么处于 indicator 之后的维度需要被多次展开（不同指标下都要展开一次）
  };
};
export const getDrillPathFromUIHeaderWithIndicatorConfig = (
  config: UIHeaderWithIndicatorConfig
): DrillPath => {
  const indicatorNode: UIConfigDimension = {
    type: "indicator",
    meta: config.indicator.meta,
  };
  const indicatorIndex = config.indicator.index;
  return [
    ...config.dimensions.slice(0, indicatorIndex),
    indicatorNode,
    ...config.dimensions.slice(indicatorIndex),
  ];
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
export type BaseCell = {};

export type CrossArea = BaseCell & {
  type: "cross_area";
  columnMeta: DimensionNodeValue[];
  rowMeta: DimensionNodeValue[];
};

export type IndicatorCell = BaseCell & {
  type: "indicator";
  indicator: { type: "value"; value: IndicatorValue } | { type: "toFill" };
};
export type DimensionCell = BaseCell & {
  type: "dimension";
  dimension: DimensionNodeValue;
};

export type IParent = {
  children: AlignedCell[]
}
export type IChildren = {
  parent: AlignedCell
}
export const getAlignedParentPath = (children: IChildren): AlignedCell[] => {
  throw new Error("not implemented");
  return []
}
export type AlignedCell = IParent & IChildren & BaseCell & {
  type: "aligned_dimension";
  dimension: DimensionNodeValue;
}

export type Cell = IndicatorCell | DimensionCell | CrossArea;
export const isDimensionCell = (cell: Cell): cell is DimensionCell => {
  return cell.type === "dimension";
};
export const isIndicatorCell = (cell: Cell): cell is IndicatorCell => {
  return cell.type === "indicator";
};
export type DataForDisplay = {
  config?: {
    alignToParentDimensions: DimensionMeta[];
  };
  cells: TwoDimensionTable<Cell>;
};
// 行列转置
export const transposeTwoDimensionTable = <T>(
  table: TwoDimensionTable<T>
): TwoDimensionTable<T> => {
  const newRowCount = table[0]?.length;
  const newColumnCount = table.length;
  const newTable = createEmptyTwoDimensionTableWithCell(
    newRowCount,
    newColumnCount,
    (rowIndex, columnIndex) => table[columnIndex][rowIndex]
  );
  return newTable;
};

//left 和 top 都是仅包含自己表头部分的子表格。需要将二者合并，默认的规则是：left 的每一行，都和 top 的每一列进行交叉，形成一个新表格。
export const getFullTableCells = (
  left: DataForDisplay,
  _top: DataForDisplay
): DataForDisplay => {
  const top = { cells: transposeTwoDimensionTable(_top.cells) };

  const leftRowCount = left.cells.length;
  const leftColumnCount = left.cells[0]?.length;

  const topRowCount = top.cells.length;
  const topColumnCount = top.cells[0]?.length;

  const totalRowCount = leftRowCount + topRowCount;
  const totalColumnCount = leftColumnCount + topColumnCount;

  const fixedLeftRowStartIndex = topRowCount;
  const fixedLeftRowEndIndex = topRowCount + leftRowCount;
  const fixedLeftColumnStartIndex = 0;
  const fixedLeftColumnEndIndex = leftColumnCount;

  const fixedTopRowStartIndex = 0;
  const fixedTopRowEndIndex = topRowCount;
  const fixedTopColumnStartIndex = leftColumnCount;
  const fixedTopColumnEndIndex = leftColumnCount + topColumnCount;

  const isLeftColumns = (index: number) =>
    index >= fixedLeftColumnStartIndex && index < fixedLeftColumnEndIndex;
  const isLeftRows = (index: number) =>
    index >= fixedLeftRowStartIndex && index < fixedLeftRowEndIndex;
  const isTopColumns = (index: number) =>
    index >= fixedTopColumnStartIndex && index < fixedTopColumnEndIndex;
  const isTopRows = (index: number) =>
    index >= fixedTopRowStartIndex && index < fixedTopRowEndIndex;

  const isCrossArea = (rowIndex: number, colIndex: number) =>
    rowIndex < topRowCount && colIndex < leftColumnCount;

  const totalRowToLeftRowIndex = (rowIndex: number) => rowIndex - topRowCount;
  const totalColumnToTopColumnIndex = (colIndex: number) =>
    colIndex - leftColumnCount;

  const mergedCells: TwoDimensionTable<Cell> =
    createEmptyTwoDimensionTableWithCell(
      totalRowCount,
      totalColumnCount,
      (rowIndex, colIndex) => {
        if (isCrossArea(rowIndex, colIndex)) {
          return {
            type: "cross_area",
            columnMeta: removeRepeat(
              getNodeInColToBottom(left.cells, rowIndex, colIndex)
                .filter((node) => node.type === "dimension")
                .map((node) => node.dimension)
            ),
            rowMeta: removeRepeat(
              getNodesInRowToRight(top.cells, rowIndex, colIndex)
                .filter((node) => node.type === "dimension")
                .map((node) => node.dimension)
            ),
          };
        } else if (isLeftRows(rowIndex) && isLeftColumns(colIndex)) {
          return left.cells[totalRowToLeftRowIndex(rowIndex)][colIndex];
        } else if (isTopRows(rowIndex) && isTopColumns(colIndex)) {
          return top.cells[rowIndex][totalColumnToTopColumnIndex(colIndex)];
        } else {
          return { type: "indicator", indicator: { type: "toFill" } };
        }
      }
    );
  return { cells: mergedCells };
};
//#endregion

// 下钻路径可能是维度或者指标。
// 维度代表正常的下钻
// 指标代表伪维度
//  1. 只是对前序维度的一个透明代理
//  2. 如果指标本身配置了有效的维度，那么如果后续的维度无效，则不按后续的维度下钻，而是聚合成一个值
export type DrillPath = UIConfigDimension[];
export type FilterDimensionNodeValue = {
  type: "dimension"; // -> filter
  value: DimensionValue;
};
export type IndicatorDimensionNodeValue = {
  type: "indicator"; // -> proxy
  value: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] };
};
export type FilterDimensionPlaceholderNodeValue = {
  type: "dimension_placeholder"; // -> placeholder
  value: DimensionMeta;
};
export type DimensionNodeValue =
  | FilterDimensionNodeValue
  | FilterDimensionPlaceholderNodeValue
  | IndicatorDimensionNodeValue;
export const isSameDimensionNodeValue = (
  a: DimensionNodeValue,
  b: DimensionNodeValue
): boolean => {
  if (a.type !== b.type) return false;
  if (a.type === "dimension" && b.type === "dimension") {
    return a.value.meta.code === b.value.meta.code;
  }
  if (a.type === "indicator" && b.type === "indicator") {
    return a.value.meta.code === b.value.meta.code;
  }
  if (
    a.type === "dimension_placeholder" &&
    b.type === "dimension_placeholder"
  ) {
    return a.value.code === b.value.code;
  }
  return false;
};

export const removeRepeat = (
  dimensionNodeValues: DimensionNodeValue[]
): DimensionNodeValue[] => {
  const values: DimensionNodeValue[] = [];
  for (const value of dimensionNodeValues) {
    if (!values.some((v) => isSameDimensionNodeValue(v, value))) {
      values.push(value);
    }
  }
  return values;
};

export const isFilterDimensionValidForAllIndicatorInPath = (
  drillPath: DrillPath,
  nodeValues: DimensionNodeValue[]
) => {
  const indicators = nodeValues.filter((node) => node.type === "indicator");
  const valid = indicators.every((indicator) => {
    return drillPath.every((path) => {
      if (path.type === "dimension") {
        return isDimensionValidateForIndicator(path.meta, indicator.value.meta);
      }
      return true;
    });
  });
  return valid;
};

export const isFilterDimensionNodeValue = (
  node: DimensionNodeValue
): node is FilterDimensionNodeValue => {
  return node.type === "dimension";
};
export const isIndicatorDimensionNodeValue = (
  node: DimensionNodeValue
): node is IndicatorDimensionNodeValue => {
  return node.type === "indicator";
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
  console.log(dimension, indicator);
  // throw new Error("not implemented");
  return true;
};
export const createDimensionNodeValue = (
  value: DimensionValue
): DimensionNodeValue => {
  return { type: "dimension", value };
};
export const createIndicatorNodeValue = (value: {
  meta: IndicatorMeta;
  ignoreDimensions?: DimensionMeta[];
}): DimensionNodeValue => {
  return { type: "indicator", value };
};

// 根据下钻路径和维度枚举值，构建 tree。 可以同时适用于 行 和 列
export const buildTree = (
  drillPath: DrillPath,
  data: DimensionTableData,
  preDimensionValues: DimensionNodeValue[] = []
): Tree<DimensionNodeValue>[] => {
  if (drillPath.length === 0) return [];

  const firstPath = drillPath[0];
  const restPath = drillPath.slice(1);

  if (firstPath.type === "dimension") {
    // 存在 dimension 对指标无意义的情况, 需要作为一种维度占位符来处理
    const dimShouldIgnore = preDimensionValues.some((preDimension) => {
      if (preDimension.type === "indicator") {
        if (!preDimension.value.ignoreDimensions) return false;
        return preDimension.value.ignoreDimensions.some((ignoreDimension) => {
          return ignoreDimension.code === firstPath.meta.code;
        });
      }
      return false;
    });
    if (dimShouldIgnore) {
      const nodeValue: FilterDimensionPlaceholderNodeValue = {
        type: "dimension_placeholder",
        value: firstPath.meta,
      };
      return [nodeValue].map((item) => {
        return {
          value: item,
          children: buildTree(restPath, data, [
            ...preDimensionValues,
            nodeValue,
          ]),
        };
      });
    }

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
            isDimensionValidateForIndicator(firstPath.meta, v.value.meta)
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

// 仅填充了维度
export const treeToDisplayCells = (
  treeList: Tree<DimensionNodeValue>[]
): DataForDisplay => {
  const leafCount = getLeafCountOfTreeList(treeList);
  const depth = getDepthOfTreeList(treeList);
  const emptyTable = createEmptyTwoDimensionTable(leafCount, depth);
  return {
    cells: mapTwoDimensionTable(
      emptyTable,
      (_, rowIndex, columnIndex): Cell => {
        const node = findNodeByRowAndDepth(treeList, rowIndex, columnIndex);
        // 未找到 node, 说明是指标
        if (!node) {
          const value: IndicatorCell = {
            type: "indicator",
            indicator: { type: "toFill" },
          };
          return value;
        }

        if (!node.value) {
          throw new Error(`dimension node exception: no value; ${node}`);
        }
        const value: DimensionCell = {
          type: "dimension",
          dimension: node.value,
        };
        return value;
      }
    ),
  };
};

//#region test data
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
    { type: "dimension", meta: bizLine },
    { type: "dimension", meta: subBizLine },
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

export const tableData: DimensionTableData = {
  records: [
    {
      dimensions: [
        { meta: region, value: "region1", order: 1 },
        { meta: bizLine, value: "biz_line1", order: 1 },
        { meta: subBizLine, value: "sub_biz_line1", order: 1 },
        { meta: dateDimension, value: "2025-09", order: 1 },
      ],
      indicators: [
        { meta: gmv, value: 100 },
        { meta: profit, value: 0.1 },
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
        { meta: gmv, value: 200 },
        { meta: profit, value: 0.2 },
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
        { meta: gmv, value: 1100 },
        { meta: profit, value: 0.11 },
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
        { meta: gmv, value: 300 },
        { meta: profit, value: 0.3 },
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
        { meta: gmv, value: 400 },
        { meta: profit, value: 0.4 },
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
        { meta: gmv, value: 400 },
        { meta: profit, value: 0.99 },
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
        { meta: gmv, value: 1000 },
        { meta: profit, value: 0.4 },
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
        { meta: gmv, value: 500 },
        { meta: profit, value: 0.5 },
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
        { meta: gmv, value: 500 },
        { meta: profit, value: 0.5 },
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
        { meta: gmv, value: 499 },
        { meta: profit, value: 0.3 },
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

//#region build full cells
export const buildTreeForFullCells = (
  _uiConfig: DimensionTableUIConfig,
  data: DimensionTableData
) => {
  if (_uiConfig.type === "indicator_in_head") {
    const leftTree = buildTree(_uiConfig.left.dimensions, data);
    const leftTreeData = treeToDisplayCells(leftTree);
    const topTree = buildTree(
      getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.head),
      data
    );
    const topTreeData = treeToDisplayCells(topTree);
    return { leftTreeData, topTreeData };
  } else if (_uiConfig.type === "indicator_in_left") {
    const leftTree = buildTree(
      getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.left),
      data
    );
    const leftTreeData = treeToDisplayCells(leftTree);
    const topTree = buildTree(_uiConfig.head.dimensions, data);
    const topTreeData = treeToDisplayCells(topTree);
    return { leftTreeData, topTreeData };
  } else {
    throw new Error("invalid ui config");
  }
};
export const buildFullCells = (
  uiConfig: DimensionTableUIConfig,
  data: DimensionTableData
) => {
  const { leftTreeData, topTreeData } = buildTreeForFullCells(uiConfig, data);
  return getFullTableCells(leftTreeData, topTreeData);
};
export const getDataValueByIndicator = (
  data: DimensionTableData,
  indicator: IndicatorMeta,
  filter: DimensionValue[]
): IndicatorValue | null => {
  const records = data.records.filter((record) => {
    return filter.every((f) =>
      record.dimensions.some(
        (d) => d.meta.code === f.meta.code && d.value === f.value
      )
    );
  });

  const firstRecord = records[0];
  if (!firstRecord) return null;

  return (
    firstRecord.indicators.find((i) => i.meta.code === indicator.code) ?? null
  );
};
export const fillData = (
  tableToFill: DataForDisplay,
  data: DimensionTableData
): DataForDisplay => {
  const newTable: TwoDimensionTable<Cell> = mapTwoDimensionTable(
    tableToFill.cells,
    (cell, rowIndex, columnIndex) => {
      if (cell.type !== "indicator") return cell;
      if (cell.indicator.type !== "toFill") return cell;

      const nodes = [
        ...getNodesInRowToLeft(tableToFill.cells, rowIndex, columnIndex),
        ...getNodesInColToTop(tableToFill.cells, rowIndex, columnIndex),
      ];
      const indicators = nodes
        .filter((node) => node.type === "dimension")
        .filter((node) => node.dimension.type === "indicator")
        .map((node) => node.dimension)
        .filter((node) => node.type === "indicator");

      const indicator = indicators[0];
      if (!indicator) return cell;

      const filters = nodes
        .filter((node) => node.type === "dimension")
        .map((node) => node.dimension)
        .filter((node) => node.type === "dimension")
        .map((node) => node.value);
      const value = getDataValueByIndicator(
        data,
        indicator.value.meta,
        filters
      );
      if (!value) return cell;
      return {
        type: "indicator",
        indicator: {
          type: "value",
          value: value,
        },
      };
    }
  );

  return {
    cells: newTable,
  };
};
//#endregion

//#region test

const main = () => {
  const leftTree = buildTree(uiConfig.left.dimensions, tableData);
  const leftTreeData = treeToDisplayCells(leftTree);
  const topTree = buildTree(
    getDrillPathFromUIHeaderWithIndicatorConfig(uiConfig.head),
    tableData
  );
  const topTreeData = treeToDisplayCells(topTree);

  const fullCells = getFullTableCells(leftTreeData, topTreeData);
  console.log("full cells to fill is", JSON.stringify(fullCells));
};
main();
//#endregion
