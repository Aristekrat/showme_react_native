'use strict';

function formInputReducer(state = "", action) {
	switch(action.type) {
		case "formInput":
			return action.text
	}

  return state;
}

export default formInputReducer;