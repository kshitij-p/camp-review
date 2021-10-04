//requests new camps
async function requestCamps(lastCampId, lastCamp) {
    
    let data = await fetch('http://localhost:8080/camps/api/loadcamps', {headers: {'lastCamp': lastCampId}})
    let parsedData = await data.json();
    
    
    for(let i of parsedData) {
        let imageUrl;
        let showUrl = `/camps/${i._id}`;
        if(i.image.length){
            imageUrl = i.image[0].url;
        } else {
            imageUrl = i.placeholderimg;
        }
        createCamps(i.id, i.name, imageUrl, i.description, i.location, showUrl, lastCamp);
    }
    
}

//creates camps
async function createCamps(campId, titleText, imgSrc, descText, locationText, showUrl, lastCamp){
    let card = document.createElement('div');
    card.classList = "card mb-3";
    card.setAttribute("data", campId)

    let row = document.createElement('div');
    row.classList = "row";

    let col4 = document.createElement('div');
    col4.classList = "col-md-4";

    let col8 = document.createElement('div');
    col8.classList = "col-md-8";

    let img = document.createElement('img');
    img.classList = "img-fluid";
    

    let cardbody = document.createElement('div');
    cardbody.classList = "card-body";

    let title = document.createElement('h5');
    title.classList = "card-title";

    let desc = document.createElement('p');
    desc.classList = 'card-text';
    

    let locContainer = document.createElement('p');
    locContainer.classList = 'card-text';

    let loc = document.createElement('small');
    loc.classList = "text-muted";

    let viewBtn = document.createElement('a');
    viewBtn.classList = "btn btn-primary"
    viewBtn.append("View");
        
    //append content
    title.append(titleText)
    img.setAttribute("src", imgSrc);
    img.setAttribute("loading", "lazy");
    desc.append(descText);
    loc.append(locationText);
    viewBtn.setAttribute('href', showUrl);

    //append elements to each other
    cardbody.append(title, desc, locContainer, viewBtn);
    locContainer.append(loc);
    col8.append(cardbody);
    col4.append(img);
    row.append(col4, col8);
    
    card.append(row);
    lastCamp.parentElement.appendChild(card);
}



async function loadCamps(lastCamp) {
    
    let lastCampId = lastCamp.getAttribute("data");
    
    await requestCamps(lastCampId, lastCamp);
    createObserver();
}

//create observer to check if we are at last camp
function createObserver() {
    let list = document.querySelectorAll('div.card.mb-3');
    let lastCamp = list[list.length-1]

    const observer = new IntersectionObserver((entries, observer)=> {
    
    entries.forEach((entry)=> {
        
        if(entry.isIntersecting){
                      
            //remove observer then load new camps to avoid infinite looping and resource usage observing
            observer.unobserve(lastCamp);
            loadCamps(lastCamp);
            
        }
        
       })

    }, {threshold: 1});
    observer.observe(lastCamp);
}

//wait for the entire page to load before executing infinite scrolling
window.onload = (event)=> {
    
    createObserver();
}
