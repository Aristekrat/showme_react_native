'use strict';

function displaySkipReducer(state = false, action) {
	switch(action.type) {
		case "displaySkip":
			return action.value
	}

  return state;
}

export default displaySkipReducer;
