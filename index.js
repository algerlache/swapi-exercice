if(process.argv.length < 3){ // check for arguments
    console.log("Provide the film number");
    process.exit(1);
}

const filmNumber = parseInt(process.argv[2],10);
if(isNaN(filmNumber) || filmNumber < 1 || filmNumber > 7) { // is the argument well formatted?
    console.log("Provide a film number between 1 and 7");
    process.exit(1);
}

const baseURL = "https://swapi.co/api/";
const axios = require('axios'); //for HTTP requests

axios.get(baseURL + "films/" + filmNumber).then(result => {
    return result.data["planets"]; // get all planets URL from the film *filmNumber*
}).then(
    planetsUrls => {
        return Promise.all(planetsUrls.map(x => axios.get(x))); // get planets as JSON documents
    }
).then(
    planets => { // filter out planets without water and mountains

        return planets.filter(x => x["data"]["surface_water"] > 0 && x["data"]["terrain"].includes("mountains")).map(x => x["data"])
    }
).then(
    filteredPlanets => { // reduce filtered planets to their diameter and sum them up
        console.log(filteredPlanets.map(x => parseInt(x["diameter"])).reduce((accumulator, current) => accumulator + current,0));
    }
).catch(error => {console.log("SWAPI is down");
console.log(error)});
