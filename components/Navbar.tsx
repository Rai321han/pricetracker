import Image from "next/image";
import Link from "next/link";
import TelegramLogin from "./TelegramLogin";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
];

export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo-new.svg"
            width={27}
            height={27}
            alt="logo"
          />
          <p className="text-primary nav-logo">PriceTracker</p>
        </Link>

        <div className="flex items-center gap-5">
          <TelegramLogin />
          {navIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
