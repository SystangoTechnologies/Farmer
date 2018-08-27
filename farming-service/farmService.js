'use strict';
const path = require('path');
const fse = require('fs-extra');
const redis = require('redis');

var redisClient; //Initialize when necessary
var farm = []; // global in-memory farm to host the directories
var refreshInProgress = false;

/*
 * InitFarm method
 */
function initFarm(options) {
    try {
        // Log to the console 
        console.log("========== Farming Started ==========");
        console.log("Caching mechanism : " + options.cache);
        console.log("Source : " + options.seed); 
        console.log("Destination Farm : " + options.destination);
        console.log("Farm will refresh every : " + options.interval + " seconds");

        if("redis" == options.cache){
            console.log("Redis Host : " + options.redisHost );
            console.log("Redis Port : " + options.redisPort );
            redisClient = redis.createClient(options.redisPort, options.redisHost);
        }
        console.log("=====================================");
        // Schedule the copy at given interval
        let interval = options.interval * 1000; // convert seconds to milliseconds
        setInterval(()=>{refreshFarm(options);}, interval);        
    } catch (err) {
        console.error(err);
    }
}

/*
 * Method to return next available entity in the farm
 */
function getNext() {
    return new Promise(function(resolve, reject) {
        if(redisClient){ // cache = Redis
            redisClient.spop("farm", function(err, result) {
                if(err || !result) {
                    reject("Farm is empty at the moment.");
                }
                resolve(result);
            });
        } else{
            if(farm.length > 0) { // cache = In Memory
                resolve(farm.pop());
            } else {
                reject("Farm is empty at the moment.");
            }
        }
    });
}

/*
 * Refresh the Farm at given interval and fill up the deficit of directories
 */
async function refreshFarm(options) {
    if(!refreshInProgress){
        let source = options.seed;
        let destination = options.destination;
        let activeClonesNeeded = options.activeCloneCount;

        let currentActiveClones = await getFarmStatus();
        let difference = activeClonesNeeded - currentActiveClones;
        console.log("currentActiveClones = " + currentActiveClones + " difference = " + difference);
        if(difference > 0) { // Need to clone
            let seedNumber = Date.now();
            while (difference > 0) {
                let dir = seedNumber + difference;
                let dirPath = path.join(destination, dir.toString());
                fse.copySync(source, dirPath);
                if(redisClient) { // cache = Redis
                    redisClient.sadd("farm", dir);
                } else { // cache = In-Memory
                    farm.push(dir);
                }
                difference--; // Reduce the deficit
            }
            console.log("Finished refresh, cloned " + (activeClonesNeeded - currentActiveClones) + " entities");
        } else{
            console.log("Sufficient entities are available, farming not needed.");
        }
    } else {
        console.log("A refresh operation is in progress, will check again in " + options.interval + " seconds");
    }
}

/* 
 * Returns the active clone count from the Redis or In-Memory Farm
 */
async function getFarmStatus() {
    return new Promise(function(resolve, reject) {
        if(redisClient){ // cache = Redis
            redisClient.scard("farm", function(err, result) {
                let count = result;
                if(err || !result) {
                    count = 0;
                }
                resolve(count);
            });
        } else{
            resolve(farm.length); // cache = In Memory
        }
    });
}

module.exports.initFarm = initFarm;
module.exports.getNext = getNext;