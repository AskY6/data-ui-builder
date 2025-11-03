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
export const removeColumnsFromTable = <T>(
  table: TwoDimensionTable<T>,
  columnIndex: number
): TwoDimensionTable<T> => {
  return table.map((row) => row.filter((_, index) => index !== columnIndex));
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
  const tableRowCount = table.length;

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
export type BaseCell = {
  key?: string;
};

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

export type AlignedCell = BaseCell & {
  type: "aligned_dimension";
  dimension: DimensionNodeValue;
  parent: CellWithAlign | null;
};

export const getAllParent = (cell: AlignedCell): DimensionValue[] => {
  let result: DimensionValue[] = [];

  let curNode: AlignedCell = cell;

  while (curNode) {
    const value = getDimensionValueFromNodeValue(cell.dimension);
    if (!value) break;

    result.push(value);

    if (curNode.parent?.type !== "aligned_dimension") {
      break;
    } else {
      curNode = curNode.parent;
    }
  }

  return result;
};
export const updateParent = (
  cell: AlignedCell,
  newParent: CellWithAlign | null
) => {
  cell.parent = newParent;
};
export const isAlinedCell = (cell: CellWithAlign): cell is AlignedCell => {
  return cell.type === "aligned_dimension";
};
export type CellWithAlign = Cell | AlignedCell;
export const toAlignedCell = (
  cell: DimensionCell | AlignedCell,
  parent: CellWithAlign | null
): AlignedCell => {
  if (cell.type === "aligned_dimension") return cell;
  return {
    type: "aligned_dimension",
    dimension: cell.dimension,
    parent: parent,
  };
};

export type Cell = IndicatorCell | DimensionCell | CrossArea;
export const isDimensionCell = (cell: Cell): cell is DimensionCell => {
  return cell.type === "dimension";
};
export const getAlignedDepth = (cell: AlignedCell): number => {
  let depth = 0;
  let curCell: AlignedCell = cell;
  while (curCell.parent) {
    depth++;
    if (isAlinedCell(curCell.parent)) {
      curCell = curCell.parent;
    } else {
      break;
    }
  }
  return depth;
};
export const isDimensionCellEnumEqual = (
  cell1: DimensionCell,
  cell2: DimensionCell
) => {
  const nodeValue1 = cell1.dimension;
  const nodeValue2 = cell2.dimension;
  const isSameDimensionMeta = isSameDimensionNodeValue(nodeValue1, nodeValue2);

  if (!isSameDimensionMeta) return false;

  const nodeValueEnum1 = getDimensionValueFromNodeValue(nodeValue1);
  const nodeValueEnum2 = getDimensionValueFromNodeValue(nodeValue2);

  if (nodeValueEnum1 === null || nodeValueEnum2 === null) return false;
  return nodeValueEnum1 === nodeValueEnum2;
};
export const isIndicatorCell = (cell: Cell): cell is IndicatorCell => {
  return cell.type === "indicator";
};
export const isCellValueEqual = (cell1: Cell, cell2: Cell) => {
  if (cell1.type !== cell2.type) return false;
  if (cell1.type === "cross_area" && cell2.type === "cross_area") {
    return true;
  } else if (cell1.type === "dimension" && cell2.type === "dimension") {
    return cell1.dimension.type;
  } else if (cell1.type === "indicator" && cell2.type === "indicator") {
    return true;
  }
  return false;
};
export type DataForDisplay<T = Cell> = {
  cells: TwoDimensionTable<T>;
};
// 获取列
export const getColumnFromTable = <T>(
  table: TwoDimensionTable<T>,
  columnIndex: number
): T[] => {
  return table.map((row) => row[columnIndex]);
};
// 根据 comunIndex 对应的列，进行合并
export const narrowSameRowForTable = <T>(
  table: TwoDimensionTable<T>,
  columnIndex: number,
  equal: (item1: T, item2: T) => boolean
): TwoDimensionTable<T> => {
  let newTable: TwoDimensionTable<T> = [];

  let prevColumnItem: T = table[0]?.[columnIndex];

  if (!prevColumnItem) return table;

  newTable.push(table[0]);

  for (let i = 1; i < table.length; i++) {
    const columnItem = table[i][columnIndex];

    // 新的一行中对应位置，与上一行相同，则 skip
    if (equal(prevColumnItem, columnItem)) {
      continue;
    } else {
      newTable.push(table[i]);

      prevColumnItem = columnItem;
    }
  }
  return newTable;
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
  left: DataForDisplay<CellWithAlign>,
  _top: DataForDisplay<CellWithAlign>
): DataForDisplay<CellWithAlign> => {
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

  const mergedCells: TwoDimensionTable<CellWithAlign> =
    createEmptyTwoDimensionTableWithCell(
      totalRowCount,
      totalColumnCount,
      (rowIndex, colIndex) => {
        if (isCrossArea(rowIndex, colIndex)) {
          return {
            type: "cross_area",
            columnMeta: removeRepeat(
              getNodeInColToBottom(left.cells, rowIndex, colIndex)
                .filter((node) => {
                  return (
                    node.type === "dimension" ||
                    node.type === "aligned_dimension"
                  );
                })
                .map((node) => node.dimension)
            ),
            rowMeta: removeRepeat(
              getNodesInRowToRight(top.cells, rowIndex, colIndex)
                .filter(
                  (node) =>
                    node.type === "dimension" ||
                    node.type === "aligned_dimension"
                )
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

export const getDimensionMetaFromNodeValue = (
  dimensionNodeValue: DimensionNodeValue
) => {
  if (dimensionNodeValue.type === "dimension") {
    return dimensionNodeValue.value.meta;
  } else if (dimensionNodeValue.type === "dimension_placeholder") {
    return dimensionNodeValue.value;
  } else {
    return null;
  }
};
export const getDimensionValueFromNodeValue = (
  dimensionNodeValue: DimensionNodeValue
): DimensionValue | null => {
  if (dimensionNodeValue.type === "dimension") {
    return dimensionNodeValue.value;
  } else {
    return null;
  }
};
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

// 生成代表 cell 的唯一 key。 由于来源是树，因此对 [Node, ParentNode] 进行唯一化 key 即可。 即对两个 node 取标准 key, 拼接后即为节点对应的唯一 key
export const generateSingleCellKey = (cell: Cell): string => {
  if (cell.type !== "dimension") {
    return "";
  }
  const dimensionNodeValue = cell.dimension;
  switch (dimensionNodeValue.type) {
    case "dimension":
      // meta code + value 才能唯一确定 key
      return `dimension_${dimensionNodeValue.value.meta.code}_${dimensionNodeValue.value.value}`;
    case "dimension_placeholder":
      return `placeholder_${dimensionNodeValue.value.code}`;
    case "indicator":
      return `indicator_${dimensionNodeValue.value.meta.code}`;
  }
};
export const generateKeyForCell = (option: {
  cell: Cell;
  parentCell: Cell | null;
}): string => {
  const { cell, parentCell } = option;
  const cellKey = generateSingleCellKey(cell);
  const parentKey = parentCell ? generateSingleCellKey(parentCell) : "null";
  return `${cellKey}|${parentKey}`;
};
export const attachMergeKey = (data: DataForDisplay): DataForDisplay => {
  return {
    cells: mapTwoDimensionTable(data.cells, (cell, rowIndex, colIndex) => {
      const parentCell = data.cells[rowIndex]?.[colIndex - 1];
      return {
        ...cell,
        key:
          generateKeyForCell({
            cell,
            parentCell,
          }) ?? undefined,
      };
    }),
  };
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
//#region tableToAlignedTable
export const tableToAlignedTable = (
  _table: DataForDisplay,
  uiConfig: UIConfigDimension[]
): DataForDisplay<CellWithAlign> => {
  const table = _table as DataForDisplay<CellWithAlign>;
  const alignedColumns = uiConfig
    .filter((configItem) => configItem.type === "dimension")
    .filter((config) => config.alignToParent)
    .map((item) => item.meta);

  const columnCount = table.cells[0]?.length;
  for (let i = columnCount - 1; i >= 0; i--) {
    if (i === 0) continue;

    const columnData = getColumnFromTable(table.cells, i);
    const prevColumnData = getColumnFromTable(table.cells, i - 1);

    const firstNonCrossArea = columnData.filter(
      (cell) => cell.type !== "cross_area"
    )[0];
    if (!firstNonCrossArea || firstNonCrossArea.type === "indicator") continue;

    const dimensionNodeValue = firstNonCrossArea.dimension;
    const dimensionMeta = getDimensionMetaFromNodeValue(dimensionNodeValue);
    if (!dimensionMeta) continue;

    const toDimensionCell = (
      cell: DimensionCell | AlignedCell
    ): DimensionCell => {
      if (cell.type === "dimension") return cell;

      return {
        type: "dimension",
        dimension: cell.dimension,
      };
    };
    const isCellAllDimensionAndEnumEqual = (
      cell1: CellWithAlign,
      cell2: CellWithAlign
    ) => {
      if (cell1.type !== "dimension" && cell1.type !== "aligned_dimension")
        return false;
      if (cell2.type !== "dimension" && cell2.type !== "aligned_dimension")
        return false;
      return isDimensionCellEnumEqual(
        toDimensionCell(cell1),
        toDimensionCell(cell2)
      );
    };
    // 当前列需要隐藏
    if (
      alignedColumns.some((alinedColumn) =>
        dimensionMetaEqual(alinedColumn, dimensionMeta)
      )
    ) {
      table.cells = removeColumnsFromTable(table.cells, i);
      table.cells = narrowSameRowForTable(
        table.cells,
        i - 1,
        (cell1, cell2) => {
          if (
            cell1.type === "aligned_dimension" ||
            cell2.type === "aligned_dimension"
          )
            return false;
          return isCellAllDimensionAndEnumEqual(cell1, cell2);
        }
      );

      // 将移除后的列，补充到前一列的父节点下面

      // narrow 后的列
      const newColumns = getColumnFromTable(table.cells, i - 1);

      // 从后往前，因为插入会导致数组变长。从后往前遍历，可以不关注数组长度的变化
      for (let j = newColumns.length - 1; j >= 0; j--) {
        const newColumnItem = newColumns[j];

        // 确定有哪些是要 align 到父节点的
        const itemsShouldAlignToNewColumnItem = columnData.filter(
          (_, index) => {
            const parent = prevColumnData[index];
            return isCellAllDimensionAndEnumEqual(newColumnItem, parent);
          }
        );

        const toRow = (cell: AlignedCell): CellWithAlign[] => {
          const prevCells = table.cells[j].slice(0, i - 1);
          return [...prevCells, cell];
        };

        const newItems = itemsShouldAlignToNewColumnItem
          .filter(
            (cell) =>
              cell.type === "dimension" || cell.type === "aligned_dimension"
          )
          // todo：转换为 alignedCell 后，需要更新子节点中的标记
          .map((cell) => {
            const newCell = toAlignedCell(cell, newColumnItem);

            itemsShouldAlignToNewColumnItem
              .filter((item) => item.type === "aligned_dimension")
              .filter((item) => item.parent === cell)
              .forEach((item) => updateParent(item, newCell));

            return newCell;
          })
          .map(toRow);

        table.cells.splice(j + 1, 0, ...newItems);
      }
    }
  }

  return table;
};
//#endregion

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
): {
  leftTreeData: DataForDisplay<CellWithAlign>;
  topTreeData: DataForDisplay<CellWithAlign>;
} => {
  if (_uiConfig.type === "indicator_in_head") {
    const leftTree = buildTree(_uiConfig.left.dimensions, data);
    const leftTreeData = attachMergeKey(treeToDisplayCells(leftTree));

    tableToAlignedTable(leftTreeData, uiConfig.left.dimensions);

    const topTree = buildTree(
      getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.head),
      data
    );
    const topTreeData = attachMergeKey(treeToDisplayCells(topTree));
    tableToAlignedTable(topTreeData, uiConfig.head.dimensions);
    return { leftTreeData, topTreeData };
  } else if (_uiConfig.type === "indicator_in_left") {
    const leftTree = buildTree(
      getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.left),
      data
    );
    const leftTreeData = attachMergeKey(treeToDisplayCells(leftTree));
    tableToAlignedTable(leftTreeData, _uiConfig.left.dimensions);

    const topTree = buildTree(_uiConfig.head.dimensions, data);
    const topTreeData = attachMergeKey(treeToDisplayCells(topTree));
    tableToAlignedTable(topTreeData, _uiConfig.head.dimensions);

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
  tableToFill: DataForDisplay<CellWithAlign>,
  data: DimensionTableData
): DataForDisplay<CellWithAlign> => {
  const newTable: TwoDimensionTable<CellWithAlign> = mapTwoDimensionTable(
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

      const dimensionFilters = nodes
        .filter((node) => node.type === "dimension")
        .map((node) => node.dimension)
        .filter((node) => node.type === "dimension")
        .map((node) => node.value);
      const alignedFilters = nodes
        .filter((node) => node.type === "aligned_dimension")
        .map(getAllParent)
        .reduce((acc, next) => [...acc, ...next], []);
      const value = getDataValueByIndicator(data, indicator.value.meta, [
        ...dimensionFilters,
        ...alignedFilters,
      ]);
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
