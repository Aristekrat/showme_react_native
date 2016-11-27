'use strict';

function errorReducer(state = "", action) {
	switch(action.type) {
		case "addError":
			return action.text
		case "removeError":
			return ""
	}

  return state;
}

export default errorReducer;