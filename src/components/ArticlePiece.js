import React from 'react';

// This creates the component that is each article in the "Feed" section
const ArticlePiece = (props) => {
    return (
      <li>
        <a href={props.url} target="_blank" rel="noopener noreferrer">
          <img src={props.socialImage} alt={props.imageAlt}></img>
        </a>
        <div className="flexContainer ArticlePiece-ButtonContainer">
          <p>
            {props.creationDate} <span>&#xb7;</span> Liked by:{" "}
            {props.positiveReactions}
          </p>
          <button onClick={props.passId} className="ButtonReset">
            <code>compile</code>
          </button>
        </div>
        <div className="ArticlePiece-TextContainer">
          <a href={props.url} target="_blank" rel="noopener noreferrer">
            <h3>{props.title}</h3>
          </a>
          <p>{props.description}</p>
        </div>
      </li>
    );
}

export default ArticlePiece;