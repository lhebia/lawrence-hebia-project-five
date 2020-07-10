import React, { Component } from 'react';
import firebase from "./firebase";
import Header from './components/Header';
import Hero from './components/Hero';
import ArticlesContainer from './components/ArticlesContainer';
import AboutContainer from './components/AboutContainer';
import './App.css';
import SavedArticles from './components/SavedArticles';
// import ErrorAdd from './components/ErrorAdd';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      heroActive: true,
      articlesActive: false,
      savedArticlesActive: false,
      aboutActive: false,
      errorPresent: false,
      siteTitle: "Devcompile",
      savedItems: [],
    };
  }

  // Initialize firebase and set data into state
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const data = response.val();
      const newState = [];
      for (let key in data) {
        newState.push({ key: key, name: data[key] });
      }
      this.setState({
        savedItems: newState,
      });
    });
  }

  // Reload entire app
  locationReloadHandler() {
    window.location.reload();
  }

  // Grab ID from when "Compile" buttons is pressed on each Feed Article
  takeId = (id) => {
    console.log(id);
    axios({
      url: `https://dev.to/api/articles/${id}`,
      method: "GET",
      dataType: "JSON"
    }).then((response) => {
      const returnedItem = response.data;
      const objectToPush = {
        id: returnedItem.id,
        title: returnedItem.title,
        url: returnedItem.url,
        imageUrl: returnedItem.social_image,
        description: returnedItem.description,
      };
      const dbRef = firebase.database().ref();
      dbRef.push(objectToPush);
    }, (error) => {
      this.errorHandler();
    });
  };

  // Remove the saved item from firebase
  deleteItem(itemKey) {
    const dbRef = firebase.database().ref();
    dbRef.child(itemKey).remove();
  }

  // If Error is present on compile content button, show user error component
  errorHandler = () => {
    this.setState({
      errorPresent: true,
    })
    // Hide component again after 2 seconds
    setTimeout(() => {
      this.setState({
        errorPresent: false,
      })
    }, 2000);
  }

  render() {
    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Header
            siteTitle={this.state.siteTitle}
            locationReloadHandler={this.locationReloadHandler}
            savedCounter={this.state.savedItems.length}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <Hero
                    siteTitle={this.state.siteTitle}
                    buttonHander={this.startArticleHandler}
                  />
                );
              }}
            />
            <Route
              path="/feed"
              render={() => {
                return <ArticlesContainer passUpId={(id) => this.takeId(id)} />;
              }}
            />
            <Route
              path="/about"
              render={() => {
                return <AboutContainer componentTitle={this.state.siteTitle} />;
              }}
            />
            <Route
              path="/compiled"
              render={() => {
                return (
                  <SavedArticles
                    deleteItem={(itemKey) => this.deleteItem(itemKey)}
                    data={this.state.savedItems}
                  />
                );
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
