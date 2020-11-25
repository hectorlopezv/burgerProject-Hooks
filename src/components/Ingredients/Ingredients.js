import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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


const httpReducer = (curState, action) => {//HERE MANAGE THE STATE
  switch (action.type) {
    case 'SEND':
      return {...curState, loading: true}
    case 'RESPONSE':
      return  {...curState, loading: false}
    case 'ERROR':
      return  {loading:false,  error: action.error}
    default:
      throw new Error('Should not get there!');
  }
}


const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] =  useReducer(httpReducer, {loading:false, error:null});
  // const [userIngredients, setUserIngredients] = useState([]);
 // const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
   //setIsLoading(true);
   dispatchHttp({type: 'SEND'});
    fetch('https://hooks-update-b6ae0.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        //setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});
        return response.json();
      })
      .then(responseData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        });
      });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({type: 'SEND'});
    fetch(
      `https://hooks-update-b6ae0.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(response => {
        dispatchHttp({type: 'RESPONSE'});
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        // );
        dispatch({ type: 'DELETE', id: ingredientId });
      })
      .catch(error => {
        //setError('Something went wrong!');
        dispatchHttp({type: 'ERROR', error:error});
        //setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({type: 'ERROR', error:null});
  }, []);


  const ingredientList = useMemo(() =>{
    return( <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />)
  }, [userIngredients, removeIngredientHandler]);
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;