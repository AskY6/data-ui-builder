import React, { useMemo } from "react";
import {
  buildFullCells,
  fillData,
  getAlignedDepth,
  type AlignedCell,
  type CrossArea,
  type DimensionCell,
  type DimensionTableData,
  type DimensionTableUIConfig,
  type IndicatorCell,
} from "./dimensionTable";

export type CellRenderContext = {
  type: DimensionTableUIConfig['type']
}
export type CommonCrossTableProps = {
  uiConfig: DimensionTableUIConfig;
  tableData: DimensionTableData;
  renders: {
    alignedCellRender: (cell: AlignedCell, option: { depth: number }) => React.ReactNode
    dimensionRender: (cell: DimensionCell) => React.ReactNode;
    indicatorRender: (cell: IndicatorCell) => React.ReactNode;
    crossAreaRender: (cell: CrossArea, context: CellRenderContext) => React.ReactNode;
  };
};
export const CommonCrossTable: React.FC<CommonCrossTableProps> = (props) => {
  const { uiConfig, tableData, renders } = props;

  const dataToRender = useMemo(() => {
    const tableToRender = buildFullCells(uiConfig, tableData);
    const data = fillData(tableToRender, tableData);
    console.log('final render data', data)
    return data
  }, [uiConfig, tableData]);

  const context: CellRenderContext = {
    type: uiConfig.type,
  };

  return (
    <div>
      {dataToRender.cells.map((row) => {
        return (
          <div>
            {row.map((cell) => {
              switch (cell.type) {
                case "dimension":
                  return (
                    <div
                      style={{
                        fontWeight: "bold",
                        padding: "5px",
                        border: "1px solid red",
                        color: "red",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {renders.dimensionRender(cell)}
                    </div>
                  );
                case 'aligned_dimension':
                  const depth = getAlignedDepth(cell)
                  return (
                    <div
                      style={{
                        fontWeight: "bold",
                        padding: "5px",
                        border: "1px solid red",
                        color: "red",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {renders.alignedCellRender(cell, { depth })}
                    </div>
                  );
                case "indicator":
                  return (
                    <div
                      style={{
                        padding: "5px",
                        border: "1px solid blue",
                        color: "blue",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {renders.indicatorRender(cell)}
                    </div>
                  );
                case "cross_area":
                  return (
                    <div
                      style={{
                        padding: "5px",
                        border: "1px solid gray",
                        color: "gray",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {renders.crossAreaRender(cell, context)}
                    </div>
                  );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export type DimensionTableComponentProps = {
  uiConfig: DimensionTableUIConfig;
  tableData: DimensionTableData;
  indicatorRender: (cell: IndicatorCell) => React.ReactNode;
};
const DimensionTableComponent: React.FC<DimensionTableComponentProps> = (props) => {
  const { uiConfig, tableData } = props;

  const baseDiemensionRender = (cell: DimensionCell) => {
    switch (cell.dimension.type) {
      case "dimension":
        return <span>{cell.dimension.value.value}</span>;
      case "indicator":
        return <span>{cell.dimension.value.meta.name}</span>;
      case "dimension_placeholder":
        return <span>占位符：{cell.dimension.value.name}</span>;
      default:
        return ''
    }
  }

  return (
    <CommonCrossTable
      uiConfig={uiConfig}
      tableData={tableData}
      renders={{
        dimensionRender: baseDiemensionRender,
        alignedCellRender: (cell, { depth }) => {
          return <div style={{ paddingLeft: 10 * depth  }}>
            {
              baseDiemensionRender({
                type: 'dimension',
                dimension: cell.dimension
              })
            }
          </div>
        },
        indicatorRender: (cell) => {
          return props.indicatorRender(cell);
        },
        crossAreaRender: (cell, context) => {
          if (context.type === "indicator_in_head") {
            if (cell.columnMeta.length > 0) {
              return <span>
                {
                  cell.columnMeta.map(meta => {
                    if (meta.type === "dimension") {
                      return <span>{meta.value.meta.name}</span>;
                    }
                    return <span>-</span>;
                  })
                }
              </span>
            } else {
              return <span>-</span>
            }
          } else if (context.type === "indicator_in_left") {
            if (cell.rowMeta.length > 0) {
              return <span>
                {
                  cell.rowMeta.map(meta => {
                    if (meta.type === "dimension") {
                      return <span>{meta.value.meta.name}</span>;
                    }
                    return <span>-</span>;
                  })
                }
              </span>
            }
          } else {
            return <span>-</span>;
          }
        },
      }}
    />
  );
};

export { DimensionTableComponent };
