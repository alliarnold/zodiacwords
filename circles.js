export function circles() {

const height = window.innerHeight * .9,
width = height;

let state = {  data: null,};

d3.json('./data/circle-signs.json').then(data => {
  state.data = data;
  console.log(state.data);
   init();
  })

function init() {

const container = d3.select("#circlepack");

const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `-${(width)/2} -${(height)/2} ${width} ${height}`)
    .style("margin", "-40 60")
    .style("background", "##e7dfed")
    .on("click", (event) => zoom(event, root));

const pack = data => d3.pack()
    .size([width,height])
    .radius(d => d.data.value)
    .padding(.01)
    (d3.hierarchy(state.data))
        .sum(d => d.value)
        .sort((a,b) => b.value - a.value);

const root = pack(state.data);
let focus = root;
let view;

console.log(root)

const color = d3.scaleOrdinal()
    .domain(["zodiac", "fire", "earth", "air", "water", "aries", "leo", "sagittarius", "taurus", "virgo", "capricorn", "gemini", "libra", "aquarius", "cancer", "scorpio", "pisces"])
    .unknown("white")
    .range(["#00d1fa", "#faeeed","#e5fae1", "#edfaf9", "#efedfa", "#EA592A", "#FC8B5E","#C0587E", "#4f8901", "#bdd002","#bded55" /*"#e0f5b3"*/, "#72ccb7", "#ffa3f3", "#8ed1f5", "#6579c7", "#a819e6", "#3d13e8"])

const tooltipCircle = d3.select("#two")
  .append("div")
  .attr("class", "tooltip-circle")
  .style("position", "absolute")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("color", "black")
  .style("border-radius", "4px")
  .style("border-width", "2px")
  .style("border-color", "black");

const tipover = function (d) {
  
  d3.select(this).attr("stroke", "black");
  tooltipCircle
            .html(`${d3.select(this).attr("tooltipval")}`) 
            .style("opacity", 1)
            .style("top", `${(height)}`/2 +"px")
            .style("left", `${(height)}`/2 + "px")
            .style("background", "#ebfffb")
}
const tipleave = function () 
{ d3.select(this).attr("stroke", null);
  
  tooltipCircle
    .style("opacity", 0)
}

const node = svg.append("g")
                .selectAll("node")
                .data(root.descendants())
                .join("circle")
                .classed("node", true)
                .attr("r", d=> d.r)
                .attr("fill", d => color(d.data.word))
                .attr("tooltipval", d => d.data.tooltip)
                .attr("pointer-events", d => !d.children ? "none" : null)
                .on("mouseover", tipover)
                .on("mouseout", tipleave)
                .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

const label = svg.append("g")
                    .style("font", "15px sans-serif")
                    .style("font", "bold")
                    .attr("fill", "black")
                    .attr("pointer-events", "none")
                    .attr("text-anchor", "middle")
                .selectAll("text")
                    .data(root.descendants())
                    .join("text")
                    .style("fill-opacity", d => d.parent === root ? 1 : 0)
                    .style("display", d => d.parent === root ? "inline" : "none")
                    .text(d => d.data.word);


zoomTo([root.x, root.y, root.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

return svg.node;
       
}};