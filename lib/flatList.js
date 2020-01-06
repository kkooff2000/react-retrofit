import axios from 'axios'
import { FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Get } from './retrofit'

/**
    * @param {React.Component} component
    * @param {string} url
    * @param {React.Component} listItem
    * @param {{axiosConfig: object, flatConfig: object, indicator: React.Component}} config
    */
   export const List = (componentName, url, ListItem, config) =>
   (target, name, descriptor) => {
       const config = config || { axiosConfig: {}, flatConfig: {} }
       class API {
           @Get(url, config.axiosConfig)
           fetchData(data) {
               return data
           }
       }
       const component = () => {
           const [res, setRes] = React.useState([])
           const [count, setCount] = React.useState(0)
           const api = new API()
           React.useEffect(() => {
               api.fetchData().then(data => {
                   setRes(data)
               })
           },[count])

           return (
               res.length > 0 ?
                   <FlatList
                       {...config.flatConfig}
                       keyExtractor={(item, index) => index.toString()}
                       data={res}
                       renderItem={({ item }) => {
                           return (<ListItem {...item} />)
                       }}
                   /> :
                   config.indicator !== undefined ? config.indicator :
                       <ActivityIndicator size="large" color="#CCC" />
           )
       }
       target[componentName] = component
   }