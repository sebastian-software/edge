export const SET_ENV = "env/SET"

/**
 * Selector for accessing the env values from inside the global state.
 *
 * @param {state} state Global Redux state.
 */
export function getEnv(state) {
  return state.env
}

/**
 * Action creator for setting the env values.
 *
 * @param {number} value New values to set for the env.
 */
export function setEnv(value) {
  return { type: SET_ENV, value }
}

const initialState = { }


/**
 * Reducer for all env relevant action types.
 *
 * @param previousState Previous state object of this reducer.
 * @param {string} action Action to process.
 */
export function envReducer(previousState = initialState, action)
{
  switch (action.type)
  {
    case SET_ENV:
      return { ...previousState, ...action.value }

    default:
      return previousState
  }
}
