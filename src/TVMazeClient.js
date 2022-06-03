const TVMAZE_SEARCH_ENDPOINT = 'https://api.tvmaze.com/search/shows';

function checkStatus(response) {
    if(response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`HTTP Error`);
        console.log('Error communicating with TVMaze');
        throw error;
    }
}

function parseJson(response) {
    return response.json();
}

const TVMazeClient = {

    searchShows(query) {
        return fetch(`${TVMAZE_SEARCH_ENDPOINT}?q=${query}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(checkStatus)
        .then(parseJson);
    }
}

export default TVMazeClient;