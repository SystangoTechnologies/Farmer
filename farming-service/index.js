'use strict';
const farmService = require('./farmService.js');

/* 
 Base function to call the module by passing options as a param.
*/
function init(){
    let options = new Object();
    options.interval = process.env.FARM_REFRESH_INTERVAL || 10;         // default 10 second interval
    options.activeCloneCount = process.env.ACTIVE_CLONES_NEEDED || 10;  // default max active clone count
    options.seed = "seed";                                              // default source directory
    options.destination = "dest";                                       // default destination directory
    options.cache = process.env.FARM_CACHE || "memory";                 // default cache : in-memory
    if("redis" == options.cache){
        options.redisHost = process.env.REDIS_HOST || "127.0.0.1";      // default redis host
        options.redisPort = process.env.REDIS_PORT || 6379;             // default redis port
    }
    farmService.initFarm(options);
}

/* 
 Get the next available entity from the farm.
*/
function getNext() {
    return farmService.getNext();
}

init();

module.exports.init = init;
module.exports.getNext = getNext;