import Image from "next/image";
import Link from "next/link";
import Translate from "../../public/language-translator.png";
import Reading from "../../public/book.png";
import Listening from "../../public/music-app.png";
import Loader from "@/components/ui/spinner";

export default function Home() {
  return (
    <div className="p-4 h-full flex flex-col justify-between pb-[15dvh]">
      <div className="">
        <h1 className="text-4xl font-bold w-[80%] mt-14">
          Hello, Welcome Back
        </h1>
      </div>

      <div>
        <div className="mt-4 grid auto-rows-[10vh] grid-cols-2 gap-4 mx-auto grid-rows-5">
          <div className=" bg-slate-100 row-span-2 rounded-lg shadow-md relative ">
            <Link className="w-full h-full absolute inset-0 p-2 overflow-hidden" href="/translation">
              <p className="font-bold">TRANSLATE</p>
              <Image className="absolute -bottom-3  object-cover w-full h-full" src={Translate}  alt="translate" />
            </Link>
          </div>
          <div className="h-[10vh] rounded-lg shadow-md bg-indigo-500">
            <Link href="/lessons">
              <p className="font-bold">LESSONS</p>
            </Link>
          </div>
          <div className=" bg-slate-100 row-span-2 rounded-lg shadow-md relative ">
            <Link className="w-full h-full absolute inset-0 p-2 overflow-hidden"  href="/reading">
              <p className="font-bold">READING</p>
              <Image className="absolute -bottom-3 -right-5 object-cover w-full h-full" src={Reading} width={100} height={100} alt="translate" />
            </Link>
          </div>
          <div className=" bg-slate-100 row-span-2 rounded-lg shadow-md relative ">
            <Link className="w-full h-full absolute inset-0 p-2 overflow-hidden"  href="/listening">
              <p className="font-bold">LISTENING</p>
              <Image className="absolute -bottom-5 object-cover w-full h-full" src={Listening} width={100} height={100} alt="translate" />
            </Link>
          </div>
          <div className=" bg-slate-100 row-span-2 rounded-lg shadow-md relative ">
            <Link className="w-full h-full absolute inset-0 p-2 overflow-hidden"  href="/chat">
              <p className="font-bold">AI CHAT</p>
              <Image className="absolute inset-0 object-cover w-full h-full "  src={Translate} width={100} height={100} alt="translate" />
            </Link>
          </div>
          <div className=" bg-blue-400 rounded-lg shadow-md"></div>
        </div>
      </div>
    </div>
  );
}
