import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [Filter, setFilter] = useState('');
  const inputRef= useRef();

  useEffect(() => {//execute code when changed
     
    const timer = setTimeout(() => {//have the 500ms old value, vs Actual value 
        //because of closure
        if(Filter === inputRef.current.value){
          const query =
          Filter.length === 0
              ? ''
              : `?orderBy="title"&equalTo="${Filter}"`;
          fetch('https://hooks-update-b6ae0.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {

            const loadedIngredients = [];
            for(const key in responseData) {
              loadedIngredients.push({
                id:key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
        }
    }, 500);

    //cleanup function... run before compnent get updatedfor the first time ... componentUmount
    return () => {
      clearTimeout(timer);
    }

  }, [Filter, onLoadIngredients, inputRef]);
  
  
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
            value={Filter}
            ref={inputRef}
            onChange={event => setFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
