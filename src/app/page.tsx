import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4 h-full flex flex-col justify-between pb-[15dvh]">
      <div className="">
        {/* <span className="text-xl font-bold">Dashboard</span> */}
        <h1 className="text-4xl font-bold w-[80%] mt-14">
          Hello, Welcome Back
        </h1>
      </div>

      <div>
        <div className="mt-4 grid auto-rows-[10vh] grid-cols-2 gap-4 mx-auto grid-rows-5">
          <div className=" bg-emerald-400 row-span-2 rounded-lg">
            <Link href="/translation">Translate</Link>
          </div>
          <div className="h-[10vh] bg-emerald-400 rounded-lg"></div>
          <div className=" bg-emerald-400 row-span-2 rounded-lg">
            <Link href="/reading">Reading</Link>
          </div>
          <div className=" bg-emerald-400 row-span-2 rounded-lg">
            <Link href="/reading">Listening</Link>
          </div>
          <div className=" bg-emerald-400 row-span-2 rounded-lg">
            <Link href="/reading">AI CHAT</Link>
          </div>
          <div className=" bg-emerald-400 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
