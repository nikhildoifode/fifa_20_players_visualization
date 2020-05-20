

var SCRIPT_ROOT = window.location.href


var margin = {top: 10, right: 0, bottom: 20, left: 10},
    svg_dx = 800, 
    svg_dy = 380,
    plot_dx = svg_dx - margin.right - margin.left,
    plot_dy = svg_dy - margin.top - margin.bottom;

var x = d3.scaleLinear().range([margin.left, plot_dx]),
    y = d3.scaleLinear().range([plot_dy, margin.top]);

var formatIncome = d3.format("$,");

var svg = d3.select("#chart")
            .append("svg")
            .attr("width", svg_dx)
            .attr("height", svg_dy);



d3.csv("/static/newPlayers.csv", d => {
    var n = d.length;

    var d_extent_x = d3.extent(d, d => +d.pca0),
        d_extent_y = d3.extent(d, d => +d.pca1);

    x.domain(d_extent_x);
    y.domain(d_extent_y);

    var axis_x = d3.axisBottom(x),
        axis_y = d3.axisLeft(y);

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    var circles = svg.append("g")
                     .selectAll("circle")
                     .data(d)
                     .enter()
                     .append("circle")
                     .attr("r", 4)
                     .attr("cx", (d) => x(+d.pca0))
                     .attr("cy", (d) => y(+d.pca1))
                     .attr("class", "non_brushed")
                     .attr("id",(d) => "p"+d.sofifa_id)
                     .style("fill", (d) => { return color(d.cluster) });


      svg.append("text")
        .attr("x", 800-250)
        .attr("y", 10)
        .attr("text-anchor", "left")
        .style("font-size", "11px")
        .style("text-decoration", "underline")
        .text("Brush over players to load their details in the table");

    var table = d3.select('#table').append('table')
        .attr("class","table");

    function highlightBrushedCircles() {

        if (d3.event.selection != null) {

            // revert circles to initial style
            circles.attr("class", "non_brushed");

            var brush_coords = d3.brushSelection(this);

            // style brushed circles
            circles.filter(function (){

                       var cx = d3.select(this).attr("cx"),
                           cy = d3.select(this).attr("cy");

                       return isBrushed(brush_coords, cx, cy);
                   })
                   .attr("class", "brushed");
        }
    }

    function displayTable() {

        // disregard brushes w/o selections  
        // ref: http://bl.ocks.org/mbostock/6232537
        if (!d3.event.selection) return;

        // programmed clearing of brush after mouse-up
        // ref: https://github.com/d3/d3-brush/issues/10
        d3.select(this).call(brush.move, null);

        var d_brushed =  d3.selectAll(".brushed").data();

        // populate table if one or more elements is brushed
        if (d_brushed.length > 0) {
            clearTableRows();
            clearParCor ()
            drawParCor(d_brushed)
            d_brushed.forEach(d_row => populateTableRow(d_row))
        } else {
            clearParCor ()
            clearTableRows();
        }
    }

    var brush = d3.brush()
                  .on("brush", highlightBrushedCircles)
                  .on("end", displayTable); 

    svg.append("g")
       .call(brush);
});

function clearTableRows() {

    hideTableColNames();
    d3.selectAll(".row_data").remove();
}



var cfg = {
    w: 150,
    h: 150,
    ExtraWidthX: 50,
    ExtraWidthY: 50,
    TranslateX: 50,
    TranslateY: 25
}

function isBrushed(brush_coords, cx, cy) {

     var x0 = brush_coords[0][0],
         x1 = brush_coords[1][0],
         y0 = brush_coords[0][1],
         y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}

function hideTableColNames() {
    d3.select("table").style("visibility", "hidden");
}

function showTableColNames() {
    d3.select("#card").style("visibility", "hidden")
    clearAllRadarCharts();
    d3.select("#table").style("visibility", "hidden")
    d3.select("table").style("visibility", "visible");
}

function clearAllRadarCharts() {
    d3.select("#chart0").selectAll("*").remove();
    d3.select("#chart1").selectAll("*").remove();
    d3.select("#chart2").selectAll("*").remove();
    d3.select("#chart3").selectAll("*").remove();
}

function refreshRadarCharts(d){
    if(d.team_position =="GK"){
        RadarChart.draw("#chart0", d, mycfg, "keeper");
    }else{
        RadarChart.draw("#chart0", d, mycfg, "attack");
    }
    RadarChart.draw("#chart1", d, mycfg, "defense");
    RadarChart.draw("#chart2", d, mycfg, "physical");
    drawLineChart(ds,d.value_eur, "Transfer Value Percentile")
    drawLineChart(ds1,d.wage_eur, "Player Wage Percentile")

}

function playerCard(d_row){
    clearTableRows()
    hideParCor ()
    clearAllRadarCharts()
    refreshRadarCharts(d_row)

    d3.selectAll("circle")
        .attr("class","non_brushed")
    d3.select("#p"+d_row.sofifa_id)
        .attr("class","brushed")
        .style("position","relative")
        .style("z-index","-1")

    d3.select("#table")
      .select("img")
      .attr("src","https://futhead.cursecdn.com/static/img/20/players/"+d_row.sofifa_id+".png")
      .style("float","middle")

    d3.select("#card")
      .select(".card-body")
      .append("ul")
      .attr("class","list-group")

    d3.select("#card").style("visibility", "visible")
    d3.select("#card")
      .select("ul")
      .selectAll("li").remove()
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Name: "+d_row.short_name)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Position: "+d_row.team_position)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Club: "+d_row.club)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Nationality: "+d_row.nationality)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Overall: "+d_row.overall)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Potential: "+d_row.potential)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Age: "+d_row.age)
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Height: "+d_row.height_cm+"cm")
      .attr("class","list-group-item")
    d3.select("#card")
      .select("ul")
      .append("li")
      .text("Weight: "+d_row.weight_kg+"kg")
      .attr("class","list-group-item")



}

function populateTableRow(d_row) {
    showTableColNames();
    var d_row_filter = [d_row.team_position,
                        d_row.short_name,
                        d_row.club,
                        d_row.overall,
                        formatIncome(d_row.value_eur)
                        ];

    d3.select("#table").select("table")
      .append("tr")
      .on("click", function(d){playerCard(d_row)})
      .on("mouseover", function(d) { highlight(d_row) })
      .on("mouseout", function (d) { unhighlight() })
      .attr("class", "row_data")
      .selectAll("td")
      .data(d_row_filter)

      .enter()
      .append("td")
      .attr("align", (d, i) => i < 2 ? "left" : "right")
      .text(d => d)
}

function drawLineChart(data, mark_value, title) {

var margin = {top: 0, right: 10, bottom: 20, left: 25},
    width = 300,
    height = 90;

// append the svg object to the body of the page
var svg1 = d3.select("#chart3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

formatValue = d3.format(".2s");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.value); })
    .y(function(d) { return y(d.count); });


  // format the data
  data.forEach(function(d) {

      d.value = +d.value;
      d.count = +d.count;
  });
  
  // sort years ascending
  data.sort(function(a, b){
    return a["value"]-b["value"];
    })
 
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.value; }));
  y.domain([0, d3.max(data, function(d) {
      return d.count; })]);
  
  // Add the valueline path.
  svg1.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(function(d) { return formatValue(d)}));

  // Add the Y Axis
  svg1.append("g")
      .call(d3.axisLeft(y).ticks(4));
  
      svg1.append('line')
      .attr('x1', x(mark_value))
      .attr('y1', 95)
      .attr('x2', x(mark_value))
      .attr('y2', 10 )
      .style("stroke-width", 1)
      .style("stroke", "red")
      .style("fill", "none");

      svg1.append("text")
        .attr("x", (width / 2)+40)
        .attr("y", 25)
        .attr("text-anchor", "right")
        .style("font-size", "10px")
        .text(title);
  }

var pc2

function clearParCor () {
    d3.select("#example").style("display", "block")
    d3.select("#example").selectAll("*").remove();
}

function drawParCor (data) {
    for (let i = data.length - 1; i >= 0; i--)
        if (data[i] === undefined) data.splice(i,1)
        else break

    pc2 = ParCoords()("#example")

    pc2.data(data)
    .bundlingStrength(0.6)
    .smoothness(0.05)
    .color('#069')
    .alpha(0.4)
    .composite('darken')
    .dimensions(['league', 'playerType', 'age', 'overall', 'potential', 'wage_eur', 'value_eur', 'height_cm', 'weight_kg'])
    .margin({ top: 25, left: 130, bottom: 10, right: 20 })
    .height(300)
    .render()
    .brushMode("1D-axes")
    .reorderable()
    .interactive()

    pc2.on("brush", function (d) {
        clearTableRows();
        d.forEach(d_row => populateTableRow(d_row))
    })
}

function highlight(d) {
    pc2.highlight([d])
}

function unhighlight() {
    pc2.unhighlight()
}

function hideParCor () {
    d3.select("#example").style("display", "none")
}

