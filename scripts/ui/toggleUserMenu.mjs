const userMenuButton = document.getElementById('user-menu-button');
const dropdownMenu = document.getElementById('dropdown-menu');

userMenuButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('hidden');
  const expanded = userMenuButton.getAttribute('aria-expanded') === 'true' || false;
  userMenuButton.setAttribute('aria-expanded', !expanded);
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  if (!userMenuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add('hidden');
    userMenuButton.setAttribute('aria-expanded', 'false');
  }
});