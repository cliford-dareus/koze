import MultiChoice from "./_components/multi-choice";
import { getRandomFacts } from "@/app/_actions/translate";
import TextToSpeechWithVirsual from "@/app/_components/text-to-speech-with-virsual";

type Props = {};

const Listening = async (props: Props) => {
  const randomFact = await getRandomFacts();

  if (randomFact === null) return;

  return (
    <div className="w-full h-full relative">
      <div className="rounded-lg flex flex-col justify-between p-4 h-[30vh] bg-primary-gradient">
        <h1 className="font-bold text-xl">Listening Carefully</h1>
        <TextToSpeechWithVirsual classname="h-[80px]" randomFact={randomFact?.text} />
      </div>

      <div className="mt-4">
        <div className="">
          <h2 className="font-bold">What did you hear?</h2>
          <p className="text-slate-300">Choose the correct sentence</p>
        </div>

        <div className="">
          <MultiChoice quote={randomFact?.text} />
        </div>
      </div>
    </div>
  );
};

export default Listening;
