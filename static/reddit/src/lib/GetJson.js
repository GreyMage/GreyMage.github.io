export default (url) => {
    
    // console.log("JSONING",url);
    
    return new Promise((resolve,reject) => {

    
    
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                resolve(JSON.parse(request.responseText));
            } else {
                // We reached our target server, but it returned an error
                reject(request);
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            reject(request);
        };

        request.send();

    })
}