//Misc Again
(() => {

    const SERVER = '---SERVER---'
    const paths = {
        style: `${SERVER}/css`,
        script: `${SERVER}/js`
    }

    // const createScriptElement = (source) => {
    //     const script = document.createElement('script')
    //     script.textContent = source;
    //     (document.head || document.documentElement).appendChild(script)
    //     return Promise.resolve()
    // }
    //
    const getScriptContent = (src) => {
        return fetch(src).then(r => r.text())
    }
    //
    // const fetchAndInjectScript = (src) => {
    //     return getScriptContent(src)
    //         .then(content => createScriptElement(content))
    // }

    const clean = ({id = 'chimp-helper-script'}) => {
        const {body} = window.document
        body.querySelectorAll('#' + id)
            .forEach(prev => {
                prev.parentElement.removeChild(prev)
            })
    }

    const handleScript = () => {
        const id = 'chimp-helper-script'
        clean({id})
        const {document} = window
        const {body} = window.document
        const root = document.createElement('script')
        root.id = id
        getScriptContent(paths.script)
            .then(content => {
                root.textContent = `(() => {
        //CHIMP START
        
        ${content}
        
        //CHIMP END
        })()`
                body.appendChild(root)
            })
            .catch(e => {
                console.log(e)
            })

    }

    const handleStyle = () => {
        const id = 'chimp-helper-style'
        clean({id})
        const {document} = window
        const {body} = window.document
        const root = document.createElement('style')
        root.rel = 'stylesheet'
        root.id = id
        getScriptContent(paths.style)
            .then(content => {
                root.textContent = `
        /* CHIMP START */
        
        ${content}
        
        /* CHIMP END */
        `
                body.appendChild(root)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const worker = () => {
        handleScript()
        handleStyle()
    }


    const start = () => {
        const {io} = window
        const server_url = 'http://localhost:3310/'
        const socket = io.connect(server_url)
        socket.on('reload', function (message) {
            console.log(' *** CHIMP - RELOADING  *** ')
            worker()
        })
        worker()
    }

    start()

})()
