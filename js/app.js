
var margin={top:20, right:
  30, bottom:80, left:150},
width = 1000 - margin.left-margin.right,
height = 1000-margin.top-margin.bottom;

var x = d3.scaleLinear()
  .range([0, width]);

var y = d3.scaleTime()
  .range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var timeFormat = d3.timeFormat("%M:%S");
var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))

var yAxis = d3.axisLeft(y).tickFormat(timeFormat)

// Define the div for the tooltip
var tip = d3.select(".display").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svg = d3.select(".container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parsedTime;

/*Setuip fill color*/
var cValue = function(d) { return d.Nationality;}
    //color = d3.scale.category10();


d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',function(error,data){

    console.log(data[0])
    if (error) throw error;
    data.forEach(function(d) {
      //d.Place = +d.Place;
      var parsedTime = d.Time.split(':');
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    });

    x.domain([d3.min(data, function(d) {
      return d.Year - 1;
    }),
             d3.max(data, function(d) {
      return d.Year + 1;
    })]);
    y.domain(d3.extent(data, function(d) {
      return d.Time;
    }));


  // don't want dots overlapping axis, so add in buffer to data domain
  // x-axis
  svg.append("g").attr('class','x-axis')
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  // y-axis
  svg.append("g").attr('class','y-axis')
      .attr("id", "y-axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Time (in minutes)");


svg.append('text')
  .attr('transform', 'rotate(-90)')
    .attr('x', -160)
    .attr('y', -44)
    .style('font-size', 18)
    .text('Time (minutes)');
  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d){
        return x(d.Year)
      })
      .attr("cy", function(d){
        return y(d.Time)})
      .attr('data-xvalue',function(d){
          return d.Year
        })
      .attr('data-yvalue',function(d){
        return d.Time.toISOString()
        })
      .style("fill", function(d) { return color(cValue(d));})
      .on('click',function(d){
        tip.style('opacity',0.9);
        tip.html(
            "<strong>Name: </strong>"+d.Name + "<br ><strong> Country: </strong> <span style='color:black'>" + d.Nationality + "<br ></span><strong>Place:</strong> <span style='color:black'>"+d.Place+"</span><br ><strong>Doping: </strong><span style='color:black'>" +d.Doping)


      })

      var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

      // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

      // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d})
});
