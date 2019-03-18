//target the HTML feed
var catFeed = document.getElementById("feed");
/*--Parsing XML to Cards---*/

//Takes XML returns Cat Images Url
var getCatUrl = function(catData) {
  //makes Array to populate URLS
  var catDataImg = [];
  var catDataLength = catData.getElementsByTagName("image").length;

  for (var x = 0; x < catDataLength; x++) {
    //get URL for cat image
    var catUrl = catData.getElementsByTagName("url")[x].childNodes[0].nodeValue;
    catDataImg[x] = catUrl;
  }

  return catDataImg;
};

//Takes XML returns Cat Source Url
var getCatSrc = function(catData) {
  //makes Array to populate URLS
  var catDataSrc = [];
  var catDataLength = catData.getElementsByTagName("image").length;

  for (var x = 0; x < catDataLength; x++) {
    //get source_url for images
    var catUrl = catData.getElementsByTagName("source_url")[x].childNodes[0]
      .nodeValue;
    catDataSrc[x] = catUrl;
  }

  return catDataSrc;
};

/*--Building HTML Cards---*/

//Put Images and Sources  into the HTML
var loadCats = function(catImgUrl, catImgSrc) {
  //(makes img, h1 and divs tags)
  var catContentWrapper = document.createElement("div");
  var catImg = document.createElement("img");
  var catSrc = document.createElement("a");

  //builds catCard
  catImg.src = catImgUrl;
  catSrc.href = catImgSrc;
  catSrc.innerHTML = "Source";
  catContentWrapper.className = "catCard";
  catContentWrapper.appendChild(catImg);
  catContentWrapper.appendChild(catSrc);

  //put catCard into Feed
  catFeed.appendChild(catContentWrapper);
};

/*--API Call for cats and populating newsfeed---*/

//loads moreCats
var moreCats = function(data) {
  //Call API to get XML back
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://api.thecatapi.com/v1/images/search?limit=20",
    method: "GET",
    headers: {
      "x-api-key": "257a1a62-9d7f-4bf2-a513-08c0e30ec01b"
    }
  };
  
  $.ajax(settings).done(function(response) {
    console.log(response;
    var catImg;
    var catSrc;
    var catLength = data.getElementsByTagName("image").length;

    catImg = getCatUrl(data);
    catSrc = getCatSrc(data);

    //Gives img and source URL to build catCards and populate feed
    for (var y = 0; y < catLength; y++) {
      loadCats(catImg[y], catSrc[y]);
  });

    },

    error: function(data) {
      console.log("I MESSED UP THIS BAD BECAUSE OF:" + data);
    }
  });
};

/*--Scroll---*/

//run loadCats when scrolled to bottom
//checks window's scrollY position against the height of catFeed
catFeed.addEventListener("scroll", function() {
  var feedTop = catFeed.scrollTop;
  var feedWindow = catFeed.clientHeight;
  var feedHeight = catFeed.scrollHeight;
  // //TODO 5th post from bottom

  if (feedTop + feedWindow >= feedHeight) {
    moreCats();
  }
});

moreCats();
