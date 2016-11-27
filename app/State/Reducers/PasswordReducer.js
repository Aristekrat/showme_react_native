'use strict';

function passwordReducer(state = "", action) {
  switch(action.type) {
    case "password":
      return action.value
  }

  return state;
}

export default passwordReducer;