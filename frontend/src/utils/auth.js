export const getuser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : null;
  return token && role ? { token, role, username } : null;
};
export const logout = () => {
  const check = confirm("Just confirming, you're logging out....... ?");
  if (check) {
    localStorage.clear();
    window.location.href = "/login";
  }

  return;
};
