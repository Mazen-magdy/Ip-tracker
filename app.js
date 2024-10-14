// fetching the data from the API
async function fetchData() {
    try{
        let response = await fetch('https://geo.ipify.org/api/v2/country,city?apiKey=at_k80vT3GCfGKyKI9O3z5XWG27ta5de&ipAddress=8.8.8.8')
        console.log('here is the response', response);
        if(response.ok){
            let jsonResponse = await response.json();
            console.log('here is the json response', jsonResponse);
            return jsonResponse;
        }
        else{
            throw new Error('Request failed!');
        }
    }
    catch(error){
        console.log('error', error);
    }
}
 let Ip = (ip) =>{
    // let arrip = [ip[0], ip[2], ip[4],ip[6]];
    let arrip =[];
    let prev = 0;
    console.log("ip :" , ip);

    for (let i = 0; i < ip.length; i++) {
        if (ip[i] == '.' || ip[i+1] == undefined) {
            if(ip[i+1] == undefined){
                arrip.push(parseInt(ip.slice(prev, i+1)));
            }
            else{
            arrip.push(parseInt(ip.slice(prev, i)));
            prev = i + 1;
        }
        }
    }
    console.log("arrip :" , arrip);
    return arrip;
 }
// Initialize the map and marker variables
let map;
let marker;
let Initialized = false;
// Function to create or update the map
let makingMap = (arrip, ip, value) => {

    if (!Initialized) {
        // Initialize the map only once
        map = L.map('map').setView([arrip[0], arrip[1]],10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        marker = L.marker([arrip[0], arrip[1]],10).addTo(map);
        Initialized = true;
    } else {
        // Update the map view and marker position
        map.setView([arrip[0], arrip[1]],10);
        marker.setLatLng([arrip[0], arrip[1]],10);
    }

    document.getElementById('ip').innerHTML = ip;
    if (value != undefined) {
        document.getElementById('Location').innerHTML = value.location.city + ', ' + value.location.region + ', ' + value.location.country;
        document.getElementById('Timezone').innerHTML = value.location.timezone;
        document.getElementById('isp').innerHTML = value.isp;
    }
    else{
        document.getElementById('Location').innerHTML = 'Can\'t access ';
        document.getElementById('Timezone').innerHTML = 'Can\'t access ';
        document.getElementById('isp').innerHTML = 'Can\'t access ';
    }
}
Promise.resolve(fetchData()).then((value) => {
    let ip = value.ip;
    let arrip = Ip(ip)
    makingMap(arrip, ip, value)
});
document.getElementById('ipfield').addEventListener('input', function(){

    let ip = document.getElementById('ipfield').value;
    let arrip = Ip(ip)
    makingMap(arrip , ip)
})