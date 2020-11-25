import {useReducer, useCallback} from 'react';
const httpReducer = (curState, action) => {//HERE MANAGE THE STATE
    switch (action.type) {
      case 'SEND':
        return {...curState, loading: true, data:null, extra:null, identifier:action.identifier};
      case 'RESPONSE':
        return  {...curState, loading: false, data: action.data, extra:action.extra, identifier:action.identifier}
      case 'ERROR':
        return  {loading:false,  error: action.error, data:null}
      default:
        throw new Error('Should not get there!');
    }
};


const useHttp = () => {//execute this code when is re-render that implements the hook
    //each functinal component get a diferent snapshot
    const [httpState, dispatchHttp] =  useReducer(httpReducer, {
        loading:false,
        data:null,
        identifier: null,
        extra:null,
        error:null});
    
    const sendRequest = useCallback((url, method, body, extra, reqidentifier) => {
        dispatchHttp({type: 'SEND', identifier: reqidentifier})
        fetch(
            url,
            {
              method: method,
              body: body,
              headers: {'Content-Type': 'application/json'}
            }
          )
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
            dispatchHttp({type: 'RESPONSE', data: responseData, extra: extra});
        })
        .catch(error => {
            dispatchHttp({type: 'ERROR', error:error});

        });
    }, [])


    return {
        isLoading:httpState.loading,
        data: httpState.data,
        error: httpState.error, 
        sendRequest: sendRequest,
        reqExtra:httpState.extra,
        identifier:httpState.identifier
    };//return what we need


  
};

export default useHttp;