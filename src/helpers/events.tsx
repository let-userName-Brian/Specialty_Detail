import ReactGA from "react-ga";

export const logEventToGA = (
  category: string,
  action: string,
  label: string
) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
