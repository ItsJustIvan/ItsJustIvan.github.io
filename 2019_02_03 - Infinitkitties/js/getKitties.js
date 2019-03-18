//target the HTML feed
let catFeed = document.getElementById("feed");

/*--Building HTML Cards---*/

//Put Images and Sources  into the HTML
let loadCats = function(catImgSrc) {
  //(makes img, h1 and divs tags)
  var catContentWrapper = document.createElement("div");
  var catImg = document.createElement("img");

  //builds catCard
  catImg.src = catImgSrc;
  catImg.className = "card-img-top";
  catContentWrapper.className = "justify-content-center card catCard";
  catContentWrapper.appendChild(catImg);

  //put catCard into Feed
  catFeed.appendChild(catContentWrapper);
};

//2/3/2019

//loads moreCats
let moreCats = () => {
  let settings = {
    async: true,
    crossDomain: true,
    url: "https://api.thecatapi.com/v1/images/search?limit=20",
    method: "GET",
    headers: {
      "x-api-key": "257a1a62-9d7f-4bf2-a513-08c0e30ec01b"
    }
  };

  //Call API to get XML back
  $.ajax(settings)
    .done(function(response) {
      for (var i = 0; i < response.length; i++) {
        loadCats(response[i].url);
      }
    })
    .fail(function() {
      console.log("error");
    });
};

window.onload = moreCats;

/*--Scroll---*/

//run loadCats when scrolled to bottom
//checks window's scrollY position against the height of catFeed
window.addEventListener("scroll", function() {
  let windowHeight = window.innerHeight;
  let windowPos = window.scrollY;
  let feedHeight = catFeed.scrollHeight;
  // //TODO 5th post from bottom
  console.log(feedHeight, windowHeight + windowPos);

  if (windowHeight + windowPos >= feedHeight) {
    moreCats();
  }
});

document.onload = moreCats();
