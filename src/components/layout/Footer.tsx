import Link from 'next/link';
import { Github, Heart } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} DevDiary. Developed by{' '}
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
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" disabled>
                <Heart className="mr-2 h-4 w-4" />
                Donate
            </Button>
            <Button variant="outline" size="sm" asChild>
                <a
                    href="https://github.com/shahirislam/dev-note"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="mr-2 h-4 w-4" />
                    Contribute
                </a>
            </Button>
        </div>
      </div>
    </footer>
  );
}
