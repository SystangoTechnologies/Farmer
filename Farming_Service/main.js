'use strict';
const farmService = require('./farmService.js');
/* 
 Base function to call the module by passing options as a param.
*/
function boot(options){
    let interval = 10;           // 10 second interval
    let activeCloneCount = 10;   // default max active clone count
    let source = "seed";         // default source is src
    let destination = "dest";    // default destination is dest
    let cache = "memory";        // default cache should be in-memory
    let redisHost = "localhost"; // default redis host
    let redisPort = 6379;        // default redis port
    
    if (options) {
        if (options.interval) {
            interval = options.interval;
        }
        if (options.activeCloneCount) {
            activeCloneCount = options.activeCloneCount;
        }
        if (options.source) {
            source = options.source;
        }
        if (options.destination) {
            destination = options.destination;
        }
        if (options.cache) {
            cache = options.cache;
        }
        if (options.redisHost) {
            redisHost = options.redisHost;
        }
        if (options.redisPort) {
            redisPort = options.redisPort;
        }
    }

    let farmServiceOptions = {};
    farmServiceOptions.interval = interval;
    farmServiceOptions.activeCloneCount = activeCloneCount;
    farmServiceOptions.source = source;
    farmServiceOptions.destination = destination;
    farmServiceOptions.cache = cache;
    if("redis" == cache){
        farmServiceOptions.redisHost = redisHost;
        farmServiceOptions.redisPort = redisPort;
    }
    
    farmService.initFarm(farmServiceOptions);
}

/* 
 Get the next available entity from the farm.
*/
function getNext() {
    return farmService.getNext();
}

module.exports.boot = boot;
module.exports.getNext = getNext;