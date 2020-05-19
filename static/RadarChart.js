
var RadarChart = {
  draw: function(id, ds, options, type){
  var cfg = {
     radius: 4,
     w: 175,
     h: 175,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 50,
     TranslateY: 25,
     ExtraWidthX: 50,
     ExtraWidthY: 50,
     color: '#009933'
    };

    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }

    if(type == 'attack'){
    var d = [
          [
            {axis:"Dribbling",value:ds.dribbling},
            {axis:"Shooting",value:ds.shooting},
            {axis:"Finishing",value:ds.attacking_finishing},
            {axis:"Volleys",value:ds.attacking_volleys},
            {axis:"Shot Curve",value:ds.skill_curve},
            {axis:"Heading",value:ds.attacking_heading_accuracy},
            {axis:"Freekicks",value:ds.skill_fk_accuracy},
            {axis:"Crossing",value:ds.attacking_crossing},
            {axis:"Long Passing",value:ds.skill_long_passing},
            {axis:"Passing",value:ds.passing},
            {axis:"Short Passing",value:ds.attacking_short_passing},
            {axis:"Ball Control",value:ds.skill_ball_control},
          ]
        ];
    } else if (type=='defense'){
        var d = [
          [
            {axis:"Defending",value:ds.defending},
            {axis:"Interception",value:ds.mentality_interceptions},
            {axis:"Positioning",value:ds.mentality_positioning},
            {axis:"Marking",value:ds.defending_marking},
            {axis:"Standing tackle",value:ds.defending_standing_tackle},
            {axis:"Sliding tackle",value:ds.defending_sliding_tackle},
            {axis:"Strength",value:ds.power_strength},
            {axis:"Jumping",value:ds.power_jumping},
            {axis:"Reactions",value:ds.movement_reactions},
            {axis:"Aggression",value:ds.mentality_aggression},
            {axis:"Composure",value:ds.mentality_composure},
            {axis:"Physic",value:ds.physic},
          ]
        ];
        cfg.color = '#33BBFF'
    } else if (type=='physical'){
        var d = [
          [
            {axis:"Pace",value:ds.pace},
            {axis:"Acceleration",value:ds.movement_acceleration},
            {axis:"Stamina",value:ds.power_stamina},
            {axis:"Agility",value:ds.movement_agility},
            {axis:"Sprint Speed",value:ds.movement_sprint_speed},
            {axis:"Balance",value:ds.movement_balance},
            {axis:"Shot Power",value:ds.power_shot_power},
            {axis:"Long Shot Power",value:ds.power_long_shots},
            {axis:"Vision",value:ds.mentality_vision},
            {axis:"Penalties",value:ds.mentality_penalties},
          ]
        ];
        cfg.color = '#800015'
    } else if(type == 'keeper'){
    var d = [
          [
            {axis:"Diving",value:ds.gk_diving},
            {axis:"Handling",value:ds.gk_handling},
            {axis:"Reflexes",value:ds.gk_reflexes},
            {axis:"GK Positioning",value:ds.gk_positioning},
            {axis:"Long Passing",value:ds.skill_long_passing},
            {axis:"Short Passing",value:ds.attacking_short_passing},
            {axis:"Kicking",value:ds.gk_kicking},
            {axis:"GK Speed",value:ds.gk_speed},
          ]
        ];
    }
    else{
        return;
    }
    cfg.maxValue = 100;
    var allAxis = (d[0].map(function(i, j){return i.axis}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    // var Format = d3.format(".1f");
    d3.select(id).select("svg").remove();
    
    var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
            ;

    var tooltip;
    
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0))-2;})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0))+4;})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#333333")
       .text((j+1)*cfg.maxValue/cfg.levels);
    }
    
    series = 0;

    var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i){return "translate(0, -10)"})
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-30*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-15*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
                     .data([dataValues])
                     .enter()
                     .append("polygon")
                     .attr("class", "radar-chart-serie"+series)
                     .style("stroke-width", "2px")
                     .style("stroke", cfg.color)
                     .attr("points",function(d) {
                         var str="";
                         for(var pti=0;pti<d.length;pti++){
                             str=str+d[pti][0]+","+d[pti][1]+" ";
                         }
                         return str;
                      })
                     .style("fill", function(j, i){return cfg.color})
                     .style("fill-opacity", cfg.opacityArea)
                     .on('mouseover', function (d){
                                        z = "polygon."+d3.select(this).attr("class");
                                        g.selectAll("polygon")
                                         .transition(200)
                                         .style("fill-opacity", 0.1); 
                                        g.selectAll(z)
                                         .transition(200)
                                         .style("fill-opacity", .7);
                                      })
                     .on('mouseout', function(){
                                        g.selectAll("polygon")
                                         .transition(200)
                                         .style("fill-opacity", cfg.opacityArea);
                     });
      series++;
    });
    series=0;


    d.forEach(function(y, x){
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.axis})
        .style("fill", cfg.color)
        .on('mouseover', function (d){
                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                    tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(Format(d.value))
                        .transition(200)
                        .style('opacity', 1);

                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1); 
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                  })
        .on('mouseout', function(){
                    tooltip
                        .transition(200)
                        .style('opacity', 1);
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                  })
        .append("svg:title")
        .text(function(j){return Math.max(j.value, 0)});

      series++;
    });
    //Tooltip
    
    tooltip = g.append('text')
               .style('opacity', 0)
               .style('font-family', 'sans-serif')
               .style('font-size', '13px');
               
    d3.select(id)
    .append("p")
        .attr("x", (cfg.width))
        .attr("y", 180)
        .attr("text-anchor", "middle")
        .attr("class", "text-center text-capitalize")
        .style("text-decoration", "underline")
        .text(type+" stats");
  }
};

var tabulate = function (data) {
         var columns = ['sofifaid','playername','cluster']
  var table = d3.select('#table').append('table')
                .attr("class","table");
	var thead = table.append('thead').attr("class","thead-dark")
	var tbody = table.append('tbody')

	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
        .attr("scope","col")
	    .text(function (d) { return d })

	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')

	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
      .attr("scope","row")
      .text(function (d) { return d.value })

  return table;
};

