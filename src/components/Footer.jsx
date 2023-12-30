import { GithubIcon } from "./Icons.jsx";

export default function Footer() {
  return (
    <footer className="flex place-content-center py-8 bg-gray-50">
      <a href="https://github.com/jeroldleung/webmpm">
        <GithubIcon size="w-8 h-8" />
      </a>
    </footer>
  );
}
