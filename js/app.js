/***********************************
Imports
***********************************/
require('../scss/app.scss')

/***********************************
App Settings
***********************************/
let options = {
  app:  '#app',
  data: './json/albums.json'
}

let state = {
  albums:         []
}

/***********************************
Model - Fetch
***********************************/
fetch ('./json/albums.json')
.then(response => response.json())
.then(data => console.log(data))

/***********************************
Controller - Events
***********************************/

/***********************************
Views - Render
***********************************/
function render (state, element) {
  element.innerHTML = ``
}

let app = document.querySelector(options.app)
render(state, app)
