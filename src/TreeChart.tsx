import React from "react";
import Tree from "react-d3-tree";

type Props = { width: number; height: number; data: any };

export default class TreeChart extends React.Component<Props, {}> {
  render() {
    const { height, width, data } = this.props;
    return (
      <div id="treeWrapper">
        <Tree data={data} />
      </div>
    );
  }
}
