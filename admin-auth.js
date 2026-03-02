(function () {
  const ADMIN_LOGIN_URL = 'login.html?admin=1';

  function redirectToAdminLogin() {
    if (window.location.pathname.toLowerCase().includes('login.html')) {
      return;
    }
    window.location.replace(ADMIN_LOGIN_URL);
  }

  async function resolveAdminAccess() {
    try {
      const [{ auth, db }, authModule, firestoreModule] = await Promise.all([
        import('./firebase-config.js'),
        import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js')
      ]);

      const { onAuthStateChanged, signOut } = authModule;
      const { doc, getDoc } = firestoreModule;

      window.__adminLogout = async function adminLogout() {
        try {
          await signOut(auth);
        } catch (_error) {
        } finally {
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('role');
          window.location.replace(ADMIN_LOGIN_URL);
        }
      };
      window.adminLogout = window.__adminLogout;

      const user = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          unsubscribe();
          resolve(currentUser || null);
        });
      });

      if (!user) {
        redirectToAdminLogin();
        return;
      }

      const [idTokenResult, userDocSnapshot] = await Promise.all([
        user.getIdTokenResult(),
        getDoc(doc(db, 'users', user.uid))
      ]);

      const isAdminByClaim = idTokenResult?.claims?.admin === true;
      const isAdminByDoc = userDocSnapshot.exists() && String(userDocSnapshot.data()?.role || '').toLowerCase() === 'admin';

      if (!isAdminByClaim && !isAdminByDoc) {
        await window.__adminLogout();
        return;
      }

      localStorage.setItem('loggedIn', '1');
      localStorage.setItem('role', 'admin');
    } catch (_error) {
      redirectToAdminLogin();
    }
  }

  resolveAdminAccess();
})();
