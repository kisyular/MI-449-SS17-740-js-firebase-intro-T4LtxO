// TODO Sign into the database anonymously
var config = {
  apiKey: "AIzaSyDe6hHs8F4Hwbeazp0j2XC6lOVGCCF-i14",
  authDomain: "joke-a-tron-9000-63b3f.firebaseapp.com",
  databaseURL: "https://joke-a-tron-9000-63b3f.firebaseio.com",
  projectId: "joke-a-tron-9000-63b3f",
  storageBucket: "joke-a-tron-9000-63b3f.appspot.com",
  messagingSenderId: "663319062387"
};
firebase.initializeApp(config)
firebase.auth().signInAnonymously()

var createTime = Date.now()
// CREATE a new woof in Firebase
function createWoofInDatabase (woof) {
  // TODO create a new record in Firebase
  woof = woofText.value
  firebase.database().ref("woof").push({
    created_at: createTime,
    text: woof
  })
}

// READ from Firebase when woofs are added, changed, or removed
// Write a function for each 'on' method and call addWoofRow,
// updateWoofRow, and deleteWoofRow to update the page. Make
// sure to pass the right parameters (hint: these functions are
// defined in woofer-ui.js).
function readWoofsInDatabase () {
  // TODO read new, changed, and deleted Firebase records
  firebase.database().ref('woof').on('child_added', function( snapshotWoof) {
    addWoofRow(snapshotWoof.key, snapshotWoof.val())
  })
  firebase.database().ref('woof').on('child_changed', function( snapshotWoof) {
    updateWoofRow(snapshotWoof.key, snapshotWoof.val())
  })
  firebase.database().ref('woof').on('child_removed', function( snapshotWoof) {
    deleteWoofRow(snapshotWoof.key)
    deleteWoof()
  })
}

// UPDATE the woof in Firebase
function updateWoofInDatabase (woofKey, woofText) {
  // TODO update the record in Firebase
  firebase.database().ref('woof').child(woofKey).set({
    text:woofText
  })
}

// DELETE the woof from Firebase
function deleteWoofFromDatabase (woofKey) {
  // TODO delete the record from Firebase
  firebase.database().ref('woof').child(woofKey).remove()
  deleteWoof()
}

// Load all of the data
readWoofsInDatabase()
