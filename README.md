# react-retrofit
A Retrofit like axios implementation for react native

# Setup babel.config.js
```js
{
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose" : true }]
    ]
}
```

# Usage
```js
import { GET, TOKEN, AUTH, HOST, ON_REFRESH_TOKEN } from 'react-retrofit'
import axios from 'axios'
class API {
  //Set HOST
  @HOST("http://xxx.xxx.com")

  // pass access_token to API refresh_token is optional
  /**
    * @param {string} auth endpoint
    * @param {{...}} axios config
    */
  @AUTH('/oauth')
  auth(data) {
    //transform data
    return {access_token:data.access_token, refresh_token:data.refresh_token}
  }

  //This will be called when status 401 occurred
  //Please return axios or promise with access_token refresh_token is optional
  @ON_REFRESH_TOKEN()
  refreshToken(refreshToken) {
    return axios({
      method: 'post',
      url: "http://xxx.xxx.com/oauth?grant_type=refresh_token&refresh_token="+refreshToken,
    }).then(result => { return { access_token: result.data.access_token } })
  }

  /**
    * @param {string} endpoint
    * @param {{...}} config (axios config)
    */
  @GET('/me')
  me(info) {
    //transform data
    console.log(info)
    return info
  }

  /**
    * @param {string} endpoint
    * @param {{...}} config (axios config)
    */
  @GET('/photo')
  @TOKEN //This will pass access_token to url automatically if @AUTH has been called
  photo(photo) {
    //transform data
    console.log(photo)
    return photo
  }
}

const api = new API()
api.auth()

api.me().then(info => {
    //data you transform
    console.log(info)
})

api.photo().then(photo => {
    //data you transform
    console.log(photo)
})
```