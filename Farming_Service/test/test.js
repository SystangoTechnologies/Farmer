const farm = require('../main.js');
const dotenv = require('dotenv');

dotenv.config(); // Init dotenv

let farmServiceOptions = {};
farmServiceOptions.interval = process.env.FARM_REFRESH_INTERVAL;
farmServiceOptions.activeCloneCount = process.env.ACTIVE_CLONES_NEEDED;
farmServiceOptions.source = process.env.SOURCE;
farmServiceOptions.destination = process.env.FARM_HOME;
farmServiceOptions.cache = process.env.FARM_CACHE;

// Invoke Farm
farm.boot(farmServiceOptions);

// Try to get next farm entity every second
setInterval(()=>{ emptyFarm(); },15000);

/* 
 Pops entities from the farm
*/
async function emptyFarm() {
    try {
        let result = await farm.getNext();
        console.log("Farm returned : " + result);
    } catch (error) {
        console.log("Farm error : " + error);
    }
}