import React from "react";

export class TreeChartNodeLabel extends React.Component<any, object> {
  render() {
    const { className, nodeData } = this.props;
    console.log("nodeData is ", nodeData);
    return (
      <div className={className}>
        <h2 className="nodeLabelPart">{nodeData.name}</h2>
        <div className="nodeLabelPart">
          {nodeData.attributes &&
            nodeData.attributes.part &&
            nodeData.attributes.part.toUpperCase() !== "ROOT" &&
            nodeData.attributes.part}
        </div>
        <div className="nodeLabelRaw">
          {nodeData.attributes && nodeData.attributes.raw}
        </div>
      </div>
    );
  }
}
