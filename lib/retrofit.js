import axios, { AxiosRequestConfig } from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

const KEY_ACCESS_TOKEN = "KEY_ACCESS_TOKEN"
const KEY_REFRESH_TOKEN = "KEY_REFRESH_TOKEN"

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Get = (url, config) => { return axiosDecorator('get', url, config) }

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Post = (url, config) => { return axiosDecorator('post', url, config) }

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Put = (url, config) => { return axiosDecorator('put', url, config) }

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Update = (url, config) => { return axiosDecorator('update', url, config) }

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Delete = (url, config) => { return axiosDecorator('delete', url, config) }

/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/
export const Auth = (url, config) => (target, name, descriptor) => {
    let oldVal = descriptor.value
    descriptor.value = function (...args) {
        target.auth_url = url
        axios({
            method: 'post',
            url: url,
            ...config
        }).then(result => {
            let { access_token, refresh_token } = oldVal.call(this, result.data)
            AsyncStorage.setItem(KEY_ACCESS_TOKEN, access_token)
            AsyncStorage.setItem(KEY_REFRESH_TOKEN, refresh_token)
        })
    }
}

export const OnRefreshToken = () => (target, name, descriptor) => {
    let oldVal = descriptor.value
    target.haveRefresh = true
    target.onRefreshToken = descriptor.value
}

export const Token = (target, name, descriptor) => {
    descriptor.useToken = true
}

const axiosDecorator = (method, url, config) => (target, name, descriptor) => {
    let oldVal = descriptor.value
    let oldUrl = url
    descriptor.value = function (...args) {
        return _url(url, descriptor.useToken === true)
            .then(url => {
                const apiCall = (url) => axios({
                    method: method,
                    url: url,
                    ...config
                }).then(result => {
                    return oldVal.call(this, result.data)
                })
                return apiCall(url).catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                        if (error.response.status === 401 && target.onRefreshToken !== undefined) {
                            const result = refreshTokenAndRetry(target.onRefreshToken, apiCall, oldUrl)
                            return result
                        }
                    }
                })
            })
    }
}

const refreshTokenAndRetry = (onRefreshToken, apiCall, url) => {
    return refreshToken().then(refreshToken => {
        return onRefreshToken(refreshToken)
    }).then(({ access_token, refresh_token }) => {
        AsyncStorage.setItem(KEY_REFRESH_TOKEN, refresh_token)
        return AsyncStorage.setItem(KEY_ACCESS_TOKEN, access_token)
    }).then(() => {
        return _url(url, true)
    }).then(url => {
        return apiCall(url)
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