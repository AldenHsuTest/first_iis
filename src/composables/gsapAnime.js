import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 回到頂部
export const useBackTop = () => {
  gsap.to(window, { duration: 1, scrollTo: 0, ease: 'power4' });
};
