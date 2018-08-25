const farm = require('../index.js');
const dotenv = require('dotenv');

dotenv.config(); // Init dotenv
farm.init(); // Invoke Farm

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