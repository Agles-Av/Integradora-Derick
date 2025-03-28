export const authManager = (
    state = {
        signed: false,
        user: null
    },
    action
) => {
    switch (action.type) {
        case "SIGN_IN":
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            return {
                ...state,
                signed: true,
                user: action.payload
            }
        case "SIGN_OUT":
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return {
                signed: false,
                user: null
            }
        default:
            return state;
    }
}