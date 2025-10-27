import { DimensionTableComponent } from "../example/Component";
import {
  tableData,
  uiConfig,
  // uiConfig2 as uiConfig,
  // uiConfig3 as uiConfig
} from "../example/dimensionTable";

function App() {
  return (
    <div>
      <DimensionTableComponent
        tableData={tableData}
        uiConfig={uiConfig}
        indicatorRender={(cell) => {
          switch (cell.indicator.type) {
            case "value":
              return <span>{cell.indicator.value.value}</span>;
            case "toFill":
              return <span>-</span>;
            default:
              return '';
          }
        }}
      />
    </div>
  );
}

export default App;
