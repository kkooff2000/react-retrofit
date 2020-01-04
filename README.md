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

# Network Usage
```js
import { Get, Token, Auth, OnRefresh } from 'react-retrofit'
import axios from 'axios'
class API {

  // pass access_token to API refresh_token is optional
  /**
    * @param {string} auth url
    * @param {{...}} axios config
    */
  @AUTH('host/oauth')
  auth(data) {
    //transform data
    return {access_token:data.access_token, refresh_token:data.refresh_token}
  }

  //This will be called when status 401 occurred
  //Please return axios or promise with access_token refresh_token is optional
  @OnRefresh()
  refreshToken(refreshToken) {
    return axios({
      method: 'post',
      url: "http://xxx.xxx.com/oauth?grant_type=refresh_token&refresh_token="+refreshToken,
    }).then(result => { return { access_token: result.data.access_token } })
  }

  /**
    * @param {string} url
    * @param {{...}} config (axios config)
    */
  @Get('host/me')
  me(info) {
    //transform data
    console.log(info)
    return info
  }

  /**
    * @param {string} url
    * @param {{...}} config (axios config)
    */
  @Get('/photo')
  @Token //This will pass access_token to url automatically if @AUTH has been called
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

# FlatList Usage
```js
import { FlatList } from 'react-retrofit'
import React, {Text} from 'react'
class App extends React.Component {
    const itemView = ({name}) => <Text>{name}</Text>


    @FlatList("Main","host/endpoint",itemView)

    //api return like [{"name":"Harry"},{"name":"Billy"}]. Attributes will auto bind to itemView

    render() {
        <this.Main />
    }
}
```