var d3 = require('d3');

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


/*d3.xml("data/fcc.xml", function(error, data) {

});*/

var graph = {
	nodes:	[
		{name: "", fixed: true, x: innerWidth/2, y: innerHeight/2}
	],
	links: []};

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(150)
		.alpha(.01)
		.gravity(0)
    .size([innerWidth, innerHeight]);

var svg = d3.select("body").append("svg")
    .attr("width", innerWidth)
    .attr("height", innerHeight);

function update() {
	force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
	
	var allLinks = svg.selectAll(".link").data(graph.links);
	
	var link = allLinks
    	.enter()
			.append("line")
      .attr("class", "link")
			.style("stroke-width", 1);
	
	allLinks.exit().remove();
	
	var allNodes = svg.selectAll(".node").data(graph.nodes);
	
	function click(d) {
		console.log("Click!");
	}
	
	var node = allNodes
    	.enter()
			.append("g")
      .attr("class", "node")
			.on("click", click);

	node.append("circle")
      .attr("r", 15)
	
	allNodes.exit().remove();

  node.append("text")
      .text(function(d) { return d.name; })
			.attr("y", 25);
	
	force.on("tick", function() {
    svg.selectAll(".link")
				.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    svg.selectAll(".node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				.moveToFront();
		
		center.moveToFront();
  });
}

function connect(person) {
	var newNode = {
		name: person[0]
	}
	graph.nodes.push(newNode);
	for (var i in person[1]) {
		graph.links.push({source: newNode, target: graph.nodes[person[1][i]]});
	}
	update();
}

function simulateConnections() {
	var people = [
		["Adam", [0]],
		["Beth", [0]],
		["Chris", [1, 2]],
		["David", [2]],
		["Erin", [1]],
		["Frank", [0]],
		["Greg", [6]]
	]
	
	var index = 0;
	
	function connectHelper() {
		if (index < people.length) {
			connect(people[index++]);
			setTimeout(connectHelper, Math.random() * 2000 + 1000);
		}
	}
	
	connectHelper();
}

var center = svg.append("circle")
				.attr("class", "center")
				.attr("r", 25)
				.attr("cx", innerWidth - 100)
				.attr("cy", 100)
				.moveToFront();


center.on("click", function	() {
	console.log("foo");
	center.on("click", undefined);
	center.transition()
		.duration(1000)
		.attr("cx", innerWidth / 2.0)
		.attr("cy", innerHeight / 2.0)
		.each('end', function() {
			update();
			simulateConnections();
		});
	d3.select(document.body).attr("meshed", true);
});