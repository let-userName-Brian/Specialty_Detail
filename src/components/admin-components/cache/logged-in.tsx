export let loggedInUser = false;

export const loggedInUserSetter = (user: any | null) => {
  if (user) {
    loggedInUser = true;
  } else {
    loggedInUser = false;
  }
};
