
# Kite System Status
JSON storage for the [Kite Status Widget](https://github.com/kiteaai/web-kite-status) application that displays on the following ATS websites.

 - [https://ksassessments.org](https://ksassessments.org)
 - [https://dynamiclearningmaps.org](https://dynamiclearningmaps.org)

There are 2 files included:

 - ```dev.json```  - used only on   [https://kiteaai.github.io/web-kite-status/](https://kiteaai.github.io/web-kite-status/) for debugging.
 - ```prod.json```  - used everywhere else.

# How To Update ✏️
Users that have been added to the [Web Team](https://github.com/orgs/kiteaai/teams/web-team) in the [Kite AAI GitHub organization](https://github.com/orgs/kiteaai) have access to make updates/push commits in this repo.

## Status Updates

To update the status of an application, change the **status** value for that application to an integer value that is defined in the **states** object at the bottom of the JSON document.
```json
{
  "name": "Student Portal",
  "status": 0, <------------ Change this value.
  "message": { },
  "outages": [ ]
}
```
For reference, the **states** object:
```json
"states": {
	"0": {"name": "No Issues", ... },
	"1": {"name": "Issue Resolved", ... },
	"2": {"name": "Possible Delays", ... },
	"3": {"name": "Outage", ... }
}
```
## Message Updates
The message object for an application contains the **date** and **contents** of the message to be displayed in the status widget in the event that the status is set to **any state other than 0**. 

By default the contents of the message is rendered from a template string associated with each state, which can be found at the bottom of the JSON document. Therefor, the **contents** value should remain blank unless a custom message is desired.

Keep in mind that the **date** should always be updated to the desired day and time instance that the status is set to any state other than 0. The date must be in a strict ***YYYY/MM/DD, hh:mm AM/PM*** format.

```json
{
  "name": "Student Portal",
  "status": 2,
  "message": {                      
    "date": "2023/03/21, 12:00 PM",    <--------------------
    "contents": ""                  
  },
  "outages": [ ]
}
```

## Adding an Outage

To report a new outage for an application, create a new outage object at the end of the **outages** array for the application (do **not** override an existing item). Below is an example of what an application with multiple outages would look like.

```json
{
  "name": "Student Portal",
  "status": 2,
  "message": { },
  "outages": [
    {
    "date": "2023/02/14",
    "downtime": 50
    },       <---------------- don't forget to add a comma between objects.
    {
    "date": "2023/03/21",
    "downtime": 14
    }  
  ]
}
```
