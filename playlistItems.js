require('dotenv').config()

var fs = require('fs')
var readline = require('readline')
var {
  google
} = require('googleapis')
var OAuth2 = google.auth.OAuth2

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/'
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json'


// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err)
    return
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content), getPlaylistItems)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret
  var clientId = credentials.installed.client_id
  var redirectUrl = credentials.installed.redirect_uris[0]
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      callback(oauth2Client)
    }
  })
}


let itemCounter = 0
let playlistItems = []

function getPlaylistItems(auth, nextPageToken = '') {
  const service = google.youtube('v3')

  service.playlistItems.list({
    auth: auth,
    part: 'snippet,contentDetails',
    playlistId: process.env.PLAYLIST_ID,
    maxResults: 50,
    pageToken: nextPageToken
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }

    response.data.items.forEach(i => {
      playlistItems.push(i)
    })

    itemCounter += response.data.items.length
    console.log(itemCounter)

    if (itemCounter < response.data.pageInfo.totalResults) {
      console.log(response.data.nextPageToken)
      getPlaylistItems(auth, response.data.nextPageToken)
    } else {
      fs.writeFile('exports/playlistItems.json', JSON.stringify(playlistItems), err => {
        if (err) {
          console.log(err)
        }
      })
    }
  })
}