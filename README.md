# redux-thunk-promise-middleware

## Why?
##### It removes all the burden of handeling `callbacks` in action creators as well as the problem of maintaing `ACTION_TYPE_SUCCESS` or `ACTION_TYPE_FAILED`  .

## Installation
`npm i redux-thunk-promise-middleware`

`yarn add redux-thunk-promise-middleware`

#### Usage

# Defining Store
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';

import ReduxThunkPromiseMiddleware from 'redux-thunk-promise-middleware';

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import RootReducer from './Reducer';

`Note ReduxThunkPromiseMiddleware should always be before thunk middleware`
const store = createStore(RootReducer, applyMiddleware(ReduxThunkPromiseMiddleware, thunk, logger) );
```

# Defining Action Creator

##### every action creator receives two arguments 
##### 1. dispatch 
##### 2. start 
##### ------ dispatch is used for dispatching actions
##### ------ start is used to track the action .
###### a. It takes an action type as parameter and dispatch an action with the given type and when the action creator Promise get resolved or reject based on that it automatically fires `${ACTION_TYPE}_SUCCESS` or `${ACTION_TYPE}_FAILED`

###### b. The data which will you return from the action creator when the promise is resolved will be dispatched inside a payload of the action with action type `${ACTION_TYPE}_SUCCESS`. eg- {type: `${ACTION_TYPE}_SUCCESS` , payload: {value} } . As well as it will deliver the same data where this action creatore will be called.

#### or 

##### If its get rejected then it will automatically dispatch an action like 
###### {type: `${ACTION_TYPE}_FAILED` , error: errorData }. As well as it will deliver the same error where this action creatore will be called.

##  

```javascript
import FETCH_MOVIE_LIST  from '../actionTypes'
export const fetchMovieList = () => (dispatch, start) => {
    start(FETCH_MOVIE_LIST);
    return fetch(url, { method: 'GET'})
           .then((res) => res.json() )
           .then((data) => {
             return {value: data} 
// it will be dispatched as {type: `${ACTION_TYPE}_SUCCESS` , paylaod: {value:data} }
           })
}

```

# Defining Reducer

```javascript
import FETCH_MOVIE_LIST  from '../actionTypes'

const reducer = (store, action) { 
    
    switch(action.type){
        
        case `${FETCH_MOVIE_LIST}_SUCCESS`: //  rest of code
        case `${FETCH_MOVIE_LIST}_FAILED`: //  rest of code
        default: return store;
    }
    
}
```


# Using the Action creator

```javascript
import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {fetchMovieList} from '../actionCreator';

import Loader from '../Components/Loader';
import MovieList from '../Components/MovieList';

class Home extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            dataLoading: false
        }
    }
    
   
    componentDidMount(){
        this.loadData();
    }
    
      toogleLoading = () => {
        this.setState((prevState) => ({
            isLoading: !prevState.isLoading
        }))
    }

    
    
    loadData = async () => {
        try{
            this.toogleLoading();
            const result = await this.props.fetchMovieList();
            this.toogleLoading();
        }catch(err){
            this.toogleLoading();
        }
    }
    
    render(){
        const { dataLoading } = this.state;
        const {movieData} = this.props;
        
        return dataLoading ? <Loader /> : <MovieList data={movieData}/>
    }


}
const mapStateToProps = (store) => {
    return {
        movieData: store.movieDatabase
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchMovieList,
}, dispatch);

export default Home connect(mapStateToProps, mapDispatchToProps)(Home);
```




# Advanced Concepts

### Handeling multiple actionCreators

```javascript
import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {fetchMovieList, fetchUserData} from '../actionCreator';

import Loader from '../Components/Loader';
import MovieList from '../Components/MovieList';

class Home extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            dataLoading: false
        }
    }
    
   
    componentDidMount(){
        this.loadData();
    }
    
      toogleLoading = () => {
        this.setState((prevState) => ({
            isLoading: !prevState.isLoading
        }))
    }

    
    
    loadData = async () => {
        try{
        
         const promises = [this.props.fetchMovieList(), this.props.fetchUserData()];
            this.toogleLoading();
            const result = await Promise.all(promises);
            this.toogleLoading();
        }catch(err){
            this.toogleLoading();
        }
    }
    
    render(){
        const { dataLoading } = this.state;
        const {movieData} = this.props;
        
        return dataLoading ? <Loader /> : <MovieList data={movieData}/>
    }


}
const mapStateToProps = (store) => {
    return {
        movieData: store.movieDatabase
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchMovieList,
    fetchUserData,
}, dispatch);

export default Home connect(mapStateToProps, mapDispatchToProps)(Home);
```
