import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} DevFlow. Developed by{' '}
          <a
            href="https://github.com/shahirislam"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Shahir Islam
          </a>
          .
        </p>
        <div className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <a
                href="https://github.com/shahirislam/dev-note"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
            >
                Open for contributions on GitHub
            </a>
        </div>
      </div>
    </footer>
  );
}
