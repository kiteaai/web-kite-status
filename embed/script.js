import { getKiteStatus } from '../js/kite-status.js'

const params = new URLSearchParams(window.location.search)
const path =  window.location.pathname.split('/').filter(s => s)

const options = {
    "src": params.get('src'),
    "type": path[path.length-1],
    "name": params.get('name'),
    "link": params.get('link')
}

getKiteStatus(options)
    .then(status => {

        const template = Handlebars.compile(document.getElementById('template').innerHTML)

        if (status) {

            document.body.innerHTML = template(status) 
            
            // setTimeout(function() {
            //     if ('parentIFrame' in window) { window.parentIFrame.sendMessage('loaded') }
            // }, 1000)
            
        } else {

            if ('parentIFrame' in window ) { window.parentIFrame.close() }

        }

    })

