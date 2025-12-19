
import React from "react";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white/20 dark:bg-black/30 backdrop-blur-xl flex flex-col items-center justify-center">
            <div
                className="w-20 h-20 rounded-full border-8 border-black/20 dark:border-white/20 animate-spin"
                style={{ borderTopColor: "#06b6d4" }}
            />
            <p className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">
                Loading, Please wait...
            </p>
        </div>
    );
};

export default Loader;

