const AutoCompleteConfig={
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
  `;
  },
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie);
  },
  inputValue(movie){
    return movie.Title;
  },
  async fetchData(searchTerm){
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        s: searchTerm
      }
    });
    
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
  }
}

createAutoComplete({
  ...AutoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#left-summary'),'left');
  }
});
createAutoComplete({
  ...AutoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#right-summary'),'right');
  }
});

let leftMovie, rightMovie;

const onMovieSelect = async (movie, summaryElement, side) =>{
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    } 
  });
  console.log(response.data);
  summaryElement.innerHTML = movieTemplate(response.data);

  if(side==='left'){
    leftMovie = response.data;
  }else{
    rightMovie=response.data;
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
};

const runComparison = ()=>{  

  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');
    

  leftSideStats.forEach((leftStat,index)=>{
    const rightStat = rightSideStats[index];
    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if(parseFloat(rightSideValue)>parseFloat(leftSideValue)) {
      console.log(rightSideValue);
      console.log(leftSideValue);
      leftStat.classList.remove("is-primary");
      // leftStat.classList.add("is-warning");
      rightStat.classList.add("is-primary");
      // rightStat.classList.remove("is-warning");
    }else if (parseFloat(rightSideValue)<parseFloat(leftSideValue)){
      rightStat.classList.remove("is-primary");
      // rightStat.classList.add("is-warning");
      leftStat.classList.add("is-primary");
      // leftStat.classList.remove("is-warning");
    }
    else{
      rightStat.classList.remove("is-primary");
      // rightStat.classList.add("is-warning");
      leftStat.classList.remove("is-primary");
    }

  });

};

const movieTemplate = (movieDetail) =>{


    let dollars = parseFloat(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    console.log(dollars);
    if(isNaN(dollars)){
      dollars=0;
    }
    let Metascore=parseInt(movieDetail.Metascore);
    if(isNaN(Metascore)){
      Metascore=0;
    }
    let imdbRating=parseFloat(movieDetail.imdbRating);
    if(isNaN(imdbRating)){
      imdbRating=0;
    }
    let votes= parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    if(isNaN(votes)){
      votes=0;
    }
    const awards = movieDetail.Awards.split(' ').reduce( (prev,word) => {
      const value= parseInt(word);
      if(isNaN(value)){
        return prev;
      }else{
        return prev+value;
      }
    }, 0);
    return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p dat class="title">${movieDetail.Awards}</p>
      <p class="title">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="title">Box Office</p>
    </article>
    <article data-value=${Metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="title">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="title">IMDB Rating</p>
    </article>
    <article data-value=${votes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="title">IMdb Votes</p>
    </article>
    `;
  }