export function heatmap() {

function renderData(dataElements) {

    //dims
    let width = window.innerWidth * .8;
    let height = window.innerHeight * .9;
    let margin = ({ top: 40, right: 0, bottom: 0, left: 40 })

    //variables and data structure
    let signs = new Set(dataElements.map(d => d.source));
    let sentiments = new Set(dataElements.map(d => d.target));
    let dataset = dataElements.map(d => ({sign: d.source, sentiment: d.target, value: d.value}));

    //xscale
    const x = d3.scaleBand()
        .domain(sentiments)
        .range([margin.left, width-margin.left])
        .padding(1);
    
    //yscale
    const y = d3.scaleBand()
        .domain(signs)
        .range([height-margin.top, margin.top])
        .padding(1);

    const container = d3.select("#heatmap")
        //.style("position", "relative");
    
    const svg = container
        .append("svg")
        .attr("viewBox", [-15, -30, width, height])
        .style("background", "#70238c" );

    const xAxis = d3.axisTop(x).tickSize(0);

    const tooltip = d3.select("#one")
        .append("div")
        .data(dataset)
        .style("opacity", 0)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("color", "#70238c")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("border-color", "#70238c")

    svg.append("g")
        .style("font-size", 15)
        .style("color", "#fbf7fc")
        .attr("transform", `translate(0,${margin.top})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .selectAll("text")	
        .style("text-anchor", "start")
        .attr("transform", "rotate(-35)")
        .select(".domain").remove()

    svg.append("g")
        .style("font-size", 15)
        .style("color", "#faf0fc")
        .attr("transform", `translate(${margin.left+15},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

    let colorZ = d3.scaleLinear()
        .range(["#70238c","#fcf7fc"])
        .domain([0, 72]);


    const mouseover = function(d, i) {
            d3.select(this)
            .style("stroke-width", 10)
            .style("stroke", "white")
            .transition()
                .duration(12)
                .style("stroke-width", 8)
            .style("stroke", "#fbf7fc")
            .transition()
                .duration(12)
                .style("stroke-width", 6)
                .style("stroke", "#fcfcf0")
            .transition()
                .duration(12)
                .style("stroke-width", 4)
                .style("stroke", "#f5d7fc")
            .transition()
                .duration(12)
                .style("stroke-width", 2)
                .style("stroke", "white")
            .transition()
                .duration(1)
                .style("stroke", "none")
            
            tooltip.style("opacity", 1)
               .html(`${d3.select(this).attr("sign")} scored ${d3.select(this).attr("datavalval")} points for ${d3.select(this).attr("sentiment")}`)  
                   .style("left", d3.select(this).attr("cx") + "px")
                   .style("top", d3.select(this).attr("cy")+ "px");
            };

    const mouseleave = function (d) {
        d3.select(this)
        .style("stroke", "none")
        tooltip.style("opacity", 0)
        };

    svg.append("g")
        .selectAll()
        .data(dataset, d => { return d.sign + ':' + d.sentiment;})
        .enter()
        .append("circle")
        .attr('datavalval', d=> d.value)
        .attr("sign", d=> d.sign)
        .attr("sentiment", d=> d.sentiment)
        .attr("cx", d => x(d.sentiment))
        .attr("cy", d => y(d.sign))
        .attr("r", 15)
        .style("fill", d => colorZ(d.value))
        .style("opacity", 0)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .transition()
        .duration(100)
        .delay((d,i) => i*25)
        .style("opacity", 1);
};

d3.csv('./data/heat.csv').then(data => {
    console.log("loaded data: ", data);
    renderData(data)
});};