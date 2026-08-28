import { Button } from "@/components/ui/button";
import { ISubcategory } from "@/models/Subcategory";
import Link from "next/link";

export default function Links({ subs }: { subs: ISubcategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      {/* Subcategories */}
      <div className="spcae-y-4">
        <h1 className="text-lg font-bold">Find it Fast</h1>
        <ul className="flex flex-col items-start">
          {subs.map((sub) => (
            <li key={sub._id.toString()}>
              <Button variant="link" asChild>
                <Link href={`/browse?subcategory=${sub.url}`}>
                  <span>{sub.name}</span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* Profile links */}
      <div>
        <h1 className="text-lg font-bold">Quick Links</h1>
        <ul className="flex flex-col items-start">
          {footer_links.slice(0, 6).map((link, i) => (
            <li key={i}>
              <Button variant={"link"} asChild>
                <Link href={link.link}>{link.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer care */}
      <div>
        <h1 className="text-lg font-bold">Customer care</h1>
        <ul className="flex flex-col items-start">
          {footer_links.slice(6).map((link, i) => (
            <li key={i}>
              <Button variant={"link"} asChild>
                <Link href={link.link}>{link.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
const footer_links = [
  {
    title: "About",
    link: "/about"
  },
  {
    title: "Contact",
    link: "/contact"
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist"
  },
  {
    title: "Compare",
    link: "/compare"
  },
  {
    title: "FAQ",
    link: "/faq"
  },
  {
    title: "Store Directory",
    link: "/profile"
  },
  {
    title: "My Account",
    link: "/profile"
  },
  {
    title: "Track your Order",
    link: "/track-order"
  },
  {
    title: "Customer Service",
    link: "/customer-service"
  },
  {
    title: "Returns/Exchange",
    link: "/returns-exchange"
  },
  {
    title: "FAQs",
    link: "/faqs"
  },
  {
    title: "Product Support",
    link: "/product-support"
  }
];
