import React, {useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import {AuthContext} from './context/auth-context';


const App = (props:any) => {
    const authContext = useContext(AuthContext);//connect to context object
    
    let content = <Auth />
    if(authContext.isAuth){
        content = <Ingredients/>
    }

     return (content);
}
export default App;
