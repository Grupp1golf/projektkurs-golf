// Globala variabler
var cityElem // Referens för select-tag för stad
var provinceElem // Referns för selec-tag för landskap
var provinceOptions // Arary som innehåller landskap från SMAPI
var searchBtn // Referens för en knapp i HTML.
var filter
var appendCards // Referens till en div i HTML där resultatkorten ska presenteras.
var sort // Referens för sroteringsselect.
var spinner // Innehåller spinner från html
var pics //Array med bildder
var logo

// funtion init
function init() {
  provinceElem = document.getElementById('province')
  cityElem = document.getElementById('city')
  searchBtn = document.getElementById('search')
  filter = document.getElementById('wrapper2')
  appendCards = document.getElementById('appendcards')
  sort = document.getElementById('sort')
  spinner = document.getElementById('spinnerouter')
  logo = document.getElementById('logo')
  pics = document.getElementsByClassName('pic')
  console.log('picss', pics)
  for (i = 0; i < pics.length; i++) {
    pics[i].addEventListener('click', testClick)
  }
  
  provinceElem.addEventListener('change', dynamicOptions)
  searchBtn.addEventListener('click', fetchInfo)
  sort.addEventListener('change', fetchInfo)
  logo.addEventListener('click', clearStorage)

  initOptions()
  initFilter()
  initPicArray()
  
   if(sessionStorage.getItem('result') != null) {
     fetchInfo()
  }
  
  
  
  /*pic1= document.getElementById ("pic1");
  pic1.addEventListener('click', pictureOne);
  
  pic2= document.getElementById ("pic2");
  pic2.addEventListener('click', pictureTwo);
  
  pic3= document.getElementById ("pic3");
  pic3.addEventListener('click', pictureThree);
  
  pic4= document.getElementById ("pic4");
  pic4.addEventListener('click', pictureFour);
  */
}

window.addEventListener('load', init)
function clearStorage() {
  sessionStorage.clear();

}
//Initierar en array med bilder som senare kommer visas i resutlat
function initPicArray() {
  pics = []
  fetch('pics.json')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log('initfilter', data)
      for(i=0; i<data.image.length; i++) {
        pics.push(data.image[i])
      }
     
    })
    .catch((error) => {
      console.error('Error:', error)
      console.log('det blev fel')
    })
    
    console.log(pics)
    
}

//Fetch för att hämta api och därfter lägga till select-taggar i option tagen i html. 
async function initOptions() {
  var cityOptions
  var opt
  var i
  provinceOptions = []
  cityOptions = []
  await fetch('https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=Golfbana')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      for (i = 0; i < data.payload.length; i++) {
        if (provinceOptions.indexOf(data.payload[i].province) == -1) {
          provinceOptions.push(data.payload[i].province)
        }

      }
      for (i = 0; i < provinceOptions.length; i++) {
        opt = document.createElement('option')
        opt.value = provinceOptions[i]
        opt.innerHTML = provinceOptions[i]
        provinceElem.appendChild(opt)
      }

      for (i = 0; i < data.payload.length; i++) {
        if (cityOptions.indexOf(data.payload[i].city) == -1) {
          cityOptions.push(data.payload[i].city)
        }
      }

      for (i = 0; i < cityOptions.length; i++) {
        opt = document.createElement('option')
        opt.value = cityOptions[i]
        opt.innerHTML = cityOptions[i]
        cityElem.appendChild(opt)
      }

    })
    .catch((error) => {
      console.error('Error:', error)
      console.log('det blev fel')
    })
    /*if(sessionStorage.getItem('result') != null) {
     provinceElem.value = sessionStorage.getItem('province')
     cityElem.value = sessionStorage.getItem('city')
     sort.value = sessionStorage.getItem('sort')
  }
*/
}
// Funnktion för att initiera fitlerinställningar
function initFilter() {
  var range
  fetch('https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=Golfbana')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log('initfilter', data)
    })
    .catch((error) => {
      console.error('Error:', error)
      console.log('det blev fel')
    })
}

//Funktion för att selecten ska dynamiskt ändras beroende på vad användaren väljer för landskap.
function dynamicOptions() {
  var province
  var cityOptions
  cityOptions = []
  province = 'provinces='
  switch (provinceElem.value) {
    case 'Småland':
      cityElem.innerHTML = ''
      province += provinceElem.value
      console.log('SMÅLAND.');
      break;
    case 'Öland':
      cityElem.innerHTML = ''
      province += provinceElem.value
      console.log('ÖLNAD.');
      break;
    case '':
      cityElem.innerHTML = ''
      province = ''
      break;

  }
  fetch(`https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=Golfbana&${province}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      for (i = 0; i < data.payload.length; i++) {
        if (provinceOptions.indexOf(data.payload[i].province) == -1) {
          provinceOptions.push(data.payload[i].province)
        }
        if (cityOptions.indexOf(data.payload[i].city) == -1) {
          cityOptions.push(data.payload[i].city)
        }
      }
      opt = document.createElement('option')
      opt.value = ''
      opt.innerHTML = 'Alla'
      cityElem.appendChild(opt)
      for (i = 0; i < cityOptions.length; i++) {
        opt = document.createElement('option')
        opt.value = cityOptions[i]
        opt.innerHTML = cityOptions[i]
        cityElem.appendChild(opt)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      console.log('det blev fel')
    })
}

function fetchWeatcher() {
  
}

//Kopplat till sökknappen och hämtar golfbanor från SMAPI beroende på användaren har valt.
function fetchInfo(e) {
 
  var province // Textsträng för lanskap
  var city // Textsträng för stad
  var url // Innehåller URL
  var div
  var htmlCode // Innehåller HTMLkod
  var cards
  var readMore
  var sortIn
  var sortBy
  appendCards.innerHTML = ''
  appendCards.appendChild(spinner)
  spinner.style.display = 'block'
  filter.style.display = 'flex'
  //filter.className = 'wrapper2show'
  province = '&provinces='
  city = '&cities='
  sortIn = '&sort_in='
  orderBy = '&order_by='

  switch (sort.value) {
    case 'highprice':
      sortIn += 'DESC'
      orderBy += 'price_range'
      break;
    case 'lowprice':
      sortIn += 'ASC'
      orderBy += 'price_range'
      break;
    case 'highrating':
      sortIn += 'DESC'
      orderBy += 'rating'
      break;
    
    case 'lowrating':
      sortIn += 'ASC'
      orderBy += 'rating'
      break;
    case '':
      sortIn = ''
      orderBy = ''
      break;

  }

  if (cityElem.value != '') {
    city += cityElem.value
    JSON.stringify(city)
    console.log(city)
  }
  if (provinceElem.value != '') {
    province += provinceElem.value
    JSON.stringify(province)
    console.log(province)
  }

  if (cityElem.value == '') {
    city = ''
    console.log(city)
  }
  if (provinceElem.value == '') {
    province = ''
    console.log(province)
  }
  //url = `https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=golfbana${province}${city}`
  
  if(e) {
  url = `https://cactuar.lnu.se/smapi/api/?api_key=NTTEzuqt&debug=true&controller=establishment&method=getall&descriptions=golfbana${province}${city}${orderBy}${sortIn}`
  } else {
    url = sessionStorage.getItem('result')
    
  }
  
  console.log('detta e url', url)
  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      spinner.style.display = 'none'
      console.log(data)
      console.log('array', pics)
      for (i = 0; i < data.payload.length; i++) {
        div = document.createElement('div')
        
        htmlCode = `<div class=cards>
        <img id= cardImg src=${pics[i].url}>
        <span>
         <h1>${data.payload[i].name}</h1>
        <h2>${data.payload[i].city}</h2><br>
       <h3>Greenfee: ${data.payload[i].price_range}:-</h3><br>
       <h3>${data.payload[i].rating - '0000'}/5  i gästbetyg</h3>
       <br>
        <div id="search2">
        <h4 class=readmore data-photoid=${pics[i].photoid} data-id=${data.payload[i].id}>VÄLJ</h4></div>
        </span>
        </div>
       `
         
        appendCards.innerHTML += htmlCode
      }
      readMore = document.getElementsByClassName('readmore')
      
      for(i = 0; i < readMore.length; i++) {
        readMore[i].style.cursor = 'pointer'
        readMore[i].addEventListener('click', testClick)
      }
      
      
    })
    .catch((error) => {
      console.error('Error:', error)
      console.log('det blev fel')
    })
 sessionStorage.setItem('result', url);   
 sessionStorage.setItem('province', provinceElem.value)
 sessionStorage.setItem('city', cityElem.value)
 sessionStorage.setItem('sort', sort.value)
}

function testClick () {
  console.log(this.id)
  localStorage.setItem("course", this.dataset.id)
  localStorage.setItem("photo", this.dataset.photoid)
  //window.open("golfcourse.html");
  location.assign("golfcourse.html"); 
}


/*function pictureOne (){
  localStorage.setItem("course", 67 );
  location.assign("golfcourse.html"); 
}

function pictureTwo (){
  localStorage.setItem("course", 58);
  location.assign("golfcourse.html"); 
}

function pictureThree (){
  localStorage.setItem("course", 57);
  location.assign("golfcourse.html"); 
}

function pictureFour (){
  localStorage.setItem("course", 61);
  location.assign("golfcourse.html"); 
}
*/