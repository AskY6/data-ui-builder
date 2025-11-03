import { CommonCrossTable } from "./Component";
import type {
  DimensionCell,
  DimensionTableData,
  DimensionTableUIConfig,
  IndicatorCell,
} from "./dimensionTable";

export type IndicatorType = { vvalue: number }

export type DimensionTableComponentProps = {
  uiConfig: DimensionTableUIConfig;
  tableData: DimensionTableData<IndicatorType, string>;
  indicatorRender: (cell: IndicatorCell<IndicatorType>) => React.ReactNode;
};
function DimensionTableComponent(props: DimensionTableComponentProps) {
  const { uiConfig, tableData } = props;

  const baseDimensionRender = (cell: DimensionCell<string>) => {
    switch (cell.dimension.type) {
      case "dimension":
        return <span>{cell.dimension.value.value}</span>;
      case "indicator":
        return <span>{cell.dimension.value.meta.name}</span>;
      case "dimension_placeholder":
        return <span>占位符：{cell.dimension.value.name}</span>;
      default:
        return "";
    }
  };

  return (
    <CommonCrossTable
      uiConfig={uiConfig}
      tableData={tableData}
      renders={{
        dimensionRender: baseDimensionRender,
        alignedCellRender: (cell, { depth }) => {
          return (
            <div style={{ paddingLeft: 10 * depth }}>
              {baseDimensionRender({
                type: "dimension",
                dimension: cell.dimension,
              })}
            </div>
          );
        },
        indicatorRender: (cell) => {
          return props.indicatorRender(cell);
        },
        crossAreaRender: (cell, context) => {
          if (context.type === "indicator_in_head") {
            if (cell.columnMeta.length > 0) {
              return (
                <span>
                  {cell.columnMeta.map((meta) => {
                    if (meta.type === "dimension") {
                      return <span>{meta.value.meta.name}|</span>;
                    }
                    return <span>-</span>;
                  })}
                </span>
              );
            } else {
              return <span>-</span>;
            }
          } else if (context.type === "indicator_in_left") {
            if (cell.rowMeta.length > 0) {
              return (
                <span>
                  {cell.rowMeta.map((meta) => {
                    if (meta.type === "dimension") {
                      return <span>{meta.value.meta.name}</span>;
                    }
                    return <span>-</span>;
                  })}
                </span>
              );
            }
          } else {
            return <span>-</span>;
          }
        },
      }}
    />
  );
}

export { DimensionTableComponent };
