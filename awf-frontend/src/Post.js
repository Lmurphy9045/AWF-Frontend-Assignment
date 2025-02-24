import React from 'react';
import './App.css';

// favourite post list in here
const storage = window.localStorage;

// displays one post, with:
// it's title doubling as a hyperlink to it
// it's up/downvote score
// and a button to add it to favourites
// props contains the post's index, data, and the favourite flag updater
function Post(props){
    if(props.post.stickied === true){
        // ignoring any stickied posts, they get sent on top of the 10 hot posts
        return;
    }else{
        // we keep the post's ID, aka it's 'name' which is it's fullname for retrieving it from the api later
        const id = props.post.name;
        return (
            <post className="posts">
                <div className="postTitle">
                    <a href={'https://reddit.com' + props.post.permalink } target="_blank">
                        <h3>{props.post.title}</h3>
                    </a>
                </div>
                <br />
                <button className="favButton" type="button" onClick={() =>{
                    // add the post's id to the favourites list in storage
                    let favourites = [];
                    favourites = JSON.parse(storage.getItem('favourites'));
                    if(favourites != null){
                        // if already in the list, do nothing
                        if(!favourites.find(fav => fav === id)){
                            // if not in the list, add it
                            favourites.push(id);
                            storage.setItem("favourites", JSON.stringify(favourites));
                            // updating the favourite flag useState to update that display back in App.js
                            props.update(Math.random());
                        }
                    }else{
                        // first favourite, add
                        favourites = [];
                        favourites.push(id);
                        storage.setItem("favourites", JSON.stringify(favourites));
                        // updating the favourite flag useState to update that display back in App.js
                        props.update(Math.random());
                    }
                }}>&lt;3</button>
                <div className="postScore">
                    <p>Score - {props.post.score}</p>
                </div>
                <br />
            </post>
        )
    } 
} 


export default Post;