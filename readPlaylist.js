const fs = require('fs')

let playlist

fs.readFile('exports/playlistItems_01_Musik.json', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  } else {
    playlist = JSON.parse(data)
    const playlistLength = playlist.length
    const randomVideoIndex = getRandomInt(playlistLength)
    const randomVideo = playlist[randomVideoIndex]
    console.log('[' + (randomVideoIndex + 1) + '/' + playlistLength + '] "' + randomVideo.snippet.title + '"')
    // console.log(randomVideo.contentDetails.videoId)
    console.log(' ╰─ https://youtu.be/' + randomVideo.contentDetails.videoId)
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}