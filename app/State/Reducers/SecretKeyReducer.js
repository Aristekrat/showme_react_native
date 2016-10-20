'use strict';

function secretKeyReducer(state = null, action) {
	switch(action.type) {
		case "secretKey":
			return action.key
	}

  return state;
}

export default secretKeyReducer;