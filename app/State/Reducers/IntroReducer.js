'use strict';

function introReducer(state = true, action) {
	switch(action.type) {
		case "intro":
			return action.value
	}

  return state;
}

export default introReducer;