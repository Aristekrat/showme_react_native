'use strict';

function isConnectedReducer(state = true, action) {
	switch(action.type) {
		case "isConnected":
			return action.value
	}

  return state;
}

export default isConnectedReducer;
