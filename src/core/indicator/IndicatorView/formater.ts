import type { IndicatorValue, PercentIndicator } from "../../../data-source/indicator";

export type NumberForDisplay = {
    indicator: IndicatorValue
    showValue: string
}

const multiByScale = (value: number, scale: number) => value * scale
const multiByScale100 = (value: number) => multiByScale(value, 100)

const bindPercentMark = (value: number) => `${value} %`

export const formatPercentIndicator = (indicator: PercentIndicator): NumberForDisplay => {
    const value = indicator.valueFormat === 'percent' ? indicator.value : multiByScale100(indicator.value)
    return {
        indicator: indicator,
        showValue: bindPercentMark(value)
    }
}