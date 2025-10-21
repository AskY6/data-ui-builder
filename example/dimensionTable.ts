//#region base define
export type DimensionMeta = {
    code: string
    name: string
}
export type DimensionValue = {
    meta: DimensionMeta // 维度的元信息
    value: string // 维度枚举值的值
    order: number // 排序的绝对位置
}

export type IndicatorMeta = {
    code: string
    name: string
}
export type IndicatorValue = {
    meta: IndicatorMeta
    value: number // todo: 细化 value
}

export type DimensionTableQuery = {
    // 维度顺序表示下钻的顺序
    dimensions: DimensionMeta[]
    // 指标本身无顺序，只是表达每一条信息需要返回这些字段
    indicators: IndicatorMeta[]
}
export type DimensionTableData = {
    records: {
        dimensions: DimensionValue[]
        indicators: IndicatorValue[]
    }[]
}
//#endregion

//#region for ui, not for specific render. only config
export type UIConfigDimension = {
    meta: DimensionMeta,
    // 展示上是否委托于父节点。用途：层级结构在一列中展示，通过缩进等方式在一列中展示层级结构
    alignToParent?: boolean
}
export type UIHeaderNoIndicatorConfig = {
    dimensions: UIConfigDimension[]
}
export const isAlignToParent = (dimension: UIConfigDimension) => Boolean(dimension.alignToParent)
export const isNotAlignToParent = (dimension: UIConfigDimension) => !isAlignToParent(dimension)
export const checkUIHeaderNoIndicatorConfig = (config: UIHeaderNoIndicatorConfig) => {
    // alignToParent 的节点后，不允许再有独立的 dimension，也必须 alignToParent
    if (config.dimensions.every(isNotAlignToParent)) return true

    const firstAlignIndex = config.dimensions.findIndex(isAlignToParent)

    return config.dimensions.slice(firstAlignIndex).every(isAlignToParent)
}

export type UIHeaderWithIndicatorConfig = UIHeaderNoIndicatorConfig & {
    // 数组顺序表示下钻维度
    indicator: {
        meta: IndicatorMeta
        index: number // 插入的位置，指标未必在末端，如果插入在维度列表的中间，那么处于 indicator 之后的维度需要被多次展开（不同指标下都要展开一次）
    }
}
export const checkUIHeaderWithIndicatorConfigValid = (config: UIHeaderWithIndicatorConfig) => {
    const indicatorResult = config.indicator.index < config.dimensions.length
    return checkUIHeaderNoIndicatorConfig(config) && indicatorResult
}

export type DimensionTableUIConfig = {
    type: 'indicator_in_head'
    head: UIHeaderWithIndicatorConfig
    left: UIHeaderNoIndicatorConfig
} | {
    type: 'indicator_in_left'
    head: UIHeaderNoIndicatorConfig;
    left: UIHeaderWithIndicatorConfig
}
//#endregion

// region for ui, for render
// 基于 group 计算合并，即给每个单元格赋予一个 groupId。从低往上 group, 或者递归
// merge 的数量就是 children count
const getChildrenCount = (meta: DimensionValue, allDimensionMeta: DimensionMeta[]): number => {

}
export type CellMergeDescriptor = {
    
}
//#endregion