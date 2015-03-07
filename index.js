var graph = require("wax-graph");
var $ = require("jquery");
var rss = require("wax-rss");

var rssListElement, center;

function simulateConnections() {
	var people = [
		{ name:"Adam", id: 1, links: [0]},
		{ name:"Beth", id: 2, links: [0]},
		{ name:"Chris", id: 3, links: [1, 2]},
		{ name:"David", id: 4, links: [2]},
		{ name:"Erin", id: 5, links: [1]},
		{ name:"Frank", id: 6, links: [0]},
		{ name:"Greg", id: 7, links: [6]},
		{ name:"Heather", id: 8, links: [4]}
	]
	
	var index = 0;
	
	function connectHelper() {
		if (index < people.length) {
			graph.connect(people[index]);
			
			people[index].links.forEach(function (l) {
				if (l == 0) {
					graph.linkToMe(people[index].id);
				} else {
					graph.addLink(people[index].id, people[l - 1].id);
				}
			});
			index++;
			setTimeout(connectHelper, Math.random() * 2000 + 1000);
		}
	}
	
	connectHelper();
}

function populateArticleList() {
		var $this = $(this);
		var url = $this.attr("href");
		var $rssList = $('#rss-modal-list');
		rss.getFeed(url).then(function(articles) {
			articles.forEach(function(article) {
				var li = $('<li class="table-view-cell media"></li>');
				var a = $('<a class="rss-item" href="' + article.guid + '"></a>');
				var mediaBody = $('<div class="media-body"></div>');
				mediaBody.html("<h4>" + article.title + "</h4>" + 
											 "<p>" + article.description + '</p>');
				li.append(a);
				a.append('<img class="media-object pull-left" src="' + 
						article.image + '"></img>')
			 		.append(mediaBody);
					$rssList.append(li);
			});
			$('#list-modal').addClass("active");
		});
	}

function populateRSSList() {
	rssListElement.html("");
	rss.getSubscribedList().then(function(rssList) {
		for (var url in rssList) {
			var li = $('<li class="table-view-cell media"></li>');
			var a = $('<a class="rss-item" href="' + url + '"></a>');
			var mediaBody = $('<div class="media-body"></div>');
			mediaBody.html(rssList[url].channel.title + 
						"<p>" + rssList[url].channel.description + "</p>");
			li.append(a);
			a.append('<img class="media-object pull-left" src="' + 
							 rssList[url].image + '"></img>')
			 .append(mediaBody);
			a.click(populateArticleList);
			rssListElement.append(li);
		}
	});
}

$(document).ready(function() {
	rssListElement = $('#rss-list');
	center = $(".center");
	
	rss.sync()
		.then(populateRSSList);

	$("#add").click(function() {
		$('#subscribe-modal').addClass("active");
	});

	$('#subscribe-modal .icon-close').click(function() {
		$('#subscribe-modal').removeClass("active");
	});
	
	$('#list-modal .icon-close').click(function() {
		$('#list-modal').removeClass("active");
	});
	
	$('#reader-modal .icon-close').click(function() {
		$('#reader-modal').removeClass("active");
	});

	function subscribe() {
		var $this = $(this);
		$this.addClass("btn-outlined");
		$this.text("Loading, please wait...");
		$this.off("click");
		rss.subscribe($('#subscribe-url').val())
			.then(rss.sync)
			.then(populateRSSList)
			.then(function() {
				$('#subscribe').click(subscribe);
				$('#subscribe-modal').removeClass("active");
				$this.removeClass("btn-outlined");
				$this.text("Subscribe");			
			});
	}
	
	$('#subscribe').click(subscribe);

	center.on("click", function	() {
		center.on("click", undefined);
		$(document.body).attr("meshed", true);
		setTimeout(function () {
			graph.show();
			simulateConnections();
			$("#connectedPosts").css("display", "none");
		}, 1000);
	});
	
	$(".rss-item").click()
});