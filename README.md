# Metrics-Consumer

## TODO

* [X] Test the insertion of InfluxDB
* [X] Test the endpoints of RESTful API server works
* [X] Add new endpoint of RESTful API server. '/apiv0.1/states' 測試是否有memory leak
* [X] Test the function of notifier of Locust.
* [X] Write Dockerfile && Deploy it.

docker run --link=influxdb:influxdb  -e NODE_ENV=test --name=metrics -p 4000:3000 -d wen777/consumer-metrics:latest
