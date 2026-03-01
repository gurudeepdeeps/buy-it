(function () {
  const isLoggedIn = localStorage.getItem('loggedIn') === '1';
  const role = localStorage.getItem('role');

  if (!isLoggedIn || role !== 'admin') {
    window.location.href = 'login.html';
  }
})();
