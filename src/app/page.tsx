import { getRandomWord } from "./_actions/translate";
import { LandingPage } from "./_components/landing-page";

export default async function Home() {
    const Word = await getRandomWord();
    return (
        <div className="app-shell">
            <LandingPage word={Word} />
        </div>
    );
}
