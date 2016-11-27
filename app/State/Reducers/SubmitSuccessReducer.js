
export default function submitSuccessReducer(state = false, action) {
	switch(action.type) {
		case "submitSuccess":
			return action.value;
	}

  return state;
}
