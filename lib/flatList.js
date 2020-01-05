import axios from 'axios'
import { FlatList as List, ActivityIndicator, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Get } from './retrofit'

/**
    * @param {React.Component} component
    * @param {string} url
    * @param {React.Component} listItem
    * @param {{axiosConfig: object, flatConfig: object, indicator: React.Component}} config
    */
export const FlatList = (componentName, url, listItem, config) =>
    (target, name, descriptor) => {
        const config = config || { axiosConfig: {}, flatConfig: {} }
        class API {
            @Get(url, config.axiosConfig)
            fetchData(data) {
                return data
            }
        }
        const component = () => {
            const [res, setRes] = useState([])
            const api = new API()
            useEffect(() => {
                api.fetchData().then(data => {
                    setRes(data)
                })
            })

            return (
                res.length > 0 ?
                    <List
                        {...config.flatConfig}
                        keyExtractor={(item, index) => index.toString()}
                        data={res}
                        renderItem={({ item }) => {
                            return (<listItem {...item} />)
                        }}
                    /> :
                    config.indicator !== undefined ? config.indicator :
                        <ActivityIndicator size="large" color="#CCC" />
            )
        }
        const t = () => {
            return (<Text style={{ fontSize: 20, color: 'black' }}>Hello</Text>)
        }
        target[componentName] = component
    }