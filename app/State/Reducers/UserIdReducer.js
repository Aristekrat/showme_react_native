'use strict';

function userIdReducer(state = null, action) {
	switch(action.type) {
		case "userId":
			return action.uid
	}

  return state;
}

export default userIdReducer;