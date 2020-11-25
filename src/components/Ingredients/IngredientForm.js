import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {


  const [input, setInput] = useState({title: '', amount:''});
  console.log(input);


  const submitHandler = event => {
    event.preventDefault();
    // ...
  };
 

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"  
              value={input.title} 
              onChange={event => setInput(
                  (prevInputState)=>{//get latest state even if not still commited
                    const newTitle = event.target.value;
                    return {title: newTitle, amount: prevInputState.amount}//guarante latest state
                  }

                )}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" 
              id="amount"  
              value={input.amount}
              onChange={event => setInput(
                (prevInputState)=>{//get latest state even if not still commited
                  const newAmount = event.target.value;
                  return {title: prevInputState.title, amount: newAmount}//guarante latest state
                }

              )}
              />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
