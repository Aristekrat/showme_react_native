'use strict';

function modalTextReducer(state = "", action) {
	switch(action.type) {
		case "modalText":
			return action.text
	}

  return state;
}

export default modalTextReducer;