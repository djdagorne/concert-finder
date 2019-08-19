'use strict'

const artistSearchUrl = 'http://ws.audioscrobbler.com/2.0/';
const artistApiKey = 'cca25a181d5244cbe7e1d7b94d8ce6f4';

const concertSearchUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
const concertApiKey = 'hmha3Dr0BjItrX7K98A1aK2Cxn7Cg2nn';

function formatQueryParams(artistParams) { //turning an object of key:value pairs into an array, then formatting it into a GET request
    const queryItems = Object.keys(artistParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(artistParams[key])}`)
    return queryItems.join('&');
}

function getArtistList(searchArtist, searchCity){
    console.log('getting artist list');
    const artistParams = { //necessary keys for lastfm API
        method: 'artist.getSimilar',
        artist: searchArtist,
        api_key: artistApiKey,
        format: 'json',
        limit: '10'
    };

    const artistQueryString = formatQueryParams(artistParams);
    const artistUrl = artistSearchUrl + '?' + artistQueryString; 

    fetch(artistUrl)
        .then(response => {
            //console.log('fetching lastFM API response');
            return response.json();
        })
        .then(responseJson =>{
            //console.log(responseJson);
            if(responseJson.similarartists.artist.length>0){
                $('#js-error-message').empty();
                displayArtistList(responseJson, searchCity);
            }else{
                $('#results').addClass('hidden');
                $('#results-list').empty();
                throw new Error('No results found.');
            }
        })
        .catch(err => {
            console.log('this url is throwing an error: ' + err)
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function displayArtistList(responseJson, searchCity){
    console.log('rendering artist list to the DOM based on responseJson')
    $('#results-list').empty();
    const artistList = responseJson.similarartists.artist; //im lazy
    for (let i=0; i < artistList.length; i++){ ////////////////////////////////////////////////////////////////figure out a naming convention for my id tags
        $('#results-list').append(
            `<li>
                <h3>${artistList[i].name}</h3>
                <a id="js-concert-expand" href='#'>${artistList[i].name}'s Concerts</a>
                <section id="concert-results" class="hidden">
                    <h4>${artistList[i].name} concert results</h4>
                    <p id="js-concert-error-message" class="error-message hidden"></p>
                    <ul id="${artistList[i].name}-results-list">
                    </ul>
                </section>
            </li>`
    )};
    $('#results').removeClass('hidden');
    watchArtist(searchCity)
}

function getItemIdFromElement(item) {
    return $(item)
        .closest('h3')
        .val();
  }

function watchArtist(searchCity){
    $('#js-concert-expand').on('click', event => {
        event.preventDefault();
        const artistName = getItemIdFromElement(event.currentTarget);
        console.log('artistName of clicked element is: ' + artistName);
        getEventList(artistName, searchCity);
    });
}

function getEventList(artistName, searchCity){


    console.log('searching for '+ artistName + ' in the city of ' + searchCity)

    const eventParams = {
        classificationName: 'music',
        apikey: concertApiKey,
        keyword: artistName, //testing
        city: searchCity,
        sort: 'date,asc',
    }
    const eventQueryString = formatQueryParams(eventParams);
    const eventUrl = concertSearchUrl + '?' + eventQueryString; 
    
    fetch(eventUrl)
        .then(response => {
            console.log('fetching tmAPI response');
            return response.json();
        })
        .then(responseJson => {
            console.log('this is our tmAPI reponse');
            console.log(responseJson);
        })
        .catch(err => {
            console.log('this url is throwing an error: ' + err)
            $('#js-concert-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val(); 
        const searchCity = $('#js-search-city').val();
        getArtistList(searchArtist, searchCity);
    });
};

$(watchForm);