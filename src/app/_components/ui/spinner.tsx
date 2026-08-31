import { clsx } from "clsx";
import React from "react";

type Props = {
    classnames?: string;
};

const Loader = ({ classnames }: Props) => {
    return (
        <div className={clsx("loader relative w-[200px] h-[140px]", classnames)}>
            <div className="relative z-1 w-full h-full rounded-[13px] perspective-600 shadow-[0_4px_6px_rgba(39,94,254,0.28)] bg-[linear-gradient(135deg,#23C4F8,#275EFE)]">
                
            </div>
            <span className="block absolute left-0 right-0 top-[100%] mt-[20px] text-center text-[#6C7486]">
                Loading
            </span>
        </div>
    );
};

export default Loader;
