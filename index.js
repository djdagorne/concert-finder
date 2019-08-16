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
    for (let i=0; i < artistList.length; i++){ 
        $('#results-list').append(
            `<li class="${artistList[i].name}">
                <h3>${artistList[i].name}</h3>
                <a id="${[i]}" class="js-concert-expand" href='#'>Click to see ${artistList[i].name}'s Concerts</a>
                <section id="concert-results" class="hidden">
                    <h4>${artistList[i].name} concert results</h4>
                    <p id="js-concert-error-message" class="error-message hidden"></p>
                    <ul id="${[i]}-results-list">
                    </ul>
                </section>
            </li>`
    )};
    $('#results').removeClass('hidden');
    watchArtist(searchCity)
}

function watchArtist(searchCity){
    $('.js-concert-expand').on('click', event => {
        event.preventDefault();
        const artistName = getArtistName(event.currentTarget);
        var targetArtist = $(event.currentTarget).attr("id"); //assigns a number to each targetArtist, so I can accurately update DOM
        console.log('clicking on ' + targetArtist);
        getEventList(artistName, searchCity, targetArtist);  
    });
}

function getArtistName(eventTarget) {
    return $(eventTarget).parent().attr('class');
}

function getEventList(artistName, searchCity, targetArtist){

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
            return response.json();
        })
        .then(responseJson => {
            console.log(responseJson);
            displayEventList(responseJson, searchCity, targetArtist); //we have the right responses, we just need to update the correct artists <li> item.
        })
        .catch(err => {
            console.log('this url is throwing an error: '  + err.message)
            $('#js-concert-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function displayEventList(eventJson, searchCity, targetArtist){    

    $('#concert-results').addClass('hidden');
    $(`#${targetArtist}-results-list`).empty();

    if(eventJson._embedded.events.length>0){ //if the event list is more than 0 items long...
        console.log('successfully found events, updating DOM');
        for(let i=0;i<eventJson._embedded.events.length;i++){       //make list items for the events using a for loop
            $(`#${targetArtist}-results-list`).append(`
                <li id="event-item-${[i]}"> 
                    <a href="${eventJson._embedded.events[i].url}">${eventJson._embedded.events[i].name}</a>
                </li>
            `);
        };        
        $('#concert-results').removeClass('hidden'); //reveal the event list
        
    }else{
        console.log('no concerts found')
        $('#concert-results').addClass('hidden');
        $('#concert-results-list').empty();
        //throw new Error('No results found.');
    }
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val(); 
        const searchCity = $('#js-search-city').val();
        
        getArtistList(searchArtist, searchCity);
    });
};

$(watchForm);