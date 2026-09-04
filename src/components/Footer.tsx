"use client";

import Link from "next/link";

// ✅ Create custom SVG icons — NO IMPORT ISSUES EVER
const Icons = {
  GitHub: (props: any) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  Instagram: (props: any) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  LinkedIn: (props: any) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Mail: (props: any) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Shop All", href: "/collections/shop-all" },
      { label: "Best Products", href: "/collections/best-products" },
      { label: "Sale", href: "/collections/sale" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Returns", href: "/returns" },
      { label: "Shipping", href: "/shipping" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const socialLinks = [
  {
    icon: Icons.GitHub,
    href: "https://github.com/Zurriyatt/Zurriyatt",
    label: "GitHub",
  },
  {
    icon: Icons.Instagram,
    href: "https://instagram.com/zurriyat.fx",
    label: "Instagram",
  },
  {
    icon: Icons.LinkedIn,
    href: "https://www.linkedin.com/in/zurriyat-dev-3a90b941b/",
    label: "LinkedIn",
  },
  {
    icon: Icons.Mail,
    href: "mailto:zurriyat.dev@proton.me",
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="w-[97vw] border-t border-border bg-bgPrimary/50 backdrop-blur-sm mt-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Top Section: Logo + Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8 border-b border-border/50">
          <div className="flex items-end gap-1">
            <span className="font-serif text-2xl font-light tracking-[-0.04em] text-active">
              Zen
            </span>
            <span className="font-sans text-2xl font-medium tracking-[-0.02em] text-textPrimary">
              finith
            </span>
          </div>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-bgSecondary border border-border/50 transition-all duration-200 hover:border-primary/20 hover:scale-105"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-textSecondary/70 hover:text-textPrimary transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-textSecondary/70 hover:text-textPrimary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-textSecondary/60">
          <p>
            © {new Date().getFullYear()} Zenfinith. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/Zurriyatt/Zurriyatt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Zurriyat Dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}