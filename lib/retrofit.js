import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

const KEY_ACCESS_TOKEN = "KEY_ACCESS_TOKEN"
const KEY_REFRESH_TOKEN = "KEY_REFRESH_TOKEN"

export const GET = (url, config) => axiosDecorator('get', url, config)
export const POST = (url, config) => axiosDecorator('post', url, config)
export const PUT = (url, config) => axiosDecorator('put', url, config)
export const UPDATE = (url, config) => axiosDecorator('update', url, config)
export const DELETE = (url, config) => axiosDecorator('delete', url, config)

export const AUTH = (url, config) => (target, name, descriptor) => {
    let oldVal = descriptor.value
    descriptor.value = function (...args) {
        target.auth_url = target.host + url
        axios({
            method: 'post',
            url: (target.host + url),
            ...config
        }).then(result => {
            let { access_token, refresh_token } = oldVal.call(this, result.data)
            AsyncStorage.setItem(KEY_ACCESS_TOKEN, access_token)
            AsyncStorage.setItem(KEY_REFRESH_TOKEN, refresh_token)
        })
    }
}

export const ON_REFRESH_TOKEN = () => (target, name, descriptor) => {
    let oldVal = descriptor.value
    target.haveRefresh = true
    target.onRefreshToken = descriptor.value
}

export const TOKEN = (target, name, descriptor) => {
    descriptor.useToken = true
}

export const HOST = (host) => (target, name, descriptor) => {
    target.host = host
}

const axiosDecorator = (method, url, config) => (target, name, descriptor) => {
    let oldVal = descriptor.value
    let oldUrl = url
    descriptor.value = function (...args) {
        _url(url, descriptor.useToken === true)
            .then(url => {
                const apiCall = (url) => axios({
                    method: method,
                    url: target.host + url,
                    ...config
                }).then(result => {
                    oldVal.call(this, result.data)
                    args[0].call(this, result.data)
                })
                return apiCall(url).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                        if (error.response.status === 401 && target.onRefreshToken !== undefined) {
                            refreshTokenAndRetry(target.onRefreshToken, apiCall, oldUrl)
                        }
                    }
                })
            })
    }
}

const refreshTokenAndRetry = (onRefreshToken, apiCall, url) => {
    refreshToken().then(refreshToken => {
        onRefreshToken(refreshToken).then(access_token => {
            AsyncStorage.setItem(KEY_ACCESS_TOKEN, access_token).then(() => {
                _url(url, true).then(url => {
                    apiCall(url)
                })
            })
        })
    })
}

const refreshToken = () => {
    return AsyncStorage.getItem(KEY_REFRESH_TOKEN)
}

const _url = (url, attach) => {
    if (attach) {
        return AsyncStorage.getItem(KEY_ACCESS_TOKEN).then(token => url.includes('?') ?
            url + '&access_token=' + token : url + '?access_token=' + token)
    } else {
        return new Promise((resolve) => resolve(url))
    }
}