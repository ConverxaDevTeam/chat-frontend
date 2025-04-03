import { useEffect, useRef } from "react";
import classes from "./Loading.module.css";

interface LottiePlayer {
  loadAnimation: (params: {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    path: string;
    rendererSettings?: {
      preserveAspectRatio?: string;
    };
  }) => any;
}

declare global {
  interface Window {
    lottie?: LottiePlayer;
  }
}

const Loading = () => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: any = null;
    
    const loadLottie = async () => {
      if (typeof window.lottie === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js';
        script.async = true;
        
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
      
      if (lottieContainerRef.current && window.lottie) {
        animation = window.lottie.loadAnimation({
          container: lottieContainerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/animations/Loading_sofia.json',
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        });
        
        animation.setSpeed(50);
      }
    };
    
    loadLottie();
    
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
