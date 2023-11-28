//react imports
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//css imports
import './App.css';

// services imports
import { getRickMortyCharacters } from './services/rickAndMorty';

//components
import Header from './components/header';

function App() {
  const [ characters, setCharacters ] = useState([]);//contains all the charachters data
  const [ pageInfo, setPageInfo ] = useState(1);//contains info of till what page is data is loaded for infinite scrolling
  const [ random, setRandom ] = useState(1);// using a random flag state to call charachter api as function passed to addeventlistner will not have updated state in it
  const [ usrSearch, setUsrSearch ] = useState("");//state used for user entered search string in input

  const containerRef = useRef();// ref for element on which scroll event will run
  const navigate = useNavigate();// using useNavigate provided by react-router-dom to navigate through pages

  useEffect(() => {
    handleLoadData("", pageInfo);//getting all the charachters on mount of page
    
    containerRef.current.addEventListener('scroll', handleScroll);//attaching scroll event listner to desired container ref for infinite scroll api call.
  }, []);

  useEffect(() => {
    if (pageInfo === 1) return;
    handleLoadData(usrSearch, pageInfo); //calling api when page is scrolled to bottom by updating random states updation 
  }, [random]);
  
  //scroll event listner func
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 5) {//checking if the page is scrolled to bottom.
        setRandom(Math.random());// updating a flag state with random number to make API call on state Update
      }
    }
  };

  //loading data with proper error handeling;
  const handleLoadData = async (search, page) => {
    await getRickMortyCharacters(search, page).then(resp => {

      if(resp.status === 200) {
        if(page === 1) {
          setCharacters([...resp.data.results])
        } else {
          setCharacters(prev => [...prev, ...resp.data.results]);
        };
  
        setPageInfo(page + 1);
      } else {
        if(page === 1) {
          setCharacters(prev => [...prev])
        } else {
          setCharacters(prev => [...prev]);
        };
      }
      
    }).catch((err) => {
      alert(err.message);
      if(page === 1) {
        setCharacters(prev => [...prev])
      } else {
        setCharacters(prev => [...prev]);
      };
    });
  };

  //user search state updation and api call
  const handleSearch = async (e) => {
    setUsrSearch(e.target.value);

    //search Api call
    handleLoadData(e.target.value, 1);
  };

  // search clear using cross icon single click
  const handleSearchClear = () => {
    setUsrSearch("");
    
    //search Api call
    handleLoadData("", 1);
  }

  //route updation on card click
  const handleRoute = data => () => {
    navigate('/profile', { state: {profileData: data} });//sending profiledata of the charachter in route only
  };

  return (
    <div className="App">
      {/* Header section */}
      <Header
        handleSearch={handleSearch} 
        usrSearch={usrSearch} 
        handleSearchClear={handleSearchClear} 
        homepage={true} 
        setCharacters={setCharacters} 
        pageInfo={pageInfo}
        setPageInfo={setPageInfo}
      />

      {/* Cards grid section*/}
      <div className='card-cont' ref={containerRef}>
        {characters && characters.length ? characters.map(data => <div className='card' onClick={handleRoute(data)}>
            <img src={data.image} alt="" />
            <p className='card-title'>{data.name}</p>
        </div>) : <div className='noData'>No Data Found</div>}
      </div>
    </div>
  );
}

export default React.memo(App);//using react memo for rerendering if there is any change
