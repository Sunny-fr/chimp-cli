
const request = require('request')

const timestamp = function() {
    const now = new Date()
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
}


/** TODO EXTRACT **/

const defaultRequest = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    rejectUnauthorized: false,
    method: 'get',
    url: '/'
}

function refetch(params = defaultRequest, parse = true, ) {

    return new Promise((resolve, reject) => {

        const options = Object.assign({}, params, params.body ? { body: JSON.stringify(params.body) } : {}, )

        request(options, (error, response, body = null) => {

            if (error) {
                console.log(timestamp(), 'error')
                //console.log(error);
                reject(error)
                return
            }

            if (!error) {

                if (!/^2/g.test(response.statusCode)) {
                    // console.log(typeof body !== 'undefined' ? body : response)
                    reject(response)
                    return
                }

                const seemsParsable = (response.headers['content-type'] || '').toLowerCase().includes('application/json')
                const body = parse && seemsParsable ? JSON.parse(response.body) : response.body

                resolve({
                    body,
                    headers: response.headers
                })
            }

        })

    })

}


module.exports = refetch