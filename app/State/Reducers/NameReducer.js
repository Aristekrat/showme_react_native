'use strict';

function nameReducer(state = "", action) {
	switch(action.type) {
		case "name":
			return action.text
	}

  return state;
}

export default nameReducer;
