import { DimensionTableComponent } from "../example/BizComponent";
import { tableData, uiConfig } from "../example/data";

function App() {
  return (
    <div>
      <DimensionTableComponent
        tableData={tableData}
        uiConfig={uiConfig}
        indicatorRender={(cell) => {
          switch (cell.indicator.type) {
            case "value":
              return <span>{cell.indicator.value.value.vvalue}</span>;
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
