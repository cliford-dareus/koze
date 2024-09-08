import { getQuote } from "@/_actions/translate";
import { Transcriber } from "@/components/providers/transcribe-provider";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import React from "react";
import ReadingManager from "./_components/reading-manager";
import TextToSpeechWithVirsual from "@/components/text-to-speech-with-virsual";

type Props = {};

const Reading = async (props: Props) => {
  const randomQuote = await getQuote();

  if (randomQuote === null) return;

  return (
    <Transcriber>
      <div className="flex flex-col">
        <div className="rounded-lg flex flex-col py-8 px-4 bg-primary-gradient">
          <h1 className="font-bold text-slate-300 leading-4">
            Repeat <br /> Pronunciation
          </h1>
          <p className="font-bold text-xl leading-5 text-center mt-4">
            {randomQuote?.quote}
          </p>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-accent-muted bg-secondary-gradient shadow-sm">
          <h2 className="font-bold">Listen</h2>
          <div className="mt-4 flex  gap-4 items-center">
            <TextToSpeechWithVirsual classname="h-[30px] w-[60%]" randomFact={randomQuote?.quote} />
          </div>
        </div>

        <div className="w-full flex justify-center mt-8">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-[50%] font-bold">Start Reading</Button>
            </DrawerTrigger>

            <DrawerContent className="bg-primary-gradient border-none pt-8 pb-20">
              <ReadingManager quote={randomQuote?.quote} />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </Transcriber>
  );
};

export default Reading;
