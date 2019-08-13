'use strict'

const artistSearchUrl = 'https://tastedive.com/api/';

const concertSearchUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
const concertApiKey = 'hmha3Dr0BjItrX7K98A1aK2Cxn7Cg2nn';

function displayResults(){

};

function formatArtistQueryParams(artistParams) { //turning an object of key:value pairs into an array, then formatting it into a GET request
    const queryItems = Object.keys(artistParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getArtistList(searchArtist, searchCity){
    const artistParams = {
        q = searchArtist,
        type = 'music'
    };

    const artistQueryString = formatArtistQueryParams(artistParams);
    const artistUrl = artistSearchUrl + '?' + artistQueryString;

    .fetch(artitUrl)
        .then(response => {
            return response.json();
        })
        .then(responseJson =>{
            if(responseJson.similar.results>0){
                console.log(responseJson);
                $('#js-error-message').empty();
                getEventList(responseJson);
            }else{
                $('#results').addClass('hidden');
                $('#results-list').empty();
                throw new Error('no results found');
            }
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function getEventList(artistListJson){

};

function watchForm(){
    $('form').sumbit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist'); 
        const searchCity = $('#js-search-city');
        getArtistList(searchArtist, searchCity);
    });
};

$(watchForm);