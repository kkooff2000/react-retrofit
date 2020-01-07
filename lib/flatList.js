import axios, { AxiosRequestConfig } from 'axios'
import { FlatList, ActivityIndicator, FlatListProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Get } from './retrofit'

/**
    * @param {React.Component} component
    * @param {string} url
    * @param {React.Component} listItem
    * @param {RetrofitConfig} config
    */
export const List = (componentName, url, ListItem, config) => {
    const _config = { axiosConfig: {}, ...config }
    class API {
        @Get(url, _config.axiosConfig)
        fetchData(data) {
            return data
        }
    }
    const api = new API()
    return _List(api.fetchData, undefined, componentName, ListItem, config)
}

/**
    * @param {React.Component} component
    * @param {function name(data) {}} fetchAPI
    * @param {function name(data) {}} fetchNextAPI
    * @param {React.Component} listItem
    * @param {RetrofitConfig} config
    */
export const ListWithAPI = (componentName, fetchAPI, fetchNextAPI, ListItem, config) => {
    return _List(fetchAPI, fetchNextAPI, componentName, ListItem, config)
}

const _List = (fetchAPI, fetchNextAPI, componentName, ListItem, config) => (target, name, descriptor) => {
    const _config = { axiosConfig: {}, flatListProps: {}, ...config }
    const component = () => {
        const [res, setRes] = React.useState([])
        const [refreshing, setRefresh] = React.useState(false)
        React.useEffect(() => {
            fetchAPI().then(setRes)
        }, [0])

        return (
            res !== undefined && res.length > 0 ?
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefresh(true)
                        fetchAPI().then(data => {
                            setRefresh(false)
                            setRes(data)
                        })
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    data={res}
                    renderItem={({ item }) => {
                        return (<ListItem {...item} />)
                    }}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        if (fetchNextAPI !== undefined) {
                            setRefresh(true)
                            fetchNextAPI().then(data => {
                                setRefresh(false)
                                setRes(res.concat(data))
                            })
                        }
                    }}
                    {..._config.flatListProps}
                /> :
                _config.indicator !== undefined ? _config.indicator :
                    <ActivityIndicator size="large" color="#CCC" />
        )
    }
    target[componentName] = component
}


/**
 * @typedef {Object} RetrofitConfig
 * @property {AxiosRequestConfig} axiosConfig
 * @property {FlatListProps} flatListProps
 * @property {React.Component} indicator
 */