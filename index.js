'use strict'

const artistSearchUrl = 'https://tastedive.com/api/similar';
const artistApiKey = '342382-concertf-BEYCE2OB';

const concertSearchUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
const concertApiKey = 'hmha3Dr0BjItrX7K98A1aK2Cxn7Cg2nn';

function displayResults(){

};

function formatArtistQueryParams(artistParams) { //turning an object of key:value pairs into an array, then formatting it into a GET request
    const queryItems = Object.keys(artistParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(artistParams[key])}`)
    return queryItems.join('&');
}

function getArtistList(searchArtist, searchCity){
    console.log('getting artist list');
    const artistParams = { //necessary keys for tastedive API
        q: searchArtist,
        type: 'music',
        k: artistApiKey
    };

    const artistQueryString = formatArtistQueryParams(artistParams);
    const artistUrl = artistSearchUrl + '?' + artistQueryString; //formatting the GET request

    console.log('artistUrl = ' + artistUrl);

    fetch(artistUrl, {mode: 'cors'})
        .then(response => {
          console.log('first .then')
          return response.json();
        })
        .then(responseJson =>{
            if(responseJson.similar.results.length>0){
                $('#js-error-message').empty();
                getEventList(responseJson);
            }else{
                $('#results').addClass('hidden');
                $('#results-list').empty();
                throw new Error('no results found');
            }
        })
        .catch(err => {
          console.log('this url is throwing an error: ' + err)
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function getEventList(artistListJson){

};

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val(); 
        const searchCity = $('#js-search-city').val();
        //console.log('form submitted, ' + searchArtist + " " + searchCity);
        getArtistList(searchArtist, searchCity);
    });
};

$(watchForm);