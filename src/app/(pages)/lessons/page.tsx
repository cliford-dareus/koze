import Link from 'next/link' 
type Props = {};

const Lessons = (props: Props) => {
  return (
    <div className="h-full">
      <div className="">
        <h1 className="">Lessons</h1>
      </div>

      <div className="">
        {
           // lesson in a the all the Lessons
          [1,2,3].map((number) => (
            <div className="p-4 h-[50px] bg-gradient-to-br from-indigo-500 to-slate-500 mt-4 rounded-md">
              <Link href={`/lessons/lesson-${number}`}>lesson{number}</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Lessons;
