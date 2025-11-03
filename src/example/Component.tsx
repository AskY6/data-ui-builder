import React, { useMemo } from "react";
import {
  buildTable,
  getAlignedDepth,
  type AlignedCell,
  type CrossArea,
  type DimensionCell,
  type DimensionTableData,
  type DimensionTableUIConfig,
  type IndicatorCell,
} from "./dimensionTable";

export type CellRenderContext = {
  type: DimensionTableUIConfig["type"];
};
export type CommonCrossTableProps<U, T> = {
  uiConfig: DimensionTableUIConfig;
  tableData: DimensionTableData<U, T>;
  renders: {
    alignedCellRender: (
      cell: AlignedCell<U, T>,
      option: { depth: number }
    ) => React.ReactNode;
    dimensionRender: (cell: DimensionCell<T>) => React.ReactNode;
    indicatorRender: (cell: IndicatorCell<U>) => React.ReactNode;
    crossAreaRender: (
      cell: CrossArea,
      context: CellRenderContext
    ) => React.ReactNode;
  };
};
export function CommonCrossTable<U, T>(props: CommonCrossTableProps<U, T>) {
  const { uiConfig, tableData, renders } = props;

  const dataToRender = useMemo(() => {
    const data = buildTable(tableData, uiConfig);
    return data;
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
                        width: "250px",
                      }}
                    >
                      {renders.dimensionRender(cell)}
                    </div>
                  );
                case "aligned_dimension": {
                  const depth = getAlignedDepth(cell);
                  return (
                    <div
                      style={{
                        fontWeight: "bold",
                        padding: "5px",
                        border: "1px solid red",
                        color: "red",
                        display: "inline-block",
                        width: "250px",
                      }}
                    >
                      {renders.alignedCellRender(cell, { depth })}
                    </div>
                  );
                }
                case "indicator":
                  return (
                    <div
                      style={{
                        padding: "5px",
                        border: "1px solid blue",
                        color: "blue",
                        display: "inline-block",
                        width: "250px",
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
                        width: "250px",
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
}
