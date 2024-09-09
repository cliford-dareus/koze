import Image from "next/image";
import Link from "next/link";
import Translate from "../../public/language-translator.png";
import Reading from "../../public/book.png";
import Listening from "../../public/music-app.png";
import Loader from "@/components/ui/spinner";

const MENU = [
  {
    id: 1,
    name: "Translate",
    link: "translation",
    stat: 100,
    image: Translate,
  },
  { id: 2, name: "Reading", link: "reading", stat: 300, image: Reading },
  { id: 3, name: "Listening", link: "listening", stat: 300, image: Listening },
  { id: 4, name: "Conversation", link: "chat", stat: 3, image: Translate },
];

export default function Home() {
  // Get the menu data

  return (
    <div className="p-4 h-full flex flex-col gap-4  pb-[15dvh] bg-landing-gradient">
      <div className="mt-auto">
        <h1 className="text-5xl font-bold">Let's learn together !</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="">Your Activities</p>
        <div className=""></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MENU.map((menu) => (
          <div
            key={menu.id}
            className="row-span-2 relative h-[135px] bg-[rgba(76,190,225,0.59)] rounded-lg shadow-lg backdrop-blur-[5.5px] border border-[#4cbee1] border-opacity-20"
          >
            <Link
              className="w-full h-full absolute inset-0 p-4 overflow-hidden flex flex-col"
              href={menu.link}
            >
              <div className="w-[60px] h-[60px]">
                <Image className="" src={menu.image} alt="translate" />
              </div>

              <div className="mt-auto">
                <h3 className="font-bold">{menu.name}</h3>
                <p className="text-xs">10 word Translated</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="h-[50px] bg-accent-foreground rounded-lg"></div>
    </div>
  );
}
