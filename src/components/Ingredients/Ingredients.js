import React, {useState, useEffect, useCallback} from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';


const Ingredients = () => {

  const [Ingredients, setIngredients] = useState([]);


  useEffect(()=>{
    console.log('Second Use Effect hook', Ingredients);
  }, [Ingredients]);


  const removeIngredientHandler = (id) => {
    setIngredients(prevState => prevState.filter((element)=> element.id !== id));
  }

  const filteredIngredientHandler = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);


  const addIngredientHandler = ingredient => {
    fetch('https://hooks-update-b6ae0.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then( response =>{
        return response.json();
      }
    )
    .then(responseData => {
      setIngredients((prevState) => {
        return [...prevState, {id:responseData.name, ...ingredient}];
      });
    })
  }


  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientHandler}/>
        <IngredientList 
          onRemoveItem={removeIngredientHandler}
          ingredients={Ingredients} 
          />
      </section>
    </div>
  );
}
 
export default Ingredients;


