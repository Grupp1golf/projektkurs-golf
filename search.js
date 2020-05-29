// Globala variabler
var cityElem; // Referens för select-tag för stad
var provinceElem; // Referns för selec-tag för landskap
var provinceOptions; // Arary som innehåller landskap från SMAPI
var searchBtn; // Referens för en knapp i HTML.
var resultWrapper; // Referens för wrapper2 i HTML som innehåller sortering och resultat
var appendCards; // Referens till en div i HTML där resultatkorten ska presenteras.
var sort; // Referens för sroteringsselect.
var spinner; // Innehåller spinner från html
var pics; //Array med bildder
var logo; // Referns till loggan
var scrollBtn; // Referens till pilen
var userP; // Användarens position
var geoFeedback; // Feedback för att sätta på platsinformation

// Denna funktionen anropas när webbsidan har laddats in.
function init() {
  provinceElem = document.getElementById("province");
  cityElem = document.getElementById("city");
  searchBtn = document.getElementById("search");
  resultWrapper = document.getElementById("wrapper2");
  appendCards = document.getElementById("appendcards");
  sort = document.getElementById("sort");
  spinner = document.getElementById("spinnerouter");
  logo = document.getElementById("logo");
  pics = document.getElementsByClassName("pic");
  scrollBtn = document.getElementById("scrollBtn");
  geoFeedback = document.getElementById("geofeedback");

  for (i = 0; i < pics.length; i++) {
    pics[i].addEventListener("click", nextPage);
  }

  provinceElem.addEventListener("change", dynamicOptions);
  searchBtn.addEventListener("click", fetchInfo);
  sort.addEventListener("change", fetchInfo);
  logo.addEventListener("click", clearStorage);

  initOptions();
  initPicArray();

  if (sessionStorage.getItem("result") != null) {
    fetchInfo();
  }

  navigator.geolocation.getCurrentPosition(success);
}

window.addEventListener("load", init);

// Denna funktion anropas när användaren trycker på ikonen
// Funktionen rensar sessionStorage, vilket innehåller användarens sökningar
function clearStorage() {
  sessionStorage.clear();
}

// Denna funktionen Initierar en array med bilder som senare kommer visas i resutlat
function initPicArray() {
  pics = []; // En array som kommer innehålla bilder som sneare visas i resultatet
  fetch("pics.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (i = 0; i < data.image.length; i++) {
        pics.push(data.image[i]);
      }
    })
}

// Denna funktion hämtar data från SMAPI
// Därfter lägger den till select-taggar i option tagen i html.
async function initOptions() {
  var cityOptions; // En array som sparar alla städer från
  var opt; // Används för att skapa en option-tag
  var i; //Iterationsvariabel
  provinceOptions = [];
  cityOptions = [];
  await fetch(
    "https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=Golfbana"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (i = 0; i < data.payload.length; i++) {
        if (provinceOptions.indexOf(data.payload[i].province) == -1) {
          provinceOptions.push(data.payload[i].province);
        }
      }
      for (i = 0; i < provinceOptions.length; i++) {
        opt = document.createElement("option");
        opt.value = provinceOptions[i];
        opt.innerHTML = provinceOptions[i];
        provinceElem.appendChild(opt);
      }

      for (i = 0; i < data.payload.length; i++) {
        if (cityOptions.indexOf(data.payload[i].city) == -1) {
          cityOptions.push(data.payload[i].city);
        }
      }

      for (i = 0; i < cityOptions.length; i++) {
        opt = document.createElement("option");
        opt.value = cityOptions[i];
        opt.innerHTML = cityOptions[i];
        cityElem.appendChild(opt);
      }
    })
    
  if (
    sessionStorage.getItem("province") != null &&
    sessionStorage.getItem("city") != null
  ) {
    provinceElem.value = sessionStorage.getItem("province");
    sort.value = sessionStorage.getItem("sort");
    dynamicOptions();
    cityElem.value = sessionStorage.getItem("city");
  }
}

// Denna funktionen gör att select-tagen för stad dynamiskt ändras
// --> beroende på vad användaren väljer för landskap.
async function dynamicOptions() {
  var province; //Innehåller det valda landskapet, används senare för anropet av SMAPI
  var cityOptions; //Innehåller städer, baserat på val av landskap
  cityOptions = [];
  province = "provinces=";

  if (provinceElem.value != "") {
    cityElem.innerHTML = "";
    province += provinceElem.value;
  } else {
    cityElem.innerHTML = "";
    province = "";
  }
  await fetch(
    `https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=Golfbana&${province}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (i = 0; i < data.payload.length; i++) {
        if (provinceOptions.indexOf(data.payload[i].province) == -1) {
          provinceOptions.push(data.payload[i].province);
        }
        if (cityOptions.indexOf(data.payload[i].city) == -1) {
          cityOptions.push(data.payload[i].city);
        }
      }
      cityOptions.sort();
      opt = document.createElement("option");
      opt.value = "";
      opt.innerHTML = "Alla";
      cityElem.appendChild(opt);
      for (i = 0; i < cityOptions.length; i++) {
        opt = document.createElement("option");
        opt.value = cityOptions[i];
        opt.innerHTML = cityOptions[i];
        cityElem.appendChild(opt);
      }
    })
    
  if (
    sessionStorage.getItem("province") != null &&
    sessionStorage.getItem("city") != null
  ) {
    cityElem.value = sessionStorage.getItem("city");
    sessionStorage.removeItem("city");
    sessionStorage.removeItem("province");
  }
}

// Denna funktionen anropas av sökknappen och hämtar golfbanor från SMAPI
// --> beroende på användaren har valt.
function fetchInfo(e) {
  //Dessa variabler används i samband med SMAPI
  var province; // Textsträng för lanskap
  var city; // Textsträng för stad
  var url; // Innehåller URL för SMAPI anropet och är dynamsik.
  var readMore; // Innehåller knappar från resutlatkorten
  var sortIn; // Innehåller ett argument för SMAPI anrop som sorterar datan med ASC eller DESC
  var orderBy; // Innehåller ett argument för SMAPI anrop som sorterar en specific datapunkt
  var method; // Innehåller en metod för att hämta data från SMAPI
  var lat; // Innehåller ett arguemnt för lat från användarens position, används i SMAPI
  var lng; // Innehåller ett argument för lng från anvndarens position, används i SMAPI
  var radius; // Innehåller ett argument för radie, abvänds i SMAPI
  var distance; // Innehåller ett argument för att få distans i km från användarens position, används I SMAPI

  var htmlCode; // Innehåller HTMLkod

  lat = "";
  lng = "";
  radius = "";

  method = "method=getall";
  appendCards.innerHTML = "";
  appendCards.appendChild(spinner);
  spinner.style.display = "block";
  resultWrapper.style.display = "flex";
  scrollBtn.style.display = "block";
  geofeedback.style.display = "none";

  province = "&provinces=";
  city = "&cities=";
  sortIn = "&sort_in=";
  orderBy = "&order_by=";

  switch (sort.value) {
    case "highprice":
      sortIn += "DESC";
      orderBy += "price_range";
      break;
    case "lowprice":
      sortIn += "ASC";
      orderBy += "price_range";
      break;
    case "highrating":
      sortIn += "DESC";
      orderBy += "rating";
      break;
    case "lowrating":
      sortIn += "ASC";
      orderBy += "rating";
      break;
    case "closedistance":
      if (userP) {
        lat += `lat=${userP.lat}&`;
        lng += `lng=${userP.lng}&`;
        orderBy += "distance_in_km";
        sortIn += "DESC";
        method = "method=getfromlatlng";
        radius = "&radius=1000km";
        geofeedback.style.display = "none";
      } else {
        geofeedback.style.display = "block";
      }

      break;
    case "":
      sortIn = "";
      orderBy = "";
      break;
  }


  if (cityElem.value != "") {
    city += cityElem.value;
    JSON.stringify(city);
  }
  if (provinceElem.value != "") {
    province += provinceElem.value;
    JSON.stringify(province);
  }

  if (cityElem.value == "") {
    city = "";
  }
  if (provinceElem.value == "") {
    province = "";
  }

  if (e) {
    url = `https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&${method}&${lat}${lng}descriptions=golfbana${province}${city}${orderBy}${sortIn}${radius}`;
  } else {
    url = sessionStorage.getItem("result");
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      spinner.style.display = "none";
      for (i = 0; i < data.payload.length; i++) {
        div = document.createElement("div");

        if (data.payload[i].distance_in_km) {
          distance = `<h3> ${Math.ceil(
            data.payload[i].distance_in_km
          )} km från din position</h3>`;
        } else {
          distance = "";
        }

        htmlCode = `
          <div class="cards">
            <img id="cardImg" src="${pics[i].url}" alt="${data.payload[i].name}" />
          <span>
            <h1>${data.payload[i].name}</h1>
            <h2>${data.payload[i].city}</h2>
            <br />
            ${distance}
            <br />
            <h3>Greenfee: ${data.payload[i].price_range}:-</h3>
            <br />
            <h3>${data.payload[i].rating - '0000'}/5 i gästbetyg</h3>
            <br />
            <div id="readmoreouter">
              <h4
                class="readmore"
                data-photoid="${pics[i].photoid}"
                data-id="${data.payload[i].id}"
              >
                LÄS MER
              </h4>
            </div>
          </span>
        </div>
       `;

        appendCards.innerHTML += htmlCode;
      }
      readMore = document.getElementsByClassName("readmore");

      for (i = 0; i < readMore.length; i++) {
        readMore[i].style.cursor = "pointer";
        readMore[i].addEventListener("click", nextPage);
      }
    })
    
  sessionStorage.setItem("result", url);
}
function success(pos) {
  var coord = pos.coords;
  userLat = coord.latitude;
  userLng = coord.longitude;
  userP = { lat: Number(userLat), lng: Number(userLng) };
}

// Denna funktionen tar användaren till nästa sida
// --> och sparar information i storage.
function nextPage() {
  localStorage.setItem("course", this.dataset.id);
  localStorage.setItem("photo", this.dataset.photoid);

  sessionStorage.setItem("province", provinceElem.value);
  sessionStorage.setItem("city", cityElem.value);
  sessionStorage.setItem("sort", sort.value);

  location.assign("golfcourse.html");
}
