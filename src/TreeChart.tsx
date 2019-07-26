import React from "react";
import Tree from "react-d3-tree";
import { interpolateBlues } from "d3";
import { TreeChartNodeLabel } from "./TreeChartNodeLabel";

type Props = { width: number; height: number; data: any };

export default class TreeChart extends React.Component<Props, {}> {
  render() {
    const { height, width, data } = this.props;
    return (
      <div id="treeWrapper">
        <Tree
          data={data}
          allowForeignObjects={true}
          nodeLabelComponent={{
            render: <TreeChartNodeLabel className="myLabelComponentInSvg" />,
            foreignObjectWrapper: {
              y: 2,
              x: 12
            }
          }}
        />
      </div>
    );
  }
}
