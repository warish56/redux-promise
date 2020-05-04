


const setSuccess = (dispatch, actionType, response) => {
    dispatch({type: `${actionType}_SUCCESS`, payload:response});
   //  dispatch({type: `${actionType}_PROGRESS_COMPLETED`});

}


const setFailed = (dispatch, actionType, error) => {


   dispatch({type: `${actionType}_FAILED`, error });
   // dispatch({type: `${actionType}_PROGRESS_COMPLETED`});


}


const setStart = (dispatch,updateAction = '') => {

return (actionType) => {
   dispatch({type: `${actionType}`});

   if(typeof updateAction === 'function'){
   // dispatch({type: `${actionType}_PROGRESS_STARTED`});
   updateAction(actionType);
   }
}
}


 const middleware = (store) => (next) => (actionFunction) => {


if(typeof actionFunction === 'function'){
const wrappedFunc =  (dispatch) => {

   let action  = '';

   const promise = new Promise(async (resolve, reject) => {


      
       const result = actionFunction(dispatch, setStart(dispatch, (type) => {action = type;}));


       if( result && typeof result.then === 'function' ){

           result.then((res=true) => {    

               if(res.errors){
                   throw new Error(JSON.stringify(res.errors));
               }
               
               setSuccess(dispatch, action, res);
               resolve(res);
            })
            .catch((err='') => {
               setFailed(dispatch,action,err)
                reject(err);
            })
       }else{
           resolve(true);
       }
   })
  return promise;
}

return next(wrappedFunc);
}else{
 return next(actionFunction);
}

}
;



module.exports = middleware;