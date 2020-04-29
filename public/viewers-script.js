
var visitorid = -1;
$(document).ready(function () {


    var types = [
      {type: "neutral", fill : "#444"}, 
      {type: "happy" , fill : "#ff0"},
      {type: "sad", fill: "#00f"}, 
      {type: "disgusted", fill: "#0f0"},
      {type: "angry", fill: "#f00"}
    ] 

    
    function gridData() { 
        var data = new Array();
        var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        var ypos = 1;
        var width = 50;
        var height = 50; 
    
        // iterate for rows	
        for (var row = 0; row < 10; row++) {
          data.push( new Array() );
    
          // iterate for cells/columns inside rows
          for (var column = 0; column < 10; column++) {
            data[row].push({
              idx: [row,column],
              x: xpos,
              y: ypos,
              width: width,
              height: height,
              type : {...types[0]} // inits every square as empty
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
          }
          // reset the x position after a row is complete
          xpos = 1;
          // increment the y position for the next row. Move it down 50 (height variable)
          ypos += height;	
        }
        return data;
      }
    
      data = gridData();	
      // I like to log the data to the console for quick debugging
      //console.log(data);
    
      var grid = d3.select("#grid")
        .append("svg")
        .attr("width","510px")
        .attr("height","510px");
    
      var row = grid.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row");
    
      var column = row.selectAll(".square")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class","square")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", function(d) { return d.type.fill; })
        .style("stroke", "#222")

    function redraw(){
        row.selectAll(".square") 
          .data(function(d) { return d; })
          .style("fill", function(d) { return d.type.fill })
        
      }

    
    
    const socket = io();
    socket.on("connect", () => socket.emit("hello", `Hi there! I am ${window.navigator.userAgent}`));

    socket.on("welcome", data => {
       
      visitorid = data
        $("#welcome").text(`welcome! you are visitor number ${visitorid} !`) 
    });

    socket.on("visitorLeft", () => {
        
        console.log("visitorLeft")
        $("#welcome").text(`welcome! you are visitor number ${visitorNumber} !`) 
    })

    socket.on("visitorexpressions", newdata => {
        console.log("***** new data1",newdata)
        // update data
        if (newdata) {
            for (var row = 0; row < 10; row++) {
            // iterate for cells/columns inside rows
            for (var column = 0; column < 10; column++) {
                var idx = row*10 + column
                var newtype = newdata[idx]
                if (newtype === undefined){
                  newtype = "neutral"
                }
                var typIdx = types.findIndex((typ) => typ.type === newtype)
                data[row][column].type = types[typIdx]
                }
            }
        }
        redraw()
        console.log("***** new data1",data)
    });

    function redraw(){
    row.selectAll(".square") 
      .data(function(d) { return d; })
      .style("fill", function(d) { return d.type.fill })
    
  }

});