var w = 200,
    h = 200;





//Data
var d = [
          [
            {axis:"Shooting",value:92},
            {axis:"Dribbling",value:96},
            {axis:"Passing",value:92},
            {axis:"Crossing",value:88},
            {axis:"Finishing",value:95},
            {axis:"Heading",value:70},
            {axis:"Short Passing",value:92},
            {axis:"Volleys",value:88},
            {axis:"Shot Curve",value:93},
            {axis:"Freekick Acc",value:94},
            {axis:"Long Passing",value:92},
            {axis:"Ball Control",value:96},
          ]
        ];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 6,
  ExtraWidthX: 100
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart0", d, mycfg);
RadarChart.draw("#chart1", d, mycfg);
RadarChart.draw("#chart2", d, mycfg);

