import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cric-red flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-foreground">CRIC</span>
              <span className="text-cric-red">FLASH</span>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="footer.link"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="footer.link"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="footer.link"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {year} CricFlash. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cric-red transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
