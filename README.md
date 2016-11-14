# Metrics-Consumer

A RESTful api server which is the bridge between customized Locust and influxDB.
Although influxDB has REST interface, I deside to add this server infront of influxdb out of the consideration of security. This server only provides fews APIs(Insert). It is not allowed to expose the port of influxdb on the internet.

## TODO

* [X] Test the insertion of InfluxDB
* [X] Test the endpoints of RESTful API server works
* [X] Add new endpoint of RESTful API server. '/apiv0.1/states' 測試是否有memory leak
* [X] Test the function of notifier of Locust.
* [X] Write Dockerfile && Deploy it.

docker run --link=influxdb:influxdb  -e NODE_ENV=test --name=metrics -p 4000:3000 -d wen777/consumer-metrics:latest

## APIs

* register: register the event of load testing.
```
POST /apiv0.1/events/register

payload:
{
    startedAt: "Date", // Date, string
        host: "",
        measurement: {
        fields: {
            clients: 0, // number of concurrent clients, number
            hatchRate: 0.1, // The rate per second in which clients are spawned. number
            requests: 0 // The number of requests     
        },
        tags: {
            targetHost: "", // "http:10.10.10.1", Host to load test, string
            mode: "" // "single", "cluster", string
                                        
        }        
    }
}

response
{
    uuid: "xkjpw-ajta-jwt", // {random-id}, string
}

```
* commit: create the record of the result of load testing.
```
POST /apiv0.1/events/commit

{
    startedAt: "Date", // The time of the end of load testing.
        uuid: "xxx-ggg-zzz", // {random-id}, string
        host: "", // host, string
        measurement: {
            fields: {
                requestStats: {JSON OBJECT} // result of load testing 
            },
            tags: {
                hostname: "", // "http:10.10.10.1", Host to load test, string
                mode: "" // "single", "cluster", string
        }
    }
}
```

* isrunning: list all the running backgroud job.
```
GET /apiv0.1/events/isrunning

response
{"{job_id}": True}

```
