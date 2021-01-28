import { json } from "https://cdn.skypack.dev/d3-fetch";

const width = 900;
const height = 600;
const padding = 30;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", "0,0,1100,600")
  .attr("maintainAspectRatio", "xMidYMid");

d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
).then((response) => {

  // sort the data by value size
  let root = d3.hierarchy(response).sum((d) => d.value);

  d3.treemap().size([width+250, height]).padding(1)(root);

 const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

  
  const mousemove = (event, d) => {
    let pageX = event.pageX;
    let pageY = event.pageY;

    const text = d3
      .select("#tooltip")
    .attr("data-value",d.value)
      .html("<p>" + d.data.name + ": " + d.value +"</p>")
      .style("left", pageX + "px")
      .style("top", pageY + "px");
  };


  
  let keys = ["Wii","DS","X360","GB", "PS3","NES", "PS2", "3DS","PS4","SNES","PS","N64","GBA","XB","PC","2600","PSP","XOne"]
  
  let colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999","#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
  let colorCycle = d3.scaleOrdinal()
    .domain(keys)
  .range(colors)
  
 

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class","tile")
  .attr("data-name",(d) => d.data.name)
  .attr("data-category",(d) => d.parent.data.name)
  .attr("data-value",(d) => d.value)
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill",(d) => colorCycle(d.parent.data.name))
    .style("stroke", "gray").on("mouseover", (d, i) => d3.select("#tooltip").style("opacity", "1"))
    .on("mouseleave", (d, i) => d3.select("#tooltip").style("opacity", "0"))
    .on("mousemove", mousemove);
  
    svg.selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .selectAll('tspan')
      // splits the name string and maps the returned array whilst maintaining the original x0y0 values
      .data(d => {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g)
              .map(v => {
                  return {
                      text: v,
                      x0: d.x0,
                      y0: d.y0
                  }
              });
      })
      .enter()
      .append('tspan')
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d, i) => d.y0 + 10 + (i * 10))
      .text((d) => d.text)
      .attr("font-size", "0.6em")
      .attr("font-family","monospace")      
      .style("overflow","hidden")
      .attr("fill", "black");
  
  let legend = svg
      .append('g')
      .attr('id', 'legend')
  
  
  legend
    .selectAll("rect")
    .data(keys)
  .enter()
  .append("rect")
.attr("class","legend-item")    .attr("id","legend")
    .attr("x", 1165)
    .attr("y", function(d,i){ return 25 + i*20}) .attr("width", 20)
    .attr("height",20)
    .style("fill", function(d){ return colorCycle(d)})
  
  
  legend.selectAll("text")
    
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 1190)
    .attr("y", function(d,i){ return 25 + (i*20)+12}).text(function(d){ return d}).attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-family", "monospace")
    
});
