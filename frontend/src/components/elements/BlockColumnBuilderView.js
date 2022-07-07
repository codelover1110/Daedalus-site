import React from "react";
import Blockly from "blockly";
import ConfigFiles from "../blocklycontent/content";

class MainStrategyBuilderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolboxConfiguration: ConfigFiles.INITIAL_TOOLBOX_JSON,
    };
  }

  render() {
    const { setBlockType } = this.props;
    return (
      <div
        style={{
          backgroundColor: "#212329",
          width: 351,
          height: 778,
          borderRadius: "15px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: 28,
          paddingLeft: 28,
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => {
            setBlockType("buy");
          }}
          style={{
            width: 200,
            padding: 10,
            backgroundColor: "rgba(23, 23, 23, 0.7)",
            border: 0,
            color: "white",
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          Buy
        </button>
        <button
          onClick={() => {
            setBlockType("if");
          }}
          style={{
            width: 200,
            padding: 10,
            backgroundColor: "rgba(23, 23, 23, 0.7)",
            border: 0,
            color: "white",
            borderRadius: 10,
          }}
        >
          if
        </button>
      </div>
    );
  }
}

export default MainStrategyBuilderView;
