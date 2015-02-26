var d3 = require('d3');

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

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

var body = d3.select("body");

var svg = d3.select("svg")
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

d3.xml("data/fcc.xml", function(error, data) {
	
});

var center = d3.select(".center");

d3.selectAll(".item[href^='#']")
	.on("click", function(e) {
		d3.select("#myModalExample").classed("active", true);
	});

d3.selectAll(".icon-close[href^='#']")
	.on("click", function(e) {
		d3.select("#myModalExample").classed("active", false);
	});

center.on("click", function	() {
	center.on("click", undefined);
	body.attr("meshed", true);
		setTimeout(function () {
			update();
			simulateConnections();
		}, 1000);
});