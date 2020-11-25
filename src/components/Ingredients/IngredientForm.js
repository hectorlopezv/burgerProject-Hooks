import React, {useState} from 'react';
import LoadingIndicator from '../UI/LoadingIndicator';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {


  const [Amount, setAmount] = useState('');
  const [Title, setTitle] = useState('');

  console.log('Rendering INGREDIENT FORM');
  
 


  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient(
      {title: Title, amount:Amount});
  };
 

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"  
              value={Title} 
              onChange={event => setTitle(event.target.value)}
            />

          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" 
              id="amount"  
              value={Amount}
              onChange={event => setAmount(event.target.value)}
              />

          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
