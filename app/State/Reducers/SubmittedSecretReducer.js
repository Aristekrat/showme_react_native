
export default function submittedSecretReducer(state = {}, action) {
	switch(action.type) {
		case "submittedSecret":
			return action.value;
	}

  return state;
}
