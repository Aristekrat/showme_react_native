'use strict';

function contactsPermissionReducer(state = true, action) {
	switch(action.type) {
		case "updateContactsPermission":
			return action.value
	}

  return state;
}

export default contactsPermissionReducer;
