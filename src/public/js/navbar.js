function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.toggle-btn');
  sidebar.classList.toggle('active');
  toggleBtn.classList.toggle('active');
}