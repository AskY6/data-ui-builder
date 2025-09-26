import { Select, type SelectProps } from "antd";
import type { DimensionMeta, NormalDimensionMeta } from "../../data-source/dimension";
import { useNormalDimensionOptionPickerRequest } from "../loader";
import { useCallback, useState } from "react";

export type CommonSelectProps<V, M extends SelectProps['mode'] = undefined> = {
    selectConfig?: SelectProps;
    dimensionMeta: DimensionMeta;
    lazy?: boolean;
    value: M extends "multiple" | "tags"
    ? V[]
    : V;
    onChange: (value: M extends "multiple" | "tags"
        ? V[]
        : V) => void;
};
export function CommonSelect<V, M extends SelectProps['mode'] = undefined>(props: CommonSelectProps<V, M>) {
    const allowSearch = props.selectConfig?.showSearch;
    const { data, error, loading, update } =
        useNormalDimensionOptionPickerRequest(props.dimensionMeta, {
            lazy: props.lazy,
        });

    const [keyWord, setKeyWord] = useState<string>("");

    const getOptions = useCallback(() => {
        if (allowSearch) {
            return update(keyWord);
        } else {
            return update;
        }
    }, [allowSearch, keyWord]);

    const updateKeyWord = useCallback(
        (word: string) => {
            if (allowSearch) {
                setKeyWord(word);
            } else {
                return;
            }
        },
        [allowSearch]
    );

    // 可以使用 error 做一些 ui 展示，也可不展示，仅用于点击下拉框时的二次检查
    return (
        <Select
            {...props.selectConfig}
            mode={props.selectConfig?.mode}
            value={props.value}
            onChange={props.onChange}
            loading={loading}
            options={data ? data.options : []}
            onInputKeyDown={(e) => {
                updateKeyWord(e.currentTarget.value);
            }}
            onOpenChange={(visible) => {
                // 打开下拉框时，如果有异常，则进行重新加载
                if (visible) {
                    if (error) {
                        getOptions();
                    }
                }
            }}
        />
    );
}

//#region single select
export type SingleSelectProps<V = string> = CommonSelectProps<V> & {
    selectConfig?: Omit<SelectProps, "mode">;
};
export function SingleSelect<V = string>(
    props: SingleSelectProps<V>
) {
    return <CommonSelect<V> {...props} />;
};
//#endregion

//#region multiple select
export type MultipleSelectProps<V = string> = CommonSelectProps<V, "multiple"> & {
    selectConfig?: Omit<SelectProps, "mode">
}
export function MultipleSelect<V = string>(props: MultipleSelectProps<V>) {
    return <CommonSelect<V, "multiple"> {...props} />
}
//#endregion