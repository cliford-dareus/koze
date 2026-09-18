import { clsx } from "clsx";
import React from "react";

type Props = {
    classnames?: string;
};

const Loader = ({ classnames }: Props) => {
    return (
        <div className={clsx("loader relative w-[200px] h-[140px]", classnames)}>
            <div className="relative z-1 w-full h-full rounded-[13px] perspective-600 shadow-soft bg-gradient-to-br from-primary to-primary/70">
            </div>
            <span className="block absolute left-0 right-0 top-[100%] mt-[20px] text-center text-muted-foreground">
                Loading
            </span>
        </div>
    );
};

export default Loader;
