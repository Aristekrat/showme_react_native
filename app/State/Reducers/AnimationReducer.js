'use strict';

/*
const initialState = {
  "isAnimating": false
}
*/

function animationReducer(state = false, action) {
	switch(action.type) {
		case "animating":
			return !state
	}

  return state;
}

export default animationReducer;