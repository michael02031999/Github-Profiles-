let searchQueryURL = "https://api.github.com/";

let searchbar = document.getElementById("searchbar");
let container = document.getElementById("container");
let logo = document.getElementById("logo");
let name = document.getElementById("name");
let bio = document.getElementById("bio");
let FFR = document.getElementById("FFR");
let followers = document.getElementById("followers");
let following = document.getElementById("following");
let repos = document.getElementById("repos");
let namesOfRepos = document.getElementById("namesOfRepos");

let container4Error = document.getElementById("container4Error");

searchbar.addEventListener("paste", whatsInTheSearchbar);
searchbar.addEventListener("keydown", whatsInTheSearchbar);

let phrase = "";

/* async function pasteFunction(e) {
  console.log(e);

  console.log(e.key);

  githubSearch(searchQueryURL);
} */

let isMeta = false;

async function whatsInTheSearchbar(e) {
  console.log(e);

  if (e.key == "Meta") {
    isMeta = true;
  }

  console.log(isMeta);

  if (e.key == "Backspace") {
    phrase = phrase.substring(0, phrase.length - 1);
  }
  if (
    e.key != "Tab" &&
    e.key != "Backspace" &&
    e.key != "Enter" &&
    String.fromCharCode(e.keyCode).match(/(\w|\s)/g) &&
    isMeta == false
  ) {
    phrase = phrase.concat(e.key);

    console.log("did it fire");
    console.log(isMeta);
  }
  if (e.key == "Enter") {
    if (phrase == "") {
      let text = await navigator.clipboard.readText();

      console.log(phrase);

      searchQueryURL = searchQueryURL.concat("users/" + text);

      // searchQueryURL = searchQueryURL.concat("users/" + phrase);

      searchbar.value = "";

      githubSearch(searchQueryURL);

      searchQueryURL = "https://api.github.com/";

      phrase = "";
    } else {
      searchQueryURL = searchQueryURL.concat("users/" + phrase);
      githubSearch(searchQueryURL);
      phrase = "";
      searchQueryURL = "https://api.github.com/";
    }
  }

  if (e.key == "v") {
    isMeta = false;
  }

  console.log(phrase);
}

async function githubSearch() {
  let allDivs = namesOfRepos.querySelectorAll("div");

  let trueResponse = await fetch(searchQueryURL)
    .then((result) => result.json())
    .then((response) => response);

  if (trueResponse.message == "Not Found") {
    container.style.display = "none";
    searchbar.style.top = "37.5%";
    container4Error.style.display = "block";
    container4Error.style.textAlign = "center";
    container4Error.style.fontSize = "32px";
    container4Error.style.paddingTop = "50px";
    container4Error.style.paddingBottom = "50px";
    container4Error.style.paddingLeft = "10px";
    container4Error.style.paddingRight = "10px";
    container4Error.style.marginTop = "30px";
    container4Error.innerHTML = "No profile with this username";
    container4Error.style.width = "65%";
    container4Error.style.color = "white";
  } else {
    container4Error.style.display = "none";

    let allRepos = await fetch(
      trueResponse["repos_url"].concat("?sort=updated")
    )
      .then((result) => result.json())
      .then((response) => response);

    //console.log(allRepos[0]["name"]);

    for (let i = 0; i < 5; i++) {
      if (allRepos[i] == undefined) {
        break;
      }
      let div = document.createElement("div");
      div.style.backgroundColor = "rgb(33, 43, 114)";
      div.style.padding = "4px";
      div.style.paddingLeft = "6px";
      div.style.paddingRight = "6px";
      div.style.whiteSpace = "nowrap";
      div.innerHTML = allRepos[i]["name"];
      namesOfRepos.appendChild(div);

      if (allDivs[i] != undefined) {
        allDivs[i].remove();
      }
    }

    logo.style.display = "block";
    container.style.display = "grid";
    searchbar.style.top = "29%";

    logo.src = trueResponse["avatar_url"];

    if (trueResponse["name"] == null) {
      name.innerHTML = "null";
    } else {
      name.innerHTML = trueResponse["name"];
    }
    if (trueResponse["bio"] == null) {
      bio.innerHTML = "null";
    } else {
      bio.innerHTML = trueResponse["bio"];
    }

    followers.innerHTML = trueResponse["followers"] + " Followers ";
    following.innerHTML = trueResponse["following"] + " Following ";
    repos.innerHTML = trueResponse["public_repos"] + " Repos";
  }
}
