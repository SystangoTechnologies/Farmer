![Farmer](https://github.com/SystangoTechnologies/Farmer/blob/master/static/logo.jpg)

## Farmer
Farming service that duplicates a given source according to configurable rules in-memory or via redis cache.

## Description
This service aims at providing an easy solution to clone given file/directory based on rules such as in-memory vs redis based cache and the number of active clones needed at any point of time. The configurations allows the user of this repo to configure the following important rules -

* FARM_REFRESH_INTERVAL : Number of seconds to revisit the farm to check and populate the deficit of clones
* ACTIVE_CLONES_NEEDED  : Number of active clones needed (Minimum count) 
* FARM_CACHE            : Could be either of _redis_ or _memory_
* REDIS_HOST            : Address of Redis host
* REDIS_PORT            : Redis port 

Based on the values set for above configurations, the _Farmer_ is going to keep revisiting the farm every *farm_refresh_interval* to keep at least *active_clones_needed* in *farm_cache*.  

## Technology
- **Node.js**     - Main framework
- **Redis**       - Caching framework
- **Docker**      - Containerisation framework

## Running the server locally
This service can be used in standalone mode (without docker) using the index.js file in the farming-service directory. When its run locally, you can set two additional parameters -

* SEED        : Points to a location other than the local "seed" directory that you wish to clone
* DESTINATION : Points to a destination other than local "dest" directory to clone the seed file into

These parameters don't have a lot of meaning when running inside docker, as over there we prefer to use volumes to mount these directories in so that we can get the results outside of container on host machines.

## Docker
This service can be easily started using the following single command -

````
docker-compose up
````

## Contributors
[Arpit Khandelwal](https://www.linkedin.com/in/arpitkhandelwal1984/)

## License
This project is licensed under the terms of the MIT license.
