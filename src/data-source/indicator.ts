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
export type SingleIndicator = {
    meta: IndicatorMeta
    value: IndicatorValue
}
export type TableIndicators = {
    header: IndicatorMeta[]
    list: SingleIndicator[]
}
//#endregion


//#region constraint
/**
 * 问题：约束
 * 1. 是以指标为入口，明确能够支持的维度范围
 * 2. 以维度为入口，明确维度下有哪些指标？ 
 * 
 * 结论：应当是以指标为入口，明确能够支持的维度范围。 因为
 * 1. 指标是对事实的量化。可以认为是考量的目标
 * 2. 维度是有限、可枚举的；指标是可以自定义创造的，只要符合观测的需求。
 * 综合 1、2：可以认为以维度为入口看支持哪些指标是困难的。
 */
/**
 * 根本原因在于：
 * 1. 指标是对某个事实的量化，例如 gmv 是对成交表里成交价格的一个量化。
 * 2. 与成交事实无关的信息，一般不能作为一个拆解的维度。
 * 指标的可查询维度范围 = 数据粒度 ∩ 聚合合理性 ∩ 业务语义
 * 
 * 所以矩阵其实就是在描述：
 * 1. 哪些维度在事实表中存在； 
 * 2. 哪些维度下聚合结果合理；
 * 3. 哪些维度下有业务意义。
 */
export type DimensionForIndicatorStatus = {
    type: 'valid'
} | { type: 'limited', reason: string }
    | {
        type: 'invalid'
    }
export type DimensionForIndicator = {
    meta: DimensionForIndicator
    status: DimensionForIndicatorStatus
}
export type IndicatorConstraint = {
    indicator: IndicatorMeta
    supportedDimension: DimensionForIndicator[]
}
//#endregion