export default function Footer() {
    return (
    <footer className="app-footer">
      <div className="footer-left">
        <span>© {new Date().getFullYear()} DiTech Inc. Maintenance Dashboard</span>
      </div>

      <div className="footer-center">
        <span>v1.0.0</span>
      </div>

      <div className="footer-right">
        <a href="#">Help</a>
        <a href="#">Support</a>
        <a href="#">Privacy</a>
      </div>
    </footer>
  );
}