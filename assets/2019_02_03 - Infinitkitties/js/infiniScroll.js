catFeed.addEventListener("scroll", function() {
  var feedTop = catFeed.scrollTop;
  var feedWindow = catFeed.clientHeight;
  var feedHeight = catFeed.scrollHeight;
  // //TODO 5th post from bottom

  if (feedTop + feedWindow >= feedHeight) {
    moreCats();
  }
});
