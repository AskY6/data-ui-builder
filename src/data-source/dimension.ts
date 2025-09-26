import type { Tree } from "../common"

// 维度的枚举值。如何定义？
export type DimensionEnum = { label: string; value: string }

/**
 * 基础描述信息
 */
export type BaseDimensionMeta = {
    code: string
    name: string
    description: string
}
export type NormalDimensionMeta = BaseDimensionMeta & { type: 'normal' }
export type DateDimensionMeta = BaseDimensionMeta & { type: 'date' }
export type DimensionMeta = NormalDimensionMeta | DateDimensionMeta

export type NormalDimensionPickerValue = {
    type: 'normal',
    meta: DimensionMeta
    options: DimensionEnum[]
}

// 一般用来表达省市区之类的稳定级联选择。 不用于处理特殊依赖关系，特殊依赖关系使用特定的 relation 表达，在页面 ui model 层特殊实现
export type CascadeDimensionPickerNode = {
    enum: DimensionEnum
    meta: DimensionMeta
}
export type CascadeDimensionPickerValue = {
    type: 'cascade',
    // 顺序是树的层级关系
    dimensions: DimensionMeta[]
    treeOptions: Tree<CascadeDimensionPickerNode>
}

export type DimensionPickerValue = NormalDimensionPickerValue | CascadeDimensionPickerValue

export const isNormalDimensionPickerValue = (dimensionPickerValue: DimensionPickerValue): dimensionPickerValue is NormalDimensionPickerValue => {
    return dimensionPickerValue.type === 'normal'
}
export const isCascadeDimensionPickerValue = (dimensionPickerValue: DimensionPickerValue): dimensionPickerValue is CascadeDimensionPickerValue => {
    return dimensionPickerValue.type === 'cascade'
}

/**
 * 用于查询数据的条件
 */
export type DimensionFilterValue = {
    meta: DimensionMeta
    value: DimensionEnum[]
}


