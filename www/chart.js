import { memory } from "crypto-charts/crypto_charts_bg";
import * as wasm from "crypto-charts";

Float32Array.prototype.chunk = function (size) {
  let data = [...this];
  let result = [];

  while (data.length) {
    result.push(data.splice(0, size));
  }

  return result;
};

wasm.getPoints().then((pointsPtr) => {
  //   console.log("arr: " + pointsPtr.arr());
  //   console.log("len: " + pointsPtr.len());

  const points = new Float32Array(
    memory.buffer,
    pointsPtr.arr(),
    pointsPtr.len()
  );

  var margin = {
      top: 10,
      right: 30,
      bottom: 30,
      left: 60,
    },
    width = 350 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  var data = points.chunk(2).map((item) => ({ x: item[0], y: item[1] }));

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.x;
      })
    )
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.y;
      })
    )
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        })
    );
});
