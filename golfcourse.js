// JavaScript Document

//Globala variabler
var id; //id för golfbanan i SMAPI
var greenfeeElement; //Element där greenfee läses in
var bookingBtn; //bokningsknapp som leder om till golfklubbens webbplats
var ratingElement; //betyget för golfbanan läses in här
var seniorDiscountElem; //element där seniorrabatt skrivs ut
var sDiscountElem; //element där studentrabatt skrivs ut
var addressElement; //element där adress skrivs ut
var telephoneElement; //element där telefonnummer skrivs ut
var descriptionElement; //element där beskrivning av golfbanan skrivs ut
var p; //tomt p-element där text skrivs ut om beskrivning ej finns
var childDiscountElem; ////element där barnrabatt skrivs ut
var cityElement; //element där stad skrivs ut
var zipElement; //element där postnummer skrivs ut
var courseNameElement; //Namnet på golbanan läses in
var imgViewer; //bildspelet
var tableBody; //där data skrivs ut i tabellen
var tableBody2; //där data skrivs ut i andra tabellen
var collapsible1; //collapsible-meny 1
var collapsible2; //collapsible-meny 2
var countNrClick1; //antal klick på restauranger i närheten av banan-knappen
var countNrClick2; //antal klick på boenden i närheten till golfbanan-knappen
var weatherElement; //där väder läses in från openwheathermap
var imgIx;//bildindex
var prev;//prev knapp i bildspel
var next;//next knapp i bildspel
var imgElem;
var imgUrls;
var clickCounter
var originalIx
var map;
var mapmsg; //element där avstånd mellan punkter på kartan skrivs ut i html
var userLat; //användarens latitud
var userLng; //användarens longitud
var myMap; 
var spinner; //loading spinner som visas medan resultat läses in i tabellerna
var backBtn; //knapp som leder tillbaka till resutlat
var courseCord


//Initiering av programmet
function init() {

  greenfeeElement = document.getElementById("greenfee");
  descriptionElement = document.getElementsByClassName("about");
  tableBody = document.getElementById("tableData");
  tableBody2 = document.getElementById("tableData2");
  spinner = document.getElementsByClassName('spinnerouter')


  bookingBtn = document.getElementById("booking");
  bookingBtn.addEventListener("click", goBooking);

  ratingElement = document.getElementById("rating");
  seniorDiscountElem = document.getElementById("seniorDiscount");
  sDiscountElem = document.getElementById("sDiscount");
  mailElement = document.getElementById("mail");
  addressElement = document.getElementById("address");
  telephoneElement = document.getElementById("telephone");
  p = document.getElementById("text");
  childDiscountElem = document.getElementById("childDiscount");
  cityElement = document.getElementById("city");
  zipElement = document.getElementById("zip");
  courseNameElement = document.getElementById("courseName");
  imgViewer = document.getElementsByClassName("imgViewer")
  collapsible1 = document.getElementById("collapsible1");
  collapsible2 = document.getElementById("collapsible2");
  weatherElement = document.getElementById("weather");
   backBtn = document.getElementById('back')

  id = localStorage.getItem("course");
  
  backBtn.addEventListener('click', backToSearch)
  collapsible1.addEventListener("click", requestDescriptionFood);
  collapsible2.addEventListener("click", requestDescriptionA);

  countNrClick1 = 0;
  countNrClick2 = 0;
  imgElem = document.getElementById("picture");


  fetchPhotos();

map = document.getElementById("map");
  next = document.getElementById("next");
  prev = document.getElementById("prev")
  next.addEventListener("click", nextImage);
  prev.addEventListener("click", prevImage);

  mapmsg = document.getElementById("mapmsg");
  // getLocation();
  requestDescription()

}//End init

window.addEventListener("load", init)
//--------------------------------//

//funktion som leder tillbaks till resutlatsidan
function backToSearch() {
  location.assign('index.html')
}

/*//funktion som hämtar användarens geografiska position
function getLocation() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(saveUserLocation);
  } else {
    mapmsg.innerHTML = "GeoLocation stödjs tyvärr inte av webbläsaren";
  }

}//getLocation

//funktion för att spara användarens position för senare användning
function saveUserLocation(position) {
  var userP
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
  
  userP = { lat: Number(userLat), lng: Number(userLng) };
  
  requestDescription(userP)
}//End saveUserLocation
*/
//Anropa data från smapi för information till infobox samt beskrivningen. 
 async function requestDescription(userP) {
   console.log('heyhs')
  await fetch(`https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=golfbana&ids=${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data)
      showDescription(data);
      showInfoBox(data);
      showCourseName(data);
      goBooking(data);
      fetchWeather(data);
      //initMap(data.payload[0], userP);
      courseCord = data.payload[0]
      initMap()
  })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });
navigator.geolocation.getCurrentPosition(success, error);
}//End requestDescription

function success(pos) {
  var userP
  var coord = pos.coords;
  // console.log('Your current position is:');
  // console.log(`Latitude : ${crd.latitude}`);
  // console.log(`Longitude: ${crd.longitude}`);
  // console.log(`More or less ${crd.accuracy} meters.`);
  userLat = coord.latitude;
  userLng = coord.longitude;
  userP = { lat: Number(userLat), lng: Number(userLng) };
  console.log('dddasdasdasdas', userP)
  initMap(userP)
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  console.log('ererrerero, tyvärr')
  
}


//Anropa data från smapi för information till restauranger i närheten. 
function requestDescriptionFood(course) {

  fetch(`https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=golfbana&ids=${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getFood(data);

    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });

  countNrClick1++;

}//End requestDescriptionFood

//Anropa data från smapi för information till boenden i närheten. 
function requestDescriptionA(course) {

  fetch(`https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=golfbana&ids=${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      accomodation(data);

    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });

  countNrClick2++;

}//requestDescriptionA

//Skriver ut beskriviningen av golfbanan i html. 
function showDescription(response) {
  var newTextNode;

  if (response.payload[0].text) {

    newTextNode = document.createTextNode(response.payload[0].text);
    p.appendChild(newTextNode);
  } else {
    p.innerHTML = "Besök golfbanans egen webbplats för mer information."
  }
}//End showDescription

//Skriver ut info i infoboxen i html. 
function showInfoBox(response) {
  var greenfee;
  var rating;
  var sDiscount;
  var seniorDiscount;
  var childDiscount;
  var address;
  var telephone;
  var city;
  var zip;

  if (response.payload[0].price_range) {
    greenfee = document.createTextNode(response.payload[0].price_range);
    greenfeeElement.appendChild(greenfee);
  }

  if (response.payload[0].rating) {
    rating = response.payload[0].rating;
    ratingElement.innerHTML = rating - "00000";
  }

  if (response.payload[0].student_discount) {
    sDiscount = document.createTextNode(response.payload[0].student_discount);
    sDiscountElem.appendChild(sDiscount);

  }

  if (response.payload[0].student_discount == "Y") {
    sDiscountElem.innerHTML = "Ja";
  } else {
    sDiscountElem.innerHTML = "Nej";
  }

  if (response.payload[0].senior_discount) {
    seniorDiscount = document.createTextNode(response.payload[0].senior_discount);
    seniorDiscountElem.appendChild(seniorDiscount);
  }

  if (response.payload[0].senior_discount == "Y") {
    seniorDiscountElem.innerHTML = "Ja";
  } else {
    seniorDiscountElem.innerHTML = "Nej";
  }

  if (response.payload[0].child_discount) {
    childDiscount = document.createTextNode(response.payload[0].child_discount);
    childDiscountElem.appendChild(childDiscount);
  }

  if (response.payload[0].child_discount == "Y") {
    childDiscountElem.innerHTML = "Ja";
  } else {
    childDiscountElem.innerHTML = "Nej";
  }

  if (response.payload[0].phone_number) {
    telephone = document.createTextNode(response.payload[0].phone_number);
    telephoneElement.appendChild(telephone);
  }

  if (response.payload[0].address) {
    address = document.createTextNode(response.payload[0].address);
    addressElement.appendChild(address);
  }

  if (response.payload[0].city) {
    city = document.createTextNode(response.payload[0].city);
    cityElement.appendChild(city);
  }

  if (response.payload[0].zip_code) {
    zip = document.createTextNode(response.payload[0].zip_code);
    zipElement.appendChild(zip);
  }
}//End showInfoBox

//Skriver ut banans namn i html
function showCourseName(response) {
  var name;

  name = document.createTextNode(response.payload[0].name);
  courseNameElement.appendChild(name);
}

//skapar länk och lägger in i bokningsknappen
function goBooking(response) {
  var a;
  var linkText;

  a = document.createElement('a');
  linkText = document.createTextNode("BOKA");
  a.appendChild(linkText);
  a.href = response.payload[0].website;
  bookingBtn.appendChild(a);
  a.setAttribute("target", "_blank");
}//End goBooking

//hämtar info om restauranger som ligger nära den specifika golfbanan (id)
function getFood(response) {
  var lat;
  var lng;
  
  if (countNrClick1 != 2) {
  spinner[0].style.display = 'block'
  }
  
  lat = response.payload[0].lat;
  lng = response.payload[0].lng;

  fetch(`https://cactuar.lnu.se/smapi/api/?api_key=ESskys4V&debug=true&controller=food&method=getfromlatlng&lat=&lat=${lat}&lng=${lng}&sort_in=DESC&order_by=distance_in_km&per_page=5`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      readFood(data);
      spinner[0].style.display = 'none'
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });
}//End getFood

//skapar tabell och skriver ut info om restauranger
function readFood(response) {
  var i;
  var htmlData = "";

  collapsible1.innerHTML = "Restauranger i närhet till golfbanan &#45;";
  htmlData += "<thead><tr><th>" + "Restauranger" + "</th>" + "<th>" + "Avstånd" + "</th></tr></thead>";

  for (i in response.payload) {
    htmlData += "<tr><td>" + response.payload[i].name + "</td><td>" + (response.payload[i].distance_in_km).toFixed(2) + " km" + "</td></tr>";
  }

  tableBody.innerHTML = htmlData;
  if (countNrClick1 == 2) {
    tableBody.innerHTML = " ";
    collapsible1.innerHTML = "Restauranger i närhet till golfbanan &#43;";
    countNrClick1 = 0;
    spinner[0].style.display = 'none'
  }

}//End readFood

//hämtar info om boenden som ligger nära den specifika golfbanan (id)
function accomodation(response) {
  var lat;
  var lng;
  var city;
  
  if (countNrClick2 != 2) {
  spinner[1].style.display = 'block'
  }
  
  lat = response.payload[0].lat;
  lng = response.payload[0].lng;

  fetch(`https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=accommodation&method=getfromlatlng&lat=${lat}&lng=${lng}&sort_in=DESC&order_by=distance_in_km&per_page=5`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      readA(data);
      spinner[1].style.display = 'none'
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });

}//End accomodation

//skapar tabell och skriver ut info om boenden
function readA(response) {
  var i;
  var htmlData = "";

  collapsible2.innerHTML = "Boenden i närhet till golfbanan &#45;";
  htmlData += "<thead><tr><th>" + "Boenden" + "</th>" + "<th>" + "Beskrivning" + "</th>" + "<th>" + "Avstånd" + "</tr></thead>";


  for (i in response.payload) {
    htmlData += "<tr><td>" + response.payload[i].name + "</td><td>" + response.payload[i].description + "</td><td>" + (response.payload[i].distance_in_km).toFixed(2) + " km" + "</td></tr>";
  }

  tableBody2.innerHTML = htmlData;

  if (countNrClick2 == 2) {
    tableBody2.innerHTML = " ";
    collapsible2.innerHTML = "Boenden i närhet till golfbanan &#43;";
    countNrClick2 = 0;
  }

}//readA

//hämtar bilder från json-fil
function fetchPhotos() {

  fetch(`pics.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showPhotos(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
    });

}//End fetchPhotos

 
function showPhotos(response) {
  var i;
  var urls;
  
  
  
  console.log('detta e rspons', response)
  urls = response.image;
  imgUrls = [];
  imgIx = localStorage.getItem("photo");
  for (i = 0; i < urls.length; i++) {
    imgUrls.push(urls[i].url);
  }
  
  console.log(imgUrls, 'HEJSAN')

 // imgIx = 5;
  
  originalIx = imgIx
  clickCounter = 0
  
  showImage();


}//End showPhotos

function showImage() {
  console.log('detta e testar', originalIx)
 imgElem.src = `${imgUrls[imgIx]}`;
   console.log('ÖÖÖÖÖÖ', imgViewer)
  

}//end showImage

//Visa föregående bild i bildspelet
function prevImage() {
  
  if(clickCounter > 0) {
    clickCounter -= 1
    imgIx -= 1
  }
  
  showImage();

}//end prevImage

//Visa nästa bild i bildspelet
function nextImage() {
    console.log(clickCounter, 'testinghello')
  if (clickCounter < 4) {
    clickCounter ++
    imgIx++
  } else {
    imgIx = originalIx
    clickCounter = 0
  }
  

  showImage();
  
}//end nextImage

//Hämta väder i staden där golfbanan är belägen 
function fetchWeather(response) {
  var city; //stad
  var country; //land
  var apiKey; //api-nyckel
  var unit; //
  var htmlCode //text som sedan sparas i weatherelement 

  city = response.payload[0].city;
  country = `Sweden`;
  apiKey = `55f970a5b61819d7f237eb1cb2be6bfd`;
  unit = `metric`;


  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${apiKey}&units=${unit}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data)
      showWeather(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log('det blev fel')
      htmlCode = '<h4> Hittar ingen väderprognos </h4>' 
      weatherElement.innerHTML += htmlCode;
    });


}//End fetchWeather


//visa vädret i boxen avsett att visa väderprognosen
function showWeather(response) {
  var dateList = []; 
  var list = response.list;
  var i;
  var j;
  var htmlCode; 
  var weekDays //veckodagar
  
  weekDays = {
    0: 'Söndag',
    1: 'Måndag',
    2: 'Tisdag',
    3: 'Onsdag',
    4: 'Torsdag',
    5: 'Fredag',
    6: 'Lördag',
  }
 

  for (i = 0; i < list.length; i++) {
    if (list[i].dt_txt.includes('12:00:00')) {
      dateList.push(list[i]);
    }
  }

  for (j = 0; j < dateList.length; j++) {
    var date = new Date(dateList[j].dt_txt);
    var weekday = date.getDay();
  
    htmlCode = `
    <span>
    <h4>${weekDays[weekday]} ${dateList[0].dt_txt}</h4>
    <img src= http://openweathermap.org/img/w/${dateList[j].weather[0].icon}.png><p>${Math.round(dateList[j].main.temp)}&#730</p>
    <hr>
    </span>
    <br>
    `
    weatherElement.innerHTML += htmlCode;
  }

}//End showWheather

//skapa karta och och markörer för användarens position och golfbanans position.
//Skapar också en linje som dras mellan de två markörerna
//Räknar ut och skriver ut avståndet mellan punkterna på sidan 
 function initMap(userP) {
  var marker;
  var lat;
  var lng;
  var name;
    
  lat = Number(courseCord.lat);
  lng = Number(courseCord.lng);
  // name = response.payload[0].name;
  
  const courseP = { lat: lat, lng: lng };
  

  myMap = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: lat,
      lng: lng
    },
    zoom: 9,
    styles: [
      {
        featureType: "poi", stylers: [{ visibility: "off" }]
      },
      {
        feutureType: "transit.station", stylers: [{ visibility: "off" }]
      }
    ]
  });


  
  var marker2 = new google.maps.Marker({
    position:courseP,
    map:myMap,
  });
  
  if (userP) {
   var marker = new google.maps.Marker({
    position: userP,
    map: myMap,
  });
  
  //En rak linje dras mellan de två markörerna 
  var line = new google.maps.Polyline({path: [courseP, userP], map: myMap
  });
  
const R = 6371000; //Meter
const rad1 = userP.lat * Math.PI/180;
const rad2 = courseP.lat * Math.PI/180;
const delLat = (courseP.lat - userP.lat) * Math.PI/180;
const delLon = (courseP.lng - userP.lng) * Math.PI/180;
const a = Math.sin(delLat/2) * Math.sin(delLat/2) + Math.cos(rad1) * Math.cos(rad2) * Math.sin(delLon/2)  * Math.sin(delLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const km = ((R * c)/1000).toFixed(2);



mapmsg.innerHTML= "Det är cirka " + km + " km till golbanan från din position";
  }

}//End initMap
