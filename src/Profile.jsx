//react-imports
import React, { useEffect, useState } from 'react'

//router-imports
import { useLocation } from 'react-router-dom';

//components-imports
import Header from './components/header';
import { getRickMortyCharacterEpisodes, getRickMortyCharacterLocation } from './services/rickAndMorty';

function Profile() {
  const [ profile, setProfile ] = useState({});
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ locationData, setLocationData ] = useState({});

  const { state: { profileData } } = useLocation();

  useEffect(() => {
    setProfile(profileData);
    profileData?.episode?.length && getEpisodeData();
    profileData?.episode?.length && getLocationData();
  }, []);

  const getEpisodeData = async () => {
    const payloadList = profileData.episode.map(data => data?.split("/")[data.split("/").length - 1])
    await getRickMortyCharacterEpisodes(payloadList).then(res => {
      if (res.status === 200) {
        console.log(res)
        setEpisodeList(res.data);
      } else {
        setEpisodeList([]);
      }
    }).catch(err => {
      alert(err.message);
      setEpisodeList([])
    })
  };

  const getLocationData = async () => {
    const int = profileData?.location?.url?.split('/')?.[profileData?.location?.url?.split('/').length - 1];

    await getRickMortyCharacterLocation(int).then(res => {
      if (res.status === 200) {
        setLocationData(res.data);
      } else {
        setLocationData({});
      }
    }).catch(err => {
      alert(err.message);
      setLocationData({});
    })
  };
  
  return (
    <div className='App'>
      <Header />
      <div className='card-cont'>
        <div className='profile-cont'>
          <div className='image-cont'>
            <img src={profile?.image} alt="Profile Image" className='profileImg'/>
          </div>
          <div className='detail-cont'>
            <h1 className='name'>{profile.name}</h1>
            <p><span>Species:</span> <span> {profile?.species} </span></p>
            <p><span>Gender:</span> <span> {profile?.gender} </span></p>
            <p><span>Status:</span> <span> {profile?.status} </span></p>
            <p><span>Origin:</span> <span> {profile?.origin?.name} </span></p>
            <p><span>Current Location:</span> <span> {profile?.location?.name} </span></p>
            <div className='mt-5'>
              <label htmlFor="episodeList" className='episodelistlabel'>
                Name of the Episodes {profile.name} is featured in:
              </label>
              <select name="episode List" id="episodeList" className='episodelist' key="jhdljhklfdlfjldkjflkdjf1232323">
                {!!episodeList.length
                  ? 
                    episodeList.map(episode => <option value={episode.id} >{episode.episode}: {episode.name}</option>)
                  : 
                    !Array.isArray(episodeList) && !!Object.keys(episodeList).length 
                      ? <option value={episodeList.id} >{episodeList.episode}: {episodeList.name}</option> 
                      : <option value={"no data"}>{profile.name} is not featured in any of the episode according to our data.</option>
                }
                {}
              </select>
            </div>
            {!!Object.keys(locationData).length && <div className='mt-5'>
              <p className='locationTitle'>Location details of {profile?.name}:</p>
              <div className='PL-5 mt-3 location-cont'>
                <p>Location Name: {locationData.name}</p>
                <p>Location Type: {locationData.type}</p>
                <p>Location Dimention: {locationData.dimension}</p>
                <p>Total residents at location {locationData.name}: <span style={{color: 'lightblue'}}>{locationData.residents.length}</span></p>
              </div>
            </div>}
          </div>
        </div>
      </div>
      <style jsx>{`
        .location-cont > p {
          margin-bottom: 5px;
        }
        .PL-5 {
          padding-left: 1.5rem;
          font-size: 14px;
        }
        .mt-5 {
          margin-top: 1.5rem;
        }
        .mt-3 {
          margin-top: 1rem;
        }
        .episodelistlabel, .episodelist {
          width: 100%;
        }
        .episodelist {
          margin: 10px 0 0 0;
          padding: 5px;
          border-radius: 5px;
          background: black;
          color: lightgrey;
        }
        .detail-cont {
          width: 50%;
          color: lightgrey;
          padding: 0 3rem;
        }
        .name {
          font-size: 3vw;
          margin-bottom: 1rem;
        }
        .detail-cont > p {
          font-size: 1.1vw;
          width: 100%;
          display: flex;
          margin-bottom: 0.5rem;
        }
        .detail-cont > p > span:first-child {
          width: 30%;
        }
        .profileImg {
          width: 100%;
          border-radius: 10px;
        }
        .image-cont {
          width: 600px;
          height: 600px;
        };
      `}</style>
    </div>
  )
}

export default React.memo(Profile);