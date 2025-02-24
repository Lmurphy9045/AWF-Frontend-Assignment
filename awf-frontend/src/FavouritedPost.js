import React from 'react';
import './App.css';

// favourite post list in here
const storage = window.localStorage;

// displays one post, with:
// it's title doubling as a hyperlink to it
// it's up/downvote score
// and a button to remove it from favourites
// props contains the post's index, data, and the favourite flag updater
function FavouritedPost(props){
    const id = props.post.name;
    return (
        <post className="favPosts">
            <div className="postTitle">
                <a href={'https://reddit.com' + props.post.permalink } target="_blank">
                    <h3>{props.post.title}</h3>
                </a>
            </div>
            <br />
            <button className="unfavButton" type="button" onClick={() =>{
                // remove the post's id from the favourites list in storage
                let favourites = [];
                favourites = JSON.parse(storage.getItem('favourites'));
                if(favourites != null){
                    // find where it's at
                    let index = favourites.indexOf(id);
                    if (index > -1) { 
                        // found, kick it out and return the updated list to the storage
                        favourites.splice(index, 1);
                        storage.setItem("favourites", JSON.stringify(favourites));
                        // updating the favourite flag useState to update that display back in App.js
                        props.update(Math.random());
                    }
                }else{
                    // this should never happen, but logging a message in case it somehow does
                    console.log("how did we get here?");
                }
            }}>&lt;\3</button>
            <div className="postScore">
                <p>Score - {props.post.score}</p>
            </div>
            <br />
        </post>
    ) 
} 



export default FavouritedPost;