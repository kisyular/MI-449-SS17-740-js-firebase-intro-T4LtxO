//
//
//            !!!!!!!! WARNING !!!!!!!!
//
// This file has all the functions you need to update the
// page, but you don't need to make any changes to this
// file to complete the project. Do so at your own risk!
//
//

var woofText = document.getElementById('woof-text')
var woofs = document.getElementById('woofs')
var woofCreate = document.getElementById('woof-button')

// Adds a new row to the list of woofs
function addWoofRow (woofKey, woof) {
  var template = document.getElementById('woof-template')
  var clone = document.importNode(template.content, true)

  clone.querySelector('.row').id = woofKey
  clone.querySelector('.created-at').textContent = moment(woof.created_at).calendar()
  clone.querySelector('.text').textContent = woof.text
  clone.querySelector('.btn-edit').addEventListener('click', showWoofTextbox)
  clone.querySelector('.btn-delete').addEventListener('click', deleteWoof)
  clone.querySelector('input').addEventListener('keyup', editWoof)

  woofs.insertBefore(clone, woofs.firstChild)
  woofText.value = ''
}

// Get woof text from input and pass it to addWoof
function createWoof () {
  var text = woofText.value || ''
  if (!text.trim().length) return
  createWoofInDatabase({
    created_at: new Date().getTime(),
    text: text
  })
}

// Make the textbox to edit a woof appear
function showWoofTextbox () {
  var row = this.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement
  var text = row.querySelector('.text')

  textbox.value = row.querySelector('.text').textContent
  text.className = text.className.replace('show', 'hidden')
  form.className = form.className.replace('hidden', 'show')
  textbox.focus()
  textbox.select()
}

// If Enter was pressed, update woof in database,
// If Escape was pressed, hide the textbox
function editWoof (event) {
  var row = this.parentElement.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement
  var text = row.querySelector('.text')

  if (event.keyCode === 13) {
    // Enter key pressed
    updateWoofInDatabase(row.id, textbox.value)
  } else if (event.keyCode === 27) {
    // Escape key pressed
    form.className = form.className.replace('show', 'hidden')
    text.className = text.className.replace('hidden', 'show')
  }
}

// Update the woof text in a row on the page
function updateWoofRow (woofKey, woof) {
  var row = document.getElementById(woofKey)
  var form = row.querySelector('input').parentElement
  var text = row.querySelector('.text')
  form.className = form.className.replace('show', 'hidden')
  row.querySelector('.text').textContent = woof.text
  text.className = text.className.replace('hidden', 'show')
}

// Remove a woof row from the page
function deleteWoofRow (woofKey) {
  var row = document.getElementById(woofKey)
  row.parentElement.removeChild(row)
}

// Remove the clicked woof from the database
function deleteWoof () {
  var row = this.parentElement.parentElement
  deleteWoofFromDatabase(row.id)
}

// Event listeners to add a new woof
woofCreate.addEventListener('click', createWoof)
woofText.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) createWoof()
})

// TODO Sign into the database anonymously
var config = {
  apiKey: 'AIzaSyDe6hHs8F4Hwbeazp0j2XC6lOVGCCF-i14',
  authDomain: 'joke-a-tron-9000-63b3f.firebaseapp.com',
  databaseURL: 'https://joke-a-tron-9000-63b3f.firebaseio.com',
  projectId: 'joke-a-tron-9000-63b3f',
  storageBucket: 'joke-a-tron-9000-63b3f.appspot.com',
  messagingSenderId: '663319062387'
}

firebase.initializeApp(config)
firebase.auth().signInAnonymously()

// CREATE a new woof in Firebase
function createWoofInDatabase (woof) {
  // TODO create a new record in Firebase
  // woof = woofText.value
  firebase.database().ref('woof').push(woof)
}

// READ from Firebase when woofs are added, changed, or removed
// Write a function for each 'on' method and call addWoofRow,
// updateWoofRow, and deleteWoofRow to update the page. Make
// sure to pass the right parameters (hint: these functions are
// defined in woofer-ui.js).
function readWoofsInDatabase () {
  // TODO read new, changed, and deleted Firebase records
  firebase.database().ref('woof').on('child_added', function (snapshotWoof) {
    addWoofRow(snapshotWoof.key, snapshotWoof.val())
  })
  firebase.database().ref('woof').on('child_changed', function (snapshotWoof) {
    updateWoofRow(snapshotWoof.key, snapshotWoof.val())
  })
  firebase.database().ref('woof').on('child_removed', function (snapshotWoof) {
    deleteWoofRow(snapshotWoof.key)
  })
}

// UPDATE the woof in Firebase
function updateWoofInDatabase (woofKey, woofText) {
  // TODO update the record in Firebase
  firebase.database().ref('woof/' + woofKey + '/text').set(
    woofText
  )
}

// DELETE the woof from Firebase
function deleteWoofFromDatabase (woofKey) {
  // TODO delete the record from Firebase
  firebase.database().ref('woof').child(woofKey).remove()
}

// Load all of the data
readWoofsInDatabase()
