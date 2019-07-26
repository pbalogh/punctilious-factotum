import React, { Component } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";

class BarChart extends Component<{ width: number; height: number }, object> {
  ref: SVGSVGElement | undefined = undefined;
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [12, 5, 6, 6, 9, 10];

    const syntaxTree = {
      value: "(ROOT)",
      children: [
        {
          value: "(S)",
          children: [
            {
              value: "(NP)",
              children: [
                { value: "(DT)", children: [{ value: "The" }] },
                { value: "(NN)", children: [{ value: "dog" }] }
              ]
            },
            {
              value: "(VP)",
              children: [
                { value: "(VBZ)", children: [{ value: "is" }] },
                {
                  value: "(ADJP)",
                  children: [{ value: "(JJ)", children: [{ value: "blue" }] }]
                }
              ]
            },
            { value: "(.)", children: [{ value: "." }] }
          ]
        }
      ]
    };

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", 700)
      .attr("height", 300);

    const h = parseInt(svg.attr("height"));

    console.log("h is ", h);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d - 3);
  }

  render() {
    return <div />;
  }
}

export default BarChart;
