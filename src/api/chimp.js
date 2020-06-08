const refetch = require('../utils/refetch')
const api = require('./api-config')

const getToken = ({username, password}) => {
    //console.log('--- getting a new token')
    return refetch({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: api.login,
        method: 'post',
        body: {
            name:'chimp-cli',
            username,
            password,
        }
    }).then(result => {
        //console.log('--- successfully fetched a token ')
        return result.body.token
    }).catch(e => {
        //console.log('--- token issued ')
        //console.log(e)
        // console.log('error')
        // console.log(e.statusMessage)
        return Promise.reject(e.statusMessage)
    })
}

const revokeToken = ({token}) => {
    //console.log('--- revoking  token')
    return refetch({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token
        },
        url: api.logout
    }).then(result => {
        //console.log('--- successfully revoked token ')
        return result.body.token
    }).catch(e => {
        //console.log('--- revoking token issued ')
        // console.log('error')
        // console.log(e.statusMessage)
        return Promise.reject(e.statusMessage)
    })
}

const getRecipe = ({token, id}) => {
    console.log('--- getting previous version of the recipe')
    const url = api.recipeGet.replace('{id}', id)
    return refetch({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token
        },
        url,
    }).then(result => {
        console.log('--- successfully fetched a previous version of the recipe ')
        return result.body
    }).catch(e => {
        console.log('--- previous recipe version issued ')
        // console.log('error')
        // console.log(e.statusMessage)
        return Promise.reject(e.statusMessage)
    })
}
const updateRecipe = ({token, id, recipe}) => {
    console.log('--- updating version of the recipe')
    return refetch({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token
        },
        method: 'put',
        url: api.recipePut.replace('{id}', id),
        body: recipe
    }).then(result => {
        console.log('--- successfully updated a previous version of the recipe ')
        return result.body
    }).catch(e => {
        console.log(e)
        console.log('--- updated version previous recipe version issued ')
        // console.log('error')
        // console.log(e.statusMessage)
        return Promise.reject(e.statusMessage)
    })
}

module.exports = {
    getToken,
    revokeToken,
    getRecipe,
    updateRecipe
}