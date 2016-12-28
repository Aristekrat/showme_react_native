'use strict';

function updatedSecretsReducer(state = {}, action) {
  let updatedSecretsHash = Object.assign({}, state);
	switch(action.type) {
		case "addUpdatedSecret":
      if (!updatedSecretsHash[action.value]) {
        updatedSecretsHash[action.value] = true;
      }
      return updatedSecretsHash;
    case "multipleUpdatedSecrets":
      return Object.assign(state, action.value);
		case "removeUpdatedSecret":
      delete updatedSecretsHash[action.value];
			return updatedSecretsHash;
	}

  return updatedSecretsHash;
}

export default updatedSecretsReducer;
