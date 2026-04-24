import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import { CTAClosing } from "@/components/sections/CTAClosing";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Features />
      <Pricing />
      <CTAClosing />
    </>
  );
}
