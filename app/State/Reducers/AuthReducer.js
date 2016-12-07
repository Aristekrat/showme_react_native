'use strict';

function authReducer(state = false, action) {
	switch(action.type) {
		case "setAuth":
      return action.value;
	}

  return state;
}

export default authReducer;
