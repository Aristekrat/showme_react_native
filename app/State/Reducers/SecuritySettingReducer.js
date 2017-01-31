'use strict';

function securitySettingReducer(state = false, action) {
	switch(action.type) {
		case "setSecurityLevel":
			return action.value
	}

  return state;
}

export default securitySettingReducer;
