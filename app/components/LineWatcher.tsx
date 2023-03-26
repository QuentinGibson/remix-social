import React, { useRef, useEffect, useState } from "react";

interface Props {
  onAboveLine: () => void;
  linePosition: number;
}

const LineWatcher = ({ linePosition, seen, children }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.bottom < linePosition) {
        }
      }
    };

    if (!seen) window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [linePosition, seen]);

  return <div ref={ref}>{children}</div>;
};

export default LineWatcher;
