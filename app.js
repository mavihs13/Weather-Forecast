const apiKey="55fb0cfc3db7c5688b45808571e47334";
const apiURL="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const newsApiKey="812d33accde843bc898c6e65b6dde042";
const newsApiURL="https://newsapi.org/v2/everything?";

const searchBox=document.querySelector(".search input");
const searchBtn=document.querySelector(".search button");
const weatherIcon=document.querySelector(".weather-icon");
const loading=document.querySelector(".loading");
const error=document.querySelector(".error");
const weather=document.querySelector(".weather");

const quotes=[
    {text:"Wherever you go, no matter what the weather, always bring your own sunshine.",author:"Anthony J. D'Angelo"},
    {text:"Sunshine is delicious, rain is refreshing, wind braces us up, snow is exhilarating.",author:"John Ruskin"},
    {text:"The sun always shines above the clouds.",author:"Paul F. Davis"},
    {text:"A change in the weather is sufficient to recreate the world and ourselves.",author:"Marcel Proust"},
    {text:"There's no such thing as bad weather, only inappropriate clothing.",author:"Sir Ranulph Fiennes"},
    {text:"Climate is what we expect, weather is what we get.",author:"Mark Twain"}
];

let quoteIndex=0;
function rotateQuote(){
    const quote=quotes[quoteIndex];
    document.querySelector(".quote").textContent=`"${quote.text}"`;
    document.querySelector(".author").textContent=`- ${quote.author}`;
    quoteIndex=(quoteIndex+1)%quotes.length;
}
setInterval(rotateQuote,8000);

function changeQuote(direction){
    quoteIndex=(quoteIndex+direction+quotes.length)%quotes.length;
    rotateQuote();
}

function applyWeatherTheme(weather){
    document.body.classList.remove('weather-clear','weather-clouds','weather-rain','weather-snow','weather-mist','weather-drizzle');
    
    const themeMap={
        'Clear':'weather-clear',
        'Clouds':'weather-clouds',
        'Rain':'weather-rain',
        'Drizzle':'weather-rain',
        'Snow':'weather-snow',
        'Mist':'weather-mist',
        'Fog':'weather-mist',
        'Haze':'weather-mist'
    };
    
    const themeClass=themeMap[weather]||'weather-clear';
    document.body.classList.add(themeClass);
}

async function updateNews(city){
    const newsContainer=document.querySelector(".news-container");
    newsContainer.innerHTML='<p class="news-placeholder">Loading news...</p>';
    
    try{
        const response=await fetch(`${newsApiURL}q=${city}&sortBy=publishedAt&pageSize=4&apiKey=${newsApiKey}`);
        const data=await response.json();
        
        if(data.articles && data.articles.length>0){
            newsContainer.innerHTML=data.articles.map(article=>{
                const date=new Date(article.publishedAt).toLocaleDateString();
                return `<div class="news-item">
                    <div class="news-title">${article.title}</div>
                    <div class="news-info">${article.source.name} • ${date}</div>
                </div>`;
            }).join('');
        }else{
            newsContainer.innerHTML='<p class="news-placeholder">No recent news found for this location</p>';
        }
    }catch(err){
        newsContainer.innerHTML='<p class="news-placeholder">Unable to load news</p>';
    }
}

async function checkWeather(city){
    if(!city.trim()) return;
    
    loading.style.display="block";
    error.style.display="none";
    weather.style.display="none";
    
    try{
        const response=await fetch(apiURL+city+`&appid=${apiKey}`);
        
        if(response.status==404){
            loading.style.display="none";
            error.style.display="block";
        }else{
            const data=await response.json();
            
            document.querySelector(".city").innerHTML=data.name;
            document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
            document.querySelector(".description").innerHTML=data.weather[0].description;
            document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
            document.querySelector(".wind").innerHTML=data.wind.speed+" km/h";
            
            updateNews(data.name);
            
            const weatherMap={
                "Clouds":"clouds.png",
                "Clear":"clear.png",
                "Rain":"rain.png",
                "Drizzle":"drizzle.png",
                "Mist":"mist.png",
                "Snow":"snow.png"
            };
            weatherIcon.src=weatherMap[data.weather[0].main]||"clear.png";
            
            applyWeatherTheme(data.weather[0].main);
            
            loading.style.display="none";
            weather.style.display="block";
        }
    }catch(err){
        loading.style.display="none";
        error.style.display="block";
    }
}

searchBtn.addEventListener("click",()=>{
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress",(e)=>{
    if(e.key==="Enter") checkWeather(searchBox.value);
});


