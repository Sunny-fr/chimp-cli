(function (window) {
    window.__chimp__ = window.__chimp__ || {loaded: false}
    console.log(window.location.href, window.__chimp__)
    if( window.__chimp__.loaded) return
    const createScriptElement = (source) => {
        const script = document.createElement('script')
        script.textContent = source;
        (document.head || document.documentElement).appendChild(script)
        return Promise.resolve()
    }
    const getScriptContent = (src) => {
        return fetch(src).then(r => r.text())
    }
    const fetchAndInjectScript = (src) => {
        return getScriptContent(src)
            .then(content => createScriptElement(content))
    }
    window.__chimp__.loaded = true
    fetchAndInjectScript('---SERVER---/socket-io/client')
        .then(() => {
            console.log(' *** CHIMP - SOCKET IO - INJECTED *** ')
            return true
        })
        .then(() => fetchAndInjectScript('---SERVER---/chimp-watcher.js'))
        .then(() => {
            console.log(' *** CHIMP - BRIDGE - INJECTED *** ')
            return true
        })
        .catch(e => {
            console.log(' *** CHIMP ERROR *** ')
            console.error(e)
        })
})(window)