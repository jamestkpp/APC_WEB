document.addEventListener('DOMContentLoaded', function(){
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  if (!banner || !acceptBtn) return;
  if (localStorage.getItem('cookieAccepted')) {
    banner.classList.add('hidden');
  }
  acceptBtn.addEventListener('click', function(){
    localStorage.setItem('cookieAccepted', 'true');
    banner.classList.add('hidden');
  });
});
