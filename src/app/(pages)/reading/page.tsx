import { getQuote } from "@/_actions/translate";
import { Transcriber } from "@/components/providers/transcribe-provider";
import SpeechToText from "@/components/speech-to-text";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {};

const Reading = async (props: Props) => {
  const randomQuote = await getQuote();

  if (randomQuote === null) return;

  return (
    <Transcriber>
      <div className="h-[50vh] flex flex-col justify-between">
        <div></div>
        <div className="flex flex-col items-center p-4 max-h-[40vh] rounded-lg border border-slate-200 mt-auto justify-center overflow-y-auto">
          <p className="text-xl font-medium text-center">
            {randomQuote?.quote}
          </p>
        </div>
        <div className="flex flex-col mt-auto">
          {/* <div className="">Read the quote outloud</div> */}
          <div className="w-full mt-4 h-[30px]">
            <SpeechToText />
          </div>
        </div>
      </div>
    </Transcriber>
  );
};

export default Reading;
