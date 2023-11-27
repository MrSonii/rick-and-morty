//React import
import React, { useState } from 'react';

//icon import
import { cross } from '../lib/config';
import { getRickMortyCharacters } from '../services/rickAndMorty';

function Header(props) {
  const [ filterBy, setFilterBy ] = useState('');
  const [ filterOption, setFilterOption ] = useState('');

  const { handleSearchClear, usrSearch, handleSearch, homepage, setCharacters, pageInfo, setPageInfo} = props;

  const statusOption = ["Alive", "Dead", "Unknown"];
  const genderOption = ['Female', 'Male', 'Genderless', 'Unknown'];

  const handleFilterType = (e) => {
    setFilterBy(e.target.value);
    setFilterOption('');
  };

  const applyfilter = async (e) => {
    setFilterOption(e.target.value);
    console.log(filterBy, "filterBy", filterOption);
    await getRickMortyCharacters(usrSearch, 1, filterBy, e.target.value).then(resp => {
      if(resp.status === 200) {
          setCharacters([...resp.data.results]);
  
        setPageInfo(pageInfo + 1);
      } else {
        setCharacters([]);
      }
      
    }).catch((err) => {
      alert(err.message);
      setCharacters([]);
    });
  };

  return (
    <header className="App-header">
      <h1>Rick And Morty</h1>
      {homepage && <span>
        <span className='relative' style={{width: "30%"}}>
          <input type="text" placeholder='Filter By Name' className='header-search-input' onChange={handleSearch} value={usrSearch}/>
          {usrSearch && <img src={cross} alt="clear input icon" className='serchClearIcon' width={20} onClick={handleSearchClear}/>}
        </span>
        <select name="filter-name" className='filters' onChange={handleFilterType}>
          <option disabled selected>Filter by</option>
          <option value={'status'}>Status</option>
          <option value={'gender'}>Gender</option>
        </select>
        <select name="filter-option" className='filters' onChange={applyfilter}>
          {filterBy === 'status' 
            ? statusOption.map(val => <option value={val} style={{textTransform: "capitalize"}}>{val}</option>) 
            : filterBy === 'gender' 
              ? genderOption.map(val => <option value={val} style={{textTransform: "capitalize"}}>{val}</option>)
              : <option disabled selected>Please select first filter</option>}
        </select>
      </span>}
    </header>
  )
}

export default React.memo(Header);