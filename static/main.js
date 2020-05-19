/*
var margin = {top: 0, right: 0, bottom: 0, left: 0},
width = 842 - margin.left - margin.right,
height = 405 - margin.top - margin.bottom;

var SCRIPT_ROOT = window.location.href

function generateViz() {
    $.getJSON(SCRIPT_ROOT + '/displayVisualization',
    (d) => {
        createGraph(d.data)
        tabulate(d.data)
    })
}

function generateParallelCo() {
    var x = d3.scalePoint().range([0, width], 1),
    y = {},
    dragging = {};

    var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

    var svg = d3.select(".viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./static/temp.csv"). then((cars) => {
        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
            y[d] = d3.scaleLinear()
            .domain(d3.extent(cars, function(p) { return +p[d]; }))
            .range([height, 0])
            return true
        }));

        // Add grey background lines for context.
        background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(cars)
        .enter()
        .append("path")
        .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(cars)
        .enter().append("path")
        .attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .subject(function(d) { return {x: x(d)}; })
            .on("start", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background.attr("d", path)
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            }));

        // Add an axis and title.
        g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

        // Add and store a brush for each axis.
        // g.append("g")
        // .attr("class", "brush")
        // .each(function(d) {
        //     d3.select(this)
        //     .call(
        //         y[d].brush = d3.brushY(y[d])
        //         .on("start", brushstart)
        //         .on("brush", brush)
        //     );
        // })
        // .selectAll("rect")
        // .attr("x", -8)
        // .attr("width", 16)
    });

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }
}



function createGraph(data) {
    d3.select(".viz").html('')

    // setup graph
    var svg = d3.select(".viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style('margin-left', '0%')
    .style('padding', '0px 0px')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var color = d3.scaleOrdinal(d3.schemeCategory10);

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    data.forEach((d) => {
        d.xvalue = +d.xvalue
        d.yvalue = +d.yvalue
    })

    // x-axis
    var xValue = (d) => { return d.xvalue },
    xScale = d3.scaleLinear().range([0, width]),
    xMap = (d) => { return xScale(xValue(d)) },
    xAxis = d3.axisBottom().scale(xScale)

    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1])

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .attr("dy", "3.00em")
    .attr("dx", "-30.00em")
    .text("PC 1")

    // y-axis
    var yValue = (d) => { return d.yvalue },
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = (d) => { return yScale(yValue(d)) },
    yAxis = d3.axisLeft().scale(yScale)

    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1])

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-3.0em")
    .attr("dx", "-12.00em")
    .style("text-anchor", "end")
    .text("PC 2")

    var graphtitle = 'PCA Plot'

    // draw legend
    svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text(graphtitle)

    // main graph
    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 2)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", (d) => { return color(d.cluster) })
    .on("mouseover", function(d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(d.playername).style("background-color",'#4CAF50')
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
    });

    // draw legend
    var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (_, i) => { return "translate(0," + i * 20 + ")" })

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", color)

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 5)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => { return "Cluster " + d + " -" })

}

function generateSpiderChart() {

}

var cfg = {
    w: 150,
    h: 150,
    ExtraWidthX: 50,
    ExtraWidthY: 50,
    TranslateX: 50,
    TranslateY: 25
}

function clearAllHistoCharts() {
    d3.select("#chart0").selectAll("svg").remove();
    d3.select("#chart1").selectAll("svg").remove();
    d3.select("#chart2").selectAll("svg").remove();
}

function drawHistogram (data, xField, id) {
    var xScaleNew = d3.scaleLinear()
    .range([0, cfg.w])

    var yScale = d3.scaleLinear()
    .range ([cfg.h, 0]);

    var svg = d3.selectAll(id)
    .append("svg")
    .attr("width", cfg.w + cfg.ExtraWidthX)
    .attr("height", cfg.h + cfg.ExtraWidthY);

    var graph = svg.append("g")
    .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    var xAxis = graph.append("g")
    var yAxis = graph.append("g")

    let range = d3.extent(data, function(d) { return parseInt(d[xField]); })
    xScaleNew.domain([range[0], Math.ceil((range[1] + 1) / 10) * 10])

    var histogram = d3.histogram()
    .value(function(d) { return d[xField]; })
    .domain(xScaleNew.domain())
    .thresholds(xScaleNew.ticks(5));

    var bins = histogram(data);

    xAxis.attr("transform", "translate(0," + cfg.h + ")")
    .call(d3.axisBottom(xScaleNew).tickFormat( function(d){ return d; }).ticks(bins.length));

    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);
    yAxis.call(d3.axisLeft(yScale));

    svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", cfg.TranslateX)
    .attr("y", cfg.TranslateY)
    .attr("transform", function(d) {return "translate(" + xScaleNew(d.x0) + "," + yScale(d.length) + ")"; })
    .attr("width", function(d) { return xScaleNew(d.x1) - xScaleNew(d.x0); })
    .attr("height", function(d) { return cfg.h - yScale(d.length); })
    .style("fill", "steelblue")
}

function drawHistoCharts (data) {
    drawHistogram (data, 'age', '#chart0')
    drawHistogram (data, 'wage_eur', '#chart1')
    drawHistogram (data, 'potential', '#chart2')
}
*/

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
    .smoothness(0.125)
    .color('#069')
    .alpha(0.4)
    .composite('darken')
    .dimensions(['league' ,'age', 'overall', 'potential', 'wage_eur', 'value_eur', 'playerType', 'height_cm', 'weight_kg'])
    .margin({ top: 25, left: 130, bottom: 10, right: 20 })
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
