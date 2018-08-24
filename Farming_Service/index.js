const farm = require('./main.js');

// Create a bew farm initializer object
var farmOptions = new Object();
farmOptions.source = process.env.SOURCE;
farmOptions.destination = process.env.FARM_HOME;
farmOptions.cache = process.env.FARM_CACHE;
farmOptions.activeCloneCount = process.env.ACTIVE_CLONES_NEEDED;
farmOptions.interval = process.env.FARM_REFRESH_INTERVAL; 

if("redis" == process.env.FARM_CACHE) {
    farmOptions.redisHost = process.env.REDIS_HOST;
    farmOptions.redisPort = process.env.REDIS_PORT;
}
// Invoke Farm
farm.boot(farmOptions);