//#region dimension
import {
    type DimensionMeta,
    type DimensionPickerValue,
    type NormalDimensionPickerValue,
} from "../../data-source/dimension";

export class DimensionPickerValueError extends Error { }

export type UseDimensionOptionInput = {
    lazy?: boolean;
};
export type DimensionOptionRequest<T extends DimensionPickerValue> = {
    update: (keyword?: string) => void;
    data?: T;
    loading: boolean;
    error?: DimensionPickerValueError;
};
export const useDimensionOptionPickerRequest = <T extends DimensionPickerValue>(
    dimensionMeta: DimensionMeta,
    input?: UseDimensionOptionInput
): DimensionOptionRequest<T> => {
    throw new Error("unimplementd");
};

export const useNormalDimensionOptionPickerRequest = (
    dimensionMeta: DimensionMeta,
    input?: UseDimensionOptionInput
): DimensionOptionRequest<NormalDimensionPickerValue> => {
    throw new Error("unimplementd");
};

//#endregion


//#region indicator loader

export const useIndicatorLoader = () =>{

}
//#endregion