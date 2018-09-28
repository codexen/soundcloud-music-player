/* Search */

var UI = {};

UI.submitClick = document.querySelector(".js-submit").addEventListener("click", function() {

	var search = document.querySelector(".input-search").value;
	UI.reset(".search-results");
	SoundCloudAPI.getTrack(search);

});

UI.submitEnter = document.querySelector(".js-search").addEventListener("keyup", function(e) {

	var search = document.querySelector(".input-search").value;

	if(e.which === 13) {
		UI.reset(".search-results");
		SoundCloudAPI.getTrack(search);
	};

});


/* Resert Search */

UI.reset = function(className) {

	var searchResults = document.querySelector(className);
	searchResults.innerHTML = "";

}

/* Soundcloud API */

var SoundCloudAPI = {};

SoundCloudAPI.init = function(inputValue) {

	SC.initialize({
		client_id: 'wKD1XoleOfPzYbzRjwdVNpMglnopcFja'
	});

}

SoundCloudAPI.init();

SoundCloudAPI.getTrack = function(inputValue) {

  // find all sounds of buskers licensed under 'creative commons share alike'

  SC.get('/tracks', {
  	q: 'buskers', license: 'cc-by-sa'
  }).then(function(tracks) {
  	console.log(tracks);
  });

  SC.get('/tracks', {
  	q: inputValue
  }).then(function(tracks) {
  	console.log(tracks);
  	SoundCloudAPI.renderTracks(tracks);
  });


}

SoundCloudAPI.renderTracks = function(tracks) {

	tracks.forEach(function(track){
  // track inside the function is the response data

  /* Display the Cards */

  var card = document.createElement("div");
  card.classList.add("card");

  var searchResults = document.querySelector(".js-search-results");
  searchResults.appendChild(card);

    // image div
    var image = document.createElement("div");
    image.classList.add("image");

    card.appendChild(image);

    // img
    var img = document.createElement("img");
    img.classList.add("image_img");
    img.src = track.artwork_url || "https://fakeimg.pl/50x50/?text=image";

    image.appendChild(img); 

    // content
    var content = document.createElement("div");
    content.classList.add("content");

    card.appendChild(content);

    // header
    var header = document.createElement("div");
    header.classList.add("header");

    header.innerHTML = "<a href='" + track.permalink_url + "' target='_blank'>" + track.title + "</a>";
    content.appendChild(header);

    // add to playlist
    var button = document.createElement("div");
    button.classList.add("ui", "bottom", "attached", "button", "js-button");

    card.appendChild(button);

    var icon = document.createElement("i");
    icon.classList.add("add", "icon");
    button.appendChild(icon);

    var buttonText = document.createElement("span");
    buttonText.innerHTML = "Add to playlist";

    button.appendChild(buttonText);

    button.addEventListener("click", function() {
    	SoundCloudAPI.getEmbed(track.permalink_url);
    })

});
	
}

SoundCloudAPI.getEmbed = function(trackURL) {
	/* Add to playlist and play */

	SC.oEmbed(trackURL, {
		auto_play: true
	}).then(function(embed){
		console.log('oEmbed response: ', embed);

    // to insert iframe by taking html object from response data
    var sideBar = document.querySelector(".js-playlist");

    var box = document.createElement("div");
    box.innerHTML = embed.html

    sideBar.insertBefore(box, sideBar.firstChild);
    localStorage.setItem("key", sideBar.innerHTML);
});

}

var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");

/* Clearing Storage */
UI.clearStorage = document.querySelector(".clear-history").addEventListener("click", function() {

	localStorage.clear();

});

UI.clearPlaylist = document.querySelector(".clear-playlist").addEventListener("click", function() {
	
	UI.reset(".js-playlist");

});


