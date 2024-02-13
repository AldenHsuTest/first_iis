import { ScrollTrigger, ScrollToPlugin } from 'gsap/all';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function setupGsap(AppInstance) {
  AppInstance.provide('$gsap', gsap);
}
