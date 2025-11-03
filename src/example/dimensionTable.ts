//#region 抽象树、二维表格数据结构
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

//#region 维度、指标、数据源
export type DimensionMeta = {
  code: string;
  name: string;
};
export const dimensionMetaEqual = (a: DimensionMeta, b: DimensionMeta) =>
  a.code === b.code;
export type DimensionValue<T> = {
  meta: DimensionMeta; // 维度的元信息
  value: T; // 维度枚举值的值
  order: number; // 排序的绝对位置
};
export const isDimensionValueEqual = <T>(
  a: DimensionValue<T>,
  b: DimensionValue<T>,
  equal: (a: T, b: T) => boolean = (a, b) => a === b
) => {
  const metaEqual = dimensionMetaEqual(a.meta, b.meta);
  const valueEqual = equal(a.value, b.value);
  return metaEqual && valueEqual;
};
/**
 * a 是否是 b 的超集
 * @param a
 * @param b
 * @returns
 */
export const aIsBSuperSet = <T>(
  a: DimensionValue<T>[],
  b: DimensionValue<T>[]
) => {
  // todo: 外部需要支持 dimension 的比较方法
  const bIna = b.every((bv) => a.some((av) => isDimensionValueEqual(av, bv)));
  return bIna;
};
export const dimensionValueEqualInMeta = <T>(
  a: DimensionValue<T>,
  b: DimensionValue<T>
) => dimensionMetaEqual(a.meta, b.meta);

export type IndicatorMeta = {
  code: string;
  name: string;
};
export type IndicatorValue<U> = {
  meta: IndicatorMeta;
  value: U;
};

export type DimensionTableQuery = {
  // 维度顺序表示下钻的顺序
  dimensions: DimensionMeta[];
  // 指标本身无顺序，只是表达每一条信息需要返回这些字段
  indicators: IndicatorMeta[];
};
export type DimensionTableData<U, T = string> = {
  records: {
    dimensions: DimensionValue<T>[];
    indicators: IndicatorValue<U>[];
  }[];
};

// 从数据源里查询所有的维度枚举值
const getAllDimensionValuesFromData = <U, T>(
  data: DimensionTableData<U, T>,
  dimensionMeta: DimensionMeta,
  shouldPick: (
    record: DimensionTableData<U, T>["records"][number]
  ) => boolean = () => true
): DimensionValue<T>[] => {
  const values: DimensionValue<T>[] = [];
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

//#region 配置项。可以序列化的结构
export type UIConfigDimensionItem = {
  type: "dimension";
  meta: DimensionMeta;
  // 展示上是否委托于父节点。用途：层级结构在一列中展示，通过缩进等方式在一列中展示层级结构
  alignToParent?: boolean;
};
export type UIConfigIndicatorItem = {
  type: "indicator";
  meta: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] }[]; // 应该是一组指标的描述。被当作伪维度时，IndicatorMeta 相当于维度枚举值，一组 IndicatorMeta 构成一个伪维度
};
export type UIConfigItem = UIConfigDimensionItem | UIConfigIndicatorItem;

export type UIHeaderNoIndicatorConfig = {
  dimensions: UIConfigItem[];
};
export type UIHeaderWithIndicatorConfig = UIHeaderNoIndicatorConfig & {
  // 数组顺序表示下钻维度
  indicator: {
    meta: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] }[];
    index: number; // 插入的位置，指标未必在末端，如果插入在维度列表的中间，那么处于 indicator 之后的维度需要被多次展开（不同指标下都要展开一次）
  };
};

// 从 UIHeaderWithIndicatorConfig 中生成下钻路径
export const getDrillPathFromUIHeaderWithIndicatorConfig = (
  config: UIHeaderWithIndicatorConfig
): DrillPath => {
  const indicatorNode: UIConfigItem = {
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

//#region 树和表格
//#region tree
// 根据下钻路径和维度枚举值，构建 tree。 可以同时适用于 行 和 列
export const buildTree = <U, T>(
  drillPath: DrillPath,
  data: DimensionTableData<U, T>,
  preDimensionValues: DimensionNodeValue<T>[] = []
): Tree<DimensionNodeValue<T>>[] => {
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
    const treeList: Tree<DimensionNodeValue<T>>[] = dimensionValues.map(
      (value) => {
        const nodeValue = createDimensionNodeValue<T>(value);
        return {
          value: nodeValue,
          children: buildTree<U, T>(restPath, data, [
            ...preDimensionValues,
            nodeValue,
          ]),
        };
      }
    );
    return treeList;
  }

  if (firstPath.type === "indicator") {
    const indicatorMeta = firstPath.meta;
    const treeList: Tree<DimensionNodeValue<T>>[] = indicatorMeta.map(
      (value) => {
        const nodeValue = createIndicatorNodeValue<T>(value);
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

  return [];
};
//#endregion

//#region 维度单元格内的内容，是 cell 的属性之一
// 下钻路径可能是维度或者指标。
// 维度代表正常的下钻
// 指标代表伪维度
//  1. 只是对前序维度的一个透明代理
//  2. 如果指标本身配置了有效的维度，那么如果后续的维度无效，则不按后续的维度下钻，而是聚合成一个值
export type DrillPath = UIConfigItem[];
export type FilterDimensionNodeValue<T> = {
  type: "dimension"; // -> filter
  value: DimensionValue<T>;
};
export type IndicatorDimensionNodeValue = {
  type: "indicator"; // -> proxy
  value: { meta: IndicatorMeta; ignoreDimensions?: DimensionMeta[] };
};
export type FilterDimensionPlaceholderNodeValue = {
  type: "dimension_placeholder"; // -> placeholder
  value: DimensionMeta;
};
export type DimensionNodeValue<T = string> =
  | FilterDimensionNodeValue<T>
  | FilterDimensionPlaceholderNodeValue
  | IndicatorDimensionNodeValue;

export const getDimensionMetaFromNodeValue = <T>(
  dimensionNodeValue: DimensionNodeValue<T>
) => {
  if (dimensionNodeValue.type === "dimension") {
    return dimensionNodeValue.value.meta;
  } else if (dimensionNodeValue.type === "dimension_placeholder") {
    return dimensionNodeValue.value;
  } else {
    return null;
  }
};
export const getDimensionValueFromNodeValue = <T>(
  dimensionNodeValue: DimensionNodeValue<T>
): DimensionValue<T> | null => {
  if (dimensionNodeValue.type === "dimension") {
    return dimensionNodeValue.value;
  } else {
    return null;
  }
};
export const isSameDimensionNodeValue = <T>(
  a: DimensionNodeValue<T>,
  b: DimensionNodeValue<T>
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

export const removeRepeat = <T>(
  dimensionNodeValues: DimensionNodeValue<T>[]
): DimensionNodeValue<T>[] => {
  const values: DimensionNodeValue<T>[] = [];
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

export const isFilterDimensionNodeValue = <T>(
  node: DimensionNodeValue<T>
): node is FilterDimensionNodeValue<T> => {
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
export const createDimensionNodeValue = <T>(
  value: DimensionValue<T>
): DimensionNodeValue<T> => {
  return { type: "dimension", value };
};
export const createIndicatorNodeValue = <T>(value: {
  meta: IndicatorMeta;
  ignoreDimensions?: DimensionMeta[];
}): DimensionNodeValue<T> => {
  return { type: "indicator", value };
};
//#endregion

//#region 基础的 cell
export type BaseCell = {
  key?: string;
};
export type CrossArea = BaseCell & {
  type: "cross_area";
  columnMeta: DimensionNodeValue[];
  rowMeta: DimensionNodeValue[];
};
export type IndicatorCell<U> = BaseCell & {
  type: "indicator";
  indicator: { type: "value"; value: IndicatorValue<U> } | { type: "toFill" };
};
export type DimensionCell<T> = BaseCell & {
  type: "dimension";
  dimension: DimensionNodeValue<T>;
};
export type Cell<U, T> = IndicatorCell<U> | DimensionCell<T> | CrossArea;
export const isDimensionCell = <U, T>(
  cell: Cell<U, T>
): cell is DimensionCell<T> => {
  return cell.type === "dimension";
};

export const isDimensionCellEnumEqual = <T>(
  cell1: DimensionCell<T>,
  cell2: DimensionCell<T>
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
export const isIndicatorCell = <U, T>(
  cell: Cell<U, T>
): cell is IndicatorCell<U> => {
  return cell.type === "indicator";
};
export const isCellValueEqual = <U, T>(
  cell1: Cell<U, T>,
  cell2: Cell<U, T>
) => {
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
//#endregion
//#region 支持向前对齐逻辑的 cell
export type AlignedCell<U, T> = BaseCell & {
  type: "aligned_dimension";
  dimension: DimensionNodeValue<T>;
  parent: CellWithAlign<U, T> | null;
};
export type CellWithAlign<U, T> = Cell<U, T> | AlignedCell<U, T>;
export const getAllParent = <U, T>(
  cell: AlignedCell<U, T>
): DimensionValue<T>[] => {
  const result: DimensionValue<T>[] = [];

  let curNode: AlignedCell<U, T> = cell;

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
export const updateParent = <U, T>(
  cell: AlignedCell<U, T>,
  newParent: CellWithAlign<U, T> | null
) => {
  cell.parent = newParent;
};
export const isAlinedCell = <U, T>(
  cell: CellWithAlign<U, T>
): cell is AlignedCell<U, T> => {
  return cell.type === "aligned_dimension";
};
export const toAlignedCell = <U, T>(
  cell: DimensionCell<T> | AlignedCell<U, T>,
  parent: CellWithAlign<U, T> | null
): AlignedCell<U, T> => {
  if (cell.type === "aligned_dimension") return cell;
  return {
    type: "aligned_dimension",
    dimension: cell.dimension,
    parent: parent,
  };
};

// 获取是第几层的 align 节点。用于最终 ui 上做不同的展示，例如不同层级需要不同的锁进
export const getAlignedDepth = <U, T>(cell: AlignedCell<U, T>): number => {
  let depth = 0;
  let curCell: AlignedCell<U, T> = cell;
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
//#endregion

//#region 用于展示的表格数据

//#region 基础的表格展示
export type DataForDisplay<U, T, C = Cell<U, T>> = {
  cells: TwoDimensionTable<C>;
};
// 获取列
export const getColumnFromTable = <T>(
  table: TwoDimensionTable<T>,
  columnIndex: number
): T[] => {
  return table.map((row) => row[columnIndex]);
};
// 根据 comunIndex 对应的列，进行合并。 合并的原则是：如果当前行和上一行相同，则合并，否则不合并
export const narrowSameRowForTable = <T>(
  table: TwoDimensionTable<T>,
  columnIndex: number,
  equal: (item1: T, item2: T) => boolean
): TwoDimensionTable<T> => {
  const newTable: TwoDimensionTable<T> = [];

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
//#endregion
//#region 树转基础的表格
// 仅填充了维度
export const treeToDisplayCells = <U, T>(
  treeList: Tree<DimensionNodeValue<T>>[]
): DataForDisplay<U, T> => {
  const leafCount = getLeafCountOfTreeList(treeList);
  const depth = getDepthOfTreeList(treeList);
  const emptyTable = createEmptyTwoDimensionTable(leafCount, depth);
  return {
    cells: mapTwoDimensionTable(
      emptyTable,
      (_, rowIndex, columnIndex): Cell<U, T> => {
        const node = findNodeByRowAndDepth(treeList, rowIndex, columnIndex);
        // 未找到 node, 说明是指标
        if (!node) {
          const value: IndicatorCell<U> = {
            type: "indicator",
            indicator: { type: "toFill" },
          };
          return value;
        }

        if (!node.value) {
          throw new Error(`dimension node exception: no value; ${node}`);
        }
        const value: DimensionCell<T> = {
          type: "dimension",
          dimension: node.value,
        };
        return value;
      }
    ),
  };
};
//#endregion

//#region 合并单元格逻辑
// 生成代表 cell 的唯一 key。 由于来源是树，因此对 [Node, ParentNode] 进行唯一化 key 即可。 即对两个 node 取标准 key, 拼接后即为节点对应的唯一 key
export const generateSingleCellKey = <U, T>(cell: Cell<U, T>): string => {
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
export const generateKeyForCell = <U, T>(option: {
  cell: Cell<U, T>;
  parentCell: Cell<U, T> | null;
}): string => {
  const { cell, parentCell } = option;
  const cellKey = generateSingleCellKey(cell);
  const parentKey = parentCell ? generateSingleCellKey(parentCell) : "null";
  return `${cellKey}|${parentKey}`;
};
export const attachMergeKey = <U, T>(
  data: DataForDisplay<U, T>
): DataForDisplay<U, T> => {
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
//#endregion

//#region 支持对齐的表格展示
//left 和 top 都是仅包含自己表头部分的子表格。需要将二者合并，默认的规则是：left 的每一行，都和 top 的每一列进行交叉，形成一个新表格。
export const getFullTableCells = <U, T>(
  left: DataForDisplay<U, T, CellWithAlign<U, T>>,
  _top: DataForDisplay<U, T, CellWithAlign<U, T>>
): DataForDisplay<U, T, CellWithAlign<U, T>> => {
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

  const mergedCells: TwoDimensionTable<CellWithAlign<U, T>> =
    createEmptyTwoDimensionTableWithCell(
      totalRowCount,
      totalColumnCount,
      (rowIndex, colIndex) => {
        if (isCrossArea(rowIndex, colIndex)) {
          return {
            type: "cross_area",
            columnMeta: removeRepeat<T>(
              getNodeInColToBottom(left.cells, rowIndex, colIndex)
                .filter((node) => {
                  return (
                    node.type === "dimension" ||
                    node.type === "aligned_dimension"
                  );
                })
                .map((node) => node.dimension)
            ),
            rowMeta: removeRepeat<T>(
              getNodesInRowToRight(top.cells, rowIndex, colIndex)
                .filter(
                  (node) =>
                    node.type === "dimension" ||
                    node.type === "aligned_dimension"
                )
                .map((node) => node.dimension)
            ),
          } as CellWithAlign<U, T>;
        } else if (isLeftRows(rowIndex) && isLeftColumns(colIndex)) {
          return left.cells[totalRowToLeftRowIndex(rowIndex)][colIndex];
        } else if (isTopRows(rowIndex) && isTopColumns(colIndex)) {
          return top.cells[rowIndex][totalColumnToTopColumnIndex(colIndex)];
        } else {
          return {
            type: "indicator",
            indicator: { type: "toFill" },
          } as CellWithAlign<U, T>;
        }
      }
    );
  return { cells: mergedCells };
};
//#endregion
//#region 基础单元格，转支持向前对齐逻辑的单元格
export const tableToAlignedTable = <U, T>(
  _table: DataForDisplay<U, T, Cell<U, T>>,
  uiConfig: UIConfigItem[]
): DataForDisplay<U, T, CellWithAlign<U, T>> => {
  const table = _table as DataForDisplay<U, T, CellWithAlign<U, T>>;
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
      cell: DimensionCell<T> | AlignedCell<U, T>
    ): DimensionCell<T> => {
      if (cell.type === "dimension") return cell;

      return {
        type: "dimension",
        dimension: cell.dimension,
      };
    };
    const isCellAllDimensionAndEnumEqual = (
      cell1: CellWithAlign<U, T>,
      cell2: CellWithAlign<U, T>
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

        const toRow = (cell: AlignedCell<U, T>): CellWithAlign<U, T>[] => {
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
            const newCell = toAlignedCell<U, T>(cell, newColumnItem);

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
//#endregion

//#endregion

//#region 配置 + 数据 -> 用于展示的表格数据
// region 根据 ui config 和 table data 生成左子树和顶部子树
export const buildTreeForFullCells = <U, T>(
  _uiConfig: DimensionTableUIConfig,
  data: DimensionTableData<U, T>
): {
  leftTreeData: DataForDisplay<U, T, CellWithAlign<U, T>>;
  topTreeData: DataForDisplay<U, T, CellWithAlign<U, T>>;
} => {
  if (_uiConfig.type === "indicator_in_head") {
    const leftTreeData = attachMergeKey(
      treeToDisplayCells<U, T>(buildTree(_uiConfig.left.dimensions, data))
    );
    tableToAlignedTable(leftTreeData, _uiConfig.left.dimensions);

    const topTreeData = attachMergeKey(
      treeToDisplayCells<U, T>(
        buildTree(
          getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.head),
          data
        )
      )
    );
    tableToAlignedTable(topTreeData, _uiConfig.head.dimensions);
    return { leftTreeData, topTreeData };
  } else if (_uiConfig.type === "indicator_in_left") {
    const leftTreeData = attachMergeKey(
      treeToDisplayCells<U, T>(
        buildTree(
          getDrillPathFromUIHeaderWithIndicatorConfig(_uiConfig.left),
          data
        )
      )
    );
    tableToAlignedTable(leftTreeData, _uiConfig.left.dimensions);

    const topTreeData = attachMergeKey(
      treeToDisplayCells<U, T>(buildTree(_uiConfig.head.dimensions, data))
    );
    tableToAlignedTable(topTreeData, _uiConfig.head.dimensions);

    return { leftTreeData, topTreeData };
  } else {
    throw new Error("invalid ui config");
  }
};
//#endregion

//#region 根据左子树和顶部子树，整个表格
export const buildFullCellsFromTwoTree = <U, T>(
  uiConfig: DimensionTableUIConfig,
  data: DimensionTableData<U, T>
): DataForDisplay<U, T, CellWithAlign<U, T>> => {
  const { leftTreeData, topTreeData } = buildTreeForFullCells(uiConfig, data);
  return getFullTableCells(leftTreeData, topTreeData);
};
//#endregion

//#region 填充指标值区域的单元格
export const getDataValueByIndicator = <U, T>(
  data: DimensionTableData<U, T>,
  indicator: IndicatorMeta,
  filter: DimensionValue<T>[]
): IndicatorValue<U> | null => {
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

export const fillIndicatorCells = <U, T>(
  tableToFill: DataForDisplay<U, T, CellWithAlign<U, T>>,
  data: DimensionTableData<U, T>
): DataForDisplay<U, T, CellWithAlign<U, T>> => {
  const newTable: TwoDimensionTable<CellWithAlign<U, T>> = mapTwoDimensionTable(
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

//#region 最终对外暴露的接口
export const buildTable = <U, T>(
  data: DimensionTableData<U, T>,
  uiConfig: DimensionTableUIConfig
): DataForDisplay<U, T, CellWithAlign<U, T>> => {
  const { leftTreeData, topTreeData } = buildTreeForFullCells(uiConfig, data);
  const cells = getFullTableCells(leftTreeData, topTreeData);
  const filledCells = fillIndicatorCells(cells, data);
  return filledCells;
};
//#endregion
//#endregion
