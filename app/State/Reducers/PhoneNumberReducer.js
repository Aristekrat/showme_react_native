'use strict';

function phoneNumberReducer(state = "", action) {
	switch(action.type) {
		case "phoneNumber":
			return action.phoneNumber
	}

  return state;
}

export default phoneNumberReducer;