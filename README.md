<h1 align="center">YT-Playlist-Random-Player</h1>
<h3 align="center">Play your personal YouTube Playlists randomly</h3>

## Project Setup
### Google Cloud App
Create project on https://console.cloud.google.com/projectcreate

Enable YouTube V3 API (https://console.cloud.google.com/apis/library/youtube.googleapis.com)

Create OAuth consent screen (https://console.cloud.google.com/apis/credentials/consent)
- Add your YouTube Email-Address as a Test user

On the credentials page create an OAuth Client ID (https://console.cloud.google.com/apis/credentials/oauthclient)
- Application type: Desktop app
- Download the JSON file
- Rename to ```client_secret.json```
- Move to folder ```server```



### Client (Frontend)
```
cd client
npm install
npm run dev
```

### Server (API)
```
cd server
npm install
npm run start
```

When authenticating on the client page, you will be redirected to a Google authentication page with a link similar to ```http://localhost/?code=```**```4/0AdQtgggdffsfsy0liCROqDdsfdsfsdfsdfsfqTSgsdfsfsdfqSUBhsfsdfK1FQ```**```&scope=https://www.googleapis.com/auth/youtube.readonly```