import type { DimensionMeta } from "./dimension"

//#region indicator
export type PercentIndicator = {
    type: 'percent'
    value: number
}
export type AmmountIndicator = {
    type: 'ammount'
    value: number
}
export type Locale = { locale: 'zh-CN' | 'en-US' }
export type CurrencyIndicator = {
    type: 'currency'
    value: number
    locale: Locale
}

export type IndicatorValue = PercentIndicator | AmmountIndicator | CurrencyIndicator

export type IndicatorMeta = {
    code: string
    name: string
    description: string
}
export type Indicator = {
    meta: IndicatorMeta
    value: IndicatorValue
}
//#endregion


//#region constraint
/**
 * 问题：约束
 * 1. 是以指标为入口，明确能够支持的维度范围
 * 2. 以维度为入口，明确维度下有哪些指标？ 
 * 应该是一个业务层面的选择
 */
export type IndicatorConstraint = {
    indicator: IndicatorMeta
    supportedDimension: DimensionMeta[]
}[]
//#endregion