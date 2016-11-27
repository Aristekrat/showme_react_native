'use strict';

function secretCodeReducer(state = "", action) {
  switch(action.type) {
    case "secretCode":
      return action.value
  }

  return state;
}

export default secretCodeReducer;