export const setThemeClass = (theme: string) => {
  const themeElement = document.querySelector(".theme") as HTMLElement;
  if (theme === "light" && themeElement) {
    themeElement.style.setProperty("--1", "#fafafa");
    themeElement.style.setProperty("--2", "#ffffff");
    themeElement.style.setProperty("--3", "#ebebeb");
    themeElement.style.setProperty("--4", "#020202");
  } else if (theme === "dark" && themeElement) {
    themeElement.style.setProperty("--1", "#1e1f24");
    themeElement.style.setProperty("--2", "#2f2f37");
    themeElement.style.setProperty("--3", "#424246");
    themeElement.style.setProperty("--4", "#fefefe");
  }
};

export const getTheme = () => {
  return localStorage.getItem("theme") || "light";
};
