const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')
const OAuth2 = google.auth.OAuth2

const express = require('express')
const app = express()
const PORT = 2001
app.use(express.json())

const cors = require('cors')
const {retail} = require("googleapis/build/src/apis/retail")
app.use(cors())


const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
const TOKEN_DIR = './.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs.json'

let credentials, clientSecret, clientId, redirectUrl, oauth2Client

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    credentials = JSON.parse(content)
    clientSecret = credentials.installed.client_secret
    clientId = credentials.installed.client_id
    redirectUrl = credentials.installed.redirect_uris[0]
    oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
})


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize() {
    // Check if we have previously stored a token.
    try {
        const data = fs.readFileSync(TOKEN_PATH)
        oauth2Client.credentials = JSON.parse(data)
        return true
    } catch (er) {
        return false
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })
    console.log('Authorize this app by visiting this url: ', authUrl)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close()
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err)
                return
            }
            oauth2Client.credentials = token
            storeToken(token)
            callback(oauth2Client)
        })
    })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err
        console.log('Token stored to ' + TOKEN_PATH)
    })
}

function getPlaylists(auth, res) {
    const service = google.youtube('v3')

    service.playlists.list({
        auth: auth,
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 50
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err)
            res.status(400).send('The API returned an error: ' + err)
            return
        }

        res.status(200).send(response.data.items)

        fs.writeFile('exports/playlists.json', JSON.stringify(response.data.items), err => {
            if (err) {
                console.log(err)
            }
        })
    })
}


let itemCounter = 0
let playlistItems = []

function getPlaylistItems(playlistId, auth, res, nextPageToken = '') {
    const service = google.youtube('v3')

    service.playlistItems.list({
        auth: auth,
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err)
            res.status(400).send('The API returned an error: ' + err)
            return
        }

        response.data.items.forEach(i => {
            playlistItems.push(i)
        })

        itemCounter += response.data.items.length
        console.log(itemCounter)

        if (itemCounter < response.data.pageInfo.totalResults) {
            console.log(response.data.nextPageToken)
            getPlaylistItems(playlistId, auth, res, response.data.nextPageToken)
        } else {
            fs.writeFile('exports/' + playlistId + '.json', JSON.stringify(playlistItems), err => {
                itemCounter = 0
                playlistItems = []

                if (err) {
                    console.log(err)
                    res.status(400).send('Could not write to file!')
                } else {
                    res.status(200).send('Loaded Playlist items successfully.')
                }
            })
        }
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}


app.listen(PORT)

app.get('/authenticated', (req, res) => {
    res.status(200).send(authorize())
})

app.get('/authUrl', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })

    res.status(200).send(authUrl)
})

app.get('/logout', (req, res) => {
    oauth2Client.credentials = null
    fs.unlink('.credentials/youtube-nodejs.json', (err) => {
        if (err) {
            res.status(400).send('Logout failed.')
        } else {
            res.status(200).send('Logout successfully.')
        }
    })
})

app.post('/saveCode', (req, res) => {
    const {code} = req.body

    oauth2Client.getToken(code, (err, token) => {
        oauth2Client.credentials = token
        storeToken(token)
        res.status(200).send('Authentication code saved.')
    })
})

app.get('/playlists', async (req, res) => {
    if (authorize()) {
        fs.readFile('exports/playlists.json', 'utf8', (err, data) => {
            if (err) {
                getPlaylists(oauth2Client, res)
                return console.log(err)
            } else {
                res.status(200).send(JSON.parse(data))
            }
        })
    } else {
        res.status(400).send('Please authenticate!!')
    }
})

app.get('/reloadPlaylists', async (req, res) => {
    if (authorize()) {
        getPlaylists(oauth2Client, res)
    } else {
        res.status(400).send('Please authenticate!!')
    }
})

app.get('/playlistLoaded/:id', (req, res) => {
    const {id} = req.params

    if (authorize()) {
        fs.readFile('exports/' + id + '.json', 'utf8', (err, data) => {
            if (err) {
                res.status(200).send(false)
            } else {
                res.status(200).send(true)
            }
        })
    } else {
        res.status(400).send('Please authenticate!!')
    }
})

app.get('/loadPlaylist/:id', (req, res) => {
    const {id} = req.params

    if (authorize()) {
        getPlaylistItems(id, oauth2Client, res)
    } else {
        res.status(400).send('Please authenticate!!')
    }
})

app.get('/randomVideo/:id', (req, res) => {
    const {id} = req.params

    if (authorize()) {
        fs.readFile('exports/' + id + '.json', 'utf8', (err, data) => {
            if (err) {
                res.status(400).send('Could not read Playlist!')
                return console.log(err)
            } else {
                const playlist = JSON.parse(data)
                const playlistLength = playlist.length
                const randomVideoIndex = getRandomInt(playlistLength)
                const randomVideo = playlist[randomVideoIndex]
                // console.log('[' + (randomVideoIndex + 1) + '/' + playlistLength + '] "' + randomVideo.snippet.title + '"')
                // console.log(' ╰─ https://youtu.be/' + randomVideo.contentDetails.videoId)
                res.status(200).send(randomVideo.contentDetails.videoId)
            }
        })
    } else {
        res.status(400).send('Please authenticate!!')
    }
})