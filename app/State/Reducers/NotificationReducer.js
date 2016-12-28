'use strict';

function notificationsReducer(state = 0, action) {
	switch(action.type) {
		case "incrementNotifications":
      return state + action.value;
		case "decrementNotifications":
      if (state - action.value > 0) {
        return state - action.value;
      } else {
        return 0;
      }
    case "setNotifications":
      return action.value; 
    case "removeNotifications":
      return 0;
	}

  return state;
}

export default notificationsReducer;
