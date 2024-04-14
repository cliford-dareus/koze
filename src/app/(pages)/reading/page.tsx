import React from "react";

type Props = {};

const Reading = (props: Props) => {
  return (
    <div className="h-[50vh] flex flex-col justify-between">
      <div className="flex flex-col items-center p-4 rounded-lg border border-slate-700 mt-auto justify-center">
        <p className="text-3xl font-medium text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
          tempore.
        </p>
      </div>
      <div className="flex flex-col mt-auto">
        <div className="text-xl ">What do you want to read?</div>
        <div className="w-full mt-4 h-[30px]">
          <input type="text" className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Reading;
