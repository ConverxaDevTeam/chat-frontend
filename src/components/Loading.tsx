import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import classes from "./Loading.module.css";

const Loading = () => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: ReturnType<typeof lottie.loadAnimation> | null = null;

    if (lottieContainerRef.current) {
      animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/Loading_sofia.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      });

      animation.setSpeed(50);
    }

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.lottieContainer} ref={lottieContainerRef}></div>
    </div>
  );
};

export default Loading;
