import type { PercentIndicator } from "../../../data-source/indicator"

export type Preciesion = number

// export type BaseIndicatorShowConfig = {
//     perciesion: Preciesion
//     value: number
// }


// export type IntegerIndicatorShowType = { type: 'integer' } & BaseIndicatorShowConfig



// export type AmmountIndicatorShowType = { type: 'amount' } & BaseIndicatorShowConfig



// export type PercentIndicatorShowType = { type: 'percent', showIncOrDec: boolean } & BaseIndicatorShowConfig
// export type CreatePercentIndicatorShowTypeOptions = { 
//     indicator: PercentIndicator
//     showIncOrDec: boolean, 
//     preciesion: Preciesion 
// }
// export const createPercentIndicatorShowType = (options: CreatePercentIndicatorShowTypeOptions): PercentIndicatorShowType => {
//     return {
//         type: 'percent',
//         showIncOrDec: options.showIncOrDec,
//         perciesion: options.preciesion,
//         value: options.indicator.value
//     }
// }

// export type IndicatorShowType = IntegerIndicatorShowType | AmmountIndicatorShowType | PercentIndicatorShowType