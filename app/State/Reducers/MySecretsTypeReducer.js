'use strict';

function mySecretsTypeReducer(state = "NR", action) {
  switch(action.type) {
    case "mst":
      return action.value
  }

  return state;
}

export default mySecretsTypeReducer;