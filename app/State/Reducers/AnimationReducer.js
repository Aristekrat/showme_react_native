'use strict';

function animationReducer(state = false, action) {
	switch(action.type) {
		case "toggleAnimating":
			return !state;
		case "setAnimating":
			return action.value;
	}

  return state;
}

export default animationReducer;