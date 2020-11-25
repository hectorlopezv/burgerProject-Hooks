import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};





const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, identifier} =  useHttp();


  //const [httpState, dispatchHttp] =  useReducer(httpReducer, {loading:false, error:null});
  // const [userIngredients, setUserIngredients] = useState([]);
 // const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  useEffect(() => {//when data changes execute 
    if(!isLoading && identifier === 'REMOVE_INGREDIENT'){
      dispatch({type:'DELETE', id:reqExtra});
    }else if(!isLoading && data && identifier === 'ADD_INGREDIENT')
    {
      console.log(data);
      dispatch({
                type: 'ADD',
                ingredient: { id: data.name, ...reqExtra }
               });
    }
    
  }, [reqExtra, data, identifier, isLoading]);





  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);



  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://hooks-update-b6ae0.firebaseio.com/ingredients.json', 
    'POST',
    JSON.stringify(ingredient), 
    ingredient,
    'ADD_INGREDIENT'
    );



  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    // dispatchHttp({type: 'SEND'});
    sendRequest(
      `https://hooks-update-b6ae0.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
      );

  }, [sendRequest]);//EVITAR SENDrequest se llame varias veces

  const clearError = useCallback(() => {
    // dispatchHttp({type: 'ERROR', error:null});
  }, []);


  const ingredientList = useMemo(() =>{
    return( <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />)
  }, [userIngredients, removeIngredientHandler]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;