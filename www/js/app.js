$(document).ready(function(){  
	document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady(){

	//Check Local Storage for channel

	if(window.localStorage.getItem("channel") == null || window.localStorage.getItem("channel") == ''){
		//Ask user for channel
		$('#popupDialog').popup("open");
	}else{
		var channel = window.localStorage.getItem("channel");
	}

	if(window.localStorage.getItem("maxresults") == null || window.localStorage.getItem("maxresults") == ''){
		setMaxResults(10);
	}

	if(window.localStorage.getItem("maxresults") > 25 ){
		setMaxResults(25);
	}

	getPlaylist(channel);
	
	$(document).on('click', '#vidlist li', function(){
		var videoId = $(this).attr('videoid');
		showVideo(videoId);
	});

	$('#channelBtnOK').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlaylist(channel);
		$('#channelName').val('');
	});

	$("#saveOptions").click(function(){
		saveOptions();
	});

	$("#clearChannel").click(function(){
		clearChannel();
	});

	$(document).on('pageinit', '#options', function(){
		var channel = window.localStorage.getItem("channel");
		var maxresults = window.localStorage.getItem("maxresults");
		$('#channelNameOptions').val(channel);
		$('#maxResultsOptions').val(maxresults);
	});


}

function getPlaylist(channel){
	$("#vidlist").html('');
	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyBwdePeNK5f-oTUVXjUht7fPcm5SYxj6KA'
			},
			function(data){
				$.each(data.items, function(i, item){
					var playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId, window.localStorage.getItem('maxresults'));
				});
			}
		);
}

function getVideos(playlistId, maxResults){
	$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems",
			{
				part: "snippet",
				maxResults: maxResults,
				playlistId: playlistId,
				key: 'AIzaSyBwdePeNK5f-oTUVXjUht7fPcm5SYxj6KA'
			}, 
			function(data){
				var output;
				$.each(data.items, function(i, item){
					var id = item.snippet.resourceId.videoId;
					var title = item.snippet.title;
					var thumb = item.snippet.thumbnails.default.url;
					$('#vidlist').append('<li videoid="' + id + '"><img src="'  + thumb + '" /><h3>' + title + '</h3></li>');
					$('#vidlist').listview('refresh');
				});
			}
		);
}



function showVideo(videoId){
	$("#logo").hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/' + videoId +'" frameborder="0" allowfullscreen></iframe>';

	$("#showVideo").html(output);

}

function setChannel(channel){
	window.localStorage.setItem("channel", channel);
}

function saveOptions(){
	var channel = $("#channelNameOptions").val();
	setChannel(channel);
	var maxResults = $("#maxResultsOptions").val();
	setMaxResults(maxResults);
	$('.app').pagecontainer('change', '#home',{options});
	getPlaylist(channel);
}

function clearChannel(){
	window.localStorage.removeItem('channel');
	window.localStorage.removeItem('maxresults');
	$('.app').pagecontainer('change', '#home',{options});
	$('#vidlist').html('');
	$('#channelNameOptions').val('');
	$('#maxResultsOptions').val('');
	$('#popupDialog').popup('open');
}

function setMaxResults(maxResults){
	window.localStorage.setItem("maxresults", maxResults);
}
