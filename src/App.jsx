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
  const [ characters, setCharacters ] = useState([]);
  const [ pageInfo, setPageInfo ] = useState(1);
  const [ random, setRandom ] = useState(1);
  const [ usrSearch, setUsrSearch ] = useState("");

  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    handleLoadData("", pageInfo);
    
    containerRef.current.addEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pageInfo === 1) return;
    handleLoadData(usrSearch, pageInfo); 
  }, [random]);
  

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      
      console.log(scrollTop , clientHeight , scrollHeight - 5, "called");
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setRandom(Math.random());// updating a flag state with random number to make API call on state Update
      }
    }
  };
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

  const handleSearch = async (e) => {
    setUsrSearch(e.target.value);

    //search Api call
    handleLoadData(e.target.value, 1);
  };

  const handleSearchClear = () => {
    setUsrSearch("");
    
    //search Api call
    handleLoadData("", 1);
  }

  const handleRoute = data => () => {
    navigate('/profile', { state: {profileData: data} });
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

export default React.memo(App);
