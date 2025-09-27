import type React from "react"
import type { IndicatorMeta, IndicatorValue, PercentIndicator } from "../../../data-source/indicator"
import { useMemo } from "react"
import { type Preciesion } from "./meta"
import { formatPercentIndicator } from "./formater"

export type IndicatorViewProps = {
    value: IndicatorValue
}
export const IndicatorView: React.FC<IndicatorViewProps> = (props) => {
    return null
}


export type PercentIndicatorViewProps = {
    value: PercentIndicator
    preciesion: Preciesion
    showIncOrDec?: boolean
}
export const PercentIndicatorView: React.FC<PercentIndicatorViewProps> = props => {
    const showData = useMemo(() => {
        return formatPercentIndicator(props.value)
    }, [props.value, props.preciesion])
    return <span>
        {showData.showValue}
    </span>
}


export type IndicatorViewWithLoaderProps = {
    indicator: IndicatorMeta
    preciesion: Preciesion
}
export const IndicatorViewWithLoader: React.FC<IndicatorViewWithLoaderProps> = (props) => {
    
}