import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHandler=useCallback(async()=>{
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-project-20477-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      const data = await response.json();

      const transMovie=[];
      
      for(const key in data){
        transMovie.push({
          id:key,
          title:data[key].title,
          releaseDate:data[key].releaseDate,
          openingText:data[key].openingText
        })
      }
      setMovie(transMovie);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  },[])

  useEffect(()=>{
    fetchHandler();
  },[fetchHandler])

  const addMovieHandler=async(movie)=>{
      const response=await fetch("https://react-project-20477-default-rtdb.firebaseio.com/movies.json",{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-type':'Application.json'
      }
    });
    const data=await response.json();
    console.log(data);
    fetchHandler();
  }

  let content=<p>Found no Movies</p>
  if(movie.length>0){
    content=<MoviesList movies={movie}/>
  }
  if(isLoading){
    content=<p>Loading...</p>
  }
  if(error){
    content=<p>{error}</p>
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
