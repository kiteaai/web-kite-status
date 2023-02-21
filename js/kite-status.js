export function getKiteStatus(request) {

    const url = `https://raw.githubusercontent.com/kiteaai/web-kite-status-json/main/${request.src}.json`

    const status = fetchStatus(url).then(json => {
        
        if (json.ok) { 
            
            switch(request.type) {
                case 'app': return parseApp(json.data, request.name)
                case 'alert': return parseAlert(json.data, request.link) 
                default: return parseError({"appName": request.name, "name":  "Error", "error": "Unable to parse JSON as resquested."}) 
            }
 
        }

        return parseError({
            "appName": request.name,
            "name":  "Unknown",
            "error": json.data
        }) 
        
    })
    
    return status
    
}

function fetchStatus(url) {

    let json = 
        fetch(url, {cache: "no-cache"})
            .then((response) => {
                if(!response.ok) {
                    throw new Error('HTTP Bad Status ' + response.status)
                }
                return response.json()
            })
            .then((data) => {
                return {ok: true, data: data}
            })
            .catch((error) => {
                console.log('\x1b[31m%s\x1b[0m', '[kite-status] Fetch Failed')
                console.log('\x1b[31m%s\x1b[0m', '[kite-status] Tried to GET: ' + URL)
                console.error(error)
                return {parsed: false, data: error}
            })
    
    return json
    
}

function parseApp(status, appName) {

    const states = status.states

    let app = status.applications.find(app => {return app.name === appName})
    
    if (!app) { 
        return parseError({
            "name":  "Error",
            "error": `Application "${appName}" does not exist.`,
        })
    }

    const now = new Date()
    const nowFormatted = now.toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"})

    //  Create a new Date from startDay (year doesn't matter we just need the month and the day in a date object).
    const start = new Date("2000/" + status.startDay)

    //  Calculate the current school year based on today's date and the start date.
    start.setFullYear(
        (now.getUTCMonth() >= start.getUTCMonth()) && (now.getUTCDate() >= start.getUTCDate()) ? 
            now.getFullYear() : now.getFullYear()-1)

    const uptime = getUptime(app.outages, now, start)       

    app.uptime = {
        "schoolYear": start.getFullYear() + " - " + ((start.getFullYear() + 1).toString().substr(-2)),
        "int": (uptime.includes('.') ? uptime.split('.')[0] :uptime+"%"),
        "dec": (uptime.includes('.') ? '.'+uptime.split('.')[1]+'%' : ''),
        "graphOffset": (100 - ((parseInt(uptime)/100) * 100)),
        "display": (app.status > 1) ? "hidden" : ""
    }

    app.message = {
        "date": new Date(app.message.date).toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"}),
        "contents": (app.message.contents === "" && app.status > 0 ? 
            states[app.status].message.replace("{application}", app.name) :
            app.message.contents
        ),
        "display": (app.status === 0) ? "hidden" : ""
    }

    app.status = {
        "state": app.status,
        "name": states[app.status].name,
        "icon": states[app.status].icon,
        "lastUpdated": nowFormatted
    }
    
    app.error = {
        "display": 'hidden'
    }

    return app

}

function parseAlert(status, link) {
    
    let alerts = []

    const states = status.states

    status.applications.forEach(app => {
        if (app.status > 1) {
            alerts.push({
                "name": `${app.name}`,
                "status":  `${states[app.status].name}`,
            })
        }
    })

    return (alerts.length > 0 ? {
        "alerts": alerts,
        "link": link ? link : '/'
    } : null)

}

function parseError(error) {

    let now = new Date().toLocaleString("en-US", { month: "long", day: "numeric", hour:"numeric", minute: "numeric"})       

    return {
        "name": error.appName,
        "uptime": {
            "display": 'hidden'
        },
        "status": {
            "state": "error",
            "name": error.name,
            "icon": '\uF506',
            "lastUpdated": now
        },
        "message": {
            "date": now,
            "contents": '',
        },
        "error": {
            "contents": error.error
        }        
    }    
    
}

//  Calculate the percentage of time that application has been up.
function getUptime(outages, now, start) {
    
    //  How long the application has been running.
	var runtime = (now - start)/ 3600000
    
    //  Aggregate total outage time.
	var downtime = outages.reduce(function(total, outage){
		return total + outage.downtime
	}, 0)/60
    
    //  How long the application has been down.
	downtime = ((runtime-downtime)/runtime)*100
    
    //  Return percantage of time the appliction has been up (trim to 2 decimal places without rounding).
	return (Math.floor(downtime * 100) / 100).toFixed(2).replace(/[.,]00$/, "")
    
}