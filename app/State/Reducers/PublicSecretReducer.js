
export default function publicReducer(state = false, action) {
	switch(action.type) {
		case "togglePublicSecret":
			return !state;
	}

  return state;
}
