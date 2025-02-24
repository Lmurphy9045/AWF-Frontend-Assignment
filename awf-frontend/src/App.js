//import logo from './logo.svg';
import './App.css';
import Post from './Post';
import FavouritedPost from './FavouritedPost';
import { useState, useEffect } from 'react';


// client ID of reddit app - installed app type owned by Leanne Murphy on a personal account
// this webapp should require no access to any reddit user account, including my own
const clientID = '8FqbQyDjr-MceF-aC8q3zQ'; 

// where we're keeping the access token and favourite list
const storage = window.localStorage; 


function App() {
  // list of post data as an array
  const [posts, setPosts] = useState([]);

  // name of a subreddit obtained through input as a string
  const [subreddit, setSubreddit] = useState('greebles');

  // list of post data as an array
  const [favPosts, setFaves] = useState([]);

  // a flag used for knowing when favourite data is to be retrieved again for re-rendering
  // value doesn't mean anything
  const [favFlag, favChange] = useState();

  
  
  // gets an API token from reddit on first load
  useEffect(() => { 
    const getToken = async () => {
      const params = new URLSearchParams();
      params.append('grant_type', 'https://oauth.reddit.com/grants/installed_client');
      params.append('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
      await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        body: params,
        headers: {  
          Authorization: "Basic " + btoa(unescape(encodeURIComponent(clientID + ":" + ""))),
        },
      })
        .then(function(response){ 
          return response.json();
        })
        .then(function(data){ 
          // storing it in local storage, in case expiry checking and handling is set up in the future 
          storage.setItem('token', data.access_token);
          storage.setItem('expire', (Date.now() + (data.expires_in * 1000)));
        })
        .catch(error => {
          console.error(error);
        });
    }
    getToken();
  }, []); 
  
  
  // when subreddit text box changes, fetches the data of the 
  // first 10 hot posts on the subreddit
  // changing this to be called when a button is pressed would be better rate-limit-wise, but this is fine
  // reddit's api rate limit is 100 requests/min, averaged over the last 10 mins. 
  // if rate limited, wait 10 mins and it'll let requests through again
  useEffect(() => {
    const getSub = async () =>{
      // request hot posts from subreddit, using oauth, in json
      const url = new URL('https://oauth.reddit.com/r/'+ [subreddit] +'/hot.json');
      // adding limit of 10 posts
      url.searchParams.append('limit', 10);
      url.toString();
      await fetch(url, {
        method: 'GET',
        headers: {  
          // this shenanigan gets around the cors error for reasons I don't understand. also this uses the auth token
          Authorization: btoa(unescape(encodeURIComponent("Bearer " + storage.getItem('token')))),
        },
      })
        .then(function(response){ 
          return response.json();
        })
        .then(function(data){ 
          if(data != null){
            // setting the post list to a list of the individual post data
            setPosts(data.data.children);
            // this will be 10-12 posts, depending on whether the sub has stickied posts
            // reddit has a limit of two stickied posts per subreddit, which get included alongside the 10 hot posts
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    // function go
    getSub();
  }, [subreddit]);



  // when favourites are edited (favFlag changed), get favourite post IDs from storage and fetch their data
  // updates the favPosts list for the display to be re-rendered
  useEffect(() => {
    let favArray = [];
    let favString = "";
    favArray = JSON.parse(storage.getItem('favourites'));

    // gotta make sure it actually has contents
    if(favArray){
      // format the post IDs into a single string, each ID separated by ","
      for(let i = 0; i < favArray.length; i++){
        if(i == 0 || i == favArray.length){
          favString = favString + favArray[i];
        }else{
          favString = favString + "," + favArray[i];
        }
      }
      
      const getPost = async () =>{
        // /api/info/ can take a list of fullnames to grab them all in one request. also json format again
        const url = new URL('https://oauth.reddit.com/api/info/.json');
        // adding list of post fullnames
        url.searchParams.append('id', favString);
        url.toString();
        await fetch(url, {
          method: 'GET',
          headers: {  
            // the cors beast will be slain again, featuring token
            Authorization: btoa(unescape(encodeURIComponent("Bearer " + storage.getItem('token')))),
          },
        })
          .then(function(response){ 
            return response.json();
          })
          .then(function(data){ 
            if(data != null){
              // setting faves list to a list of the individual post data
              setFaves(data.data.children);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      // function go
      getPost();

    }
    // we do nothing if there aren't favourites yet
  
  }, [favFlag]);



  // yay html time
  return (
    <div className="App">
      <div class="flex-container">

        <div className="left">
          <div className="leftTop">
            <h2 className="search">Search in:</h2>
            <header className="App-header"> 
              <input type="text" className="input" value={subreddit} onChange={e => setSubreddit(e.target.value)}/>
            </header>
          </div>

          <div className="posts">
            {
              // sending post data and the favourite update flag changer to <Post>s for display
              (posts != null) ? posts.map((post, index) => <Post key={index} post={post.data} update={favChange}/>) : ''
            }
          </div>
        </div>

        <div className="right">
          <div className="rightTop">
            <br></br>
            <h2 className="favTitle">Favourite Posts:</h2>
            <br></br>
          </div>
          <div className="postContainer">
            <div className="favouritePosts">
              {
                // sending post data and the favourite update flag changer to <FavouritedPost>s for display
                (favPosts != null) ? favPosts.map((post, index) => <FavouritedPost key={index} post={post.data} update={favChange}/>) : ''
              }
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;


