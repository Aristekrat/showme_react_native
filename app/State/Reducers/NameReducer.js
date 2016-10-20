'use strict';

function nameReducer(state = "", action) {
	switch(action.type) {
		case "firstName":
			return action.text
	}

  return state;
}

export default nameReducer;