import type { CascadeDimensionPickerValue, DimensionFilterValue, DimensionMeta, NormalDimensionPickerValue } from "./dimension"
import type { IndicatorConstraint, IndicatorMeta, SingleIndicator, TableIndicators } from "./indicator"

export type DataSourceMetaModel = {
    getIndicaotor: (indicatorId: IndicatorMeta['code']) => Promise<IndicatorMeta>
    getIndicators: () => Promise<IndicatorMeta[]>
    getDimension: (dimensionId: DimensionMeta['code']) => Promise<DimensionMeta>
    getDimensions: () => Promise<DimensionMeta[]>
    getIndicatorConstraint: () => Promise<IndicatorConstraint[]>
}

//#region dimension filters & query
export type Query = {
    filters: DimensionFilterValue[]
    groupBy: DimensionMeta[]
}
export type DataSourceQueryModel = {
    getDimensionOptions: (dimensionMeta: DimensionMeta) => Promise<NormalDimensionPickerValue>
    /**
     * dimensionMetas 的顺序代表层级的父子关系 
     */
    getCascadeDimensionOptions: (dimensionMetas: DimensionMeta[]) => Promise<CascadeDimensionPickerValue>

    getIndicatorValue: (query: Query) => Promise<SingleIndicator>
    getTableValue: (Query: Query) => Promise<TableIndicators>
}