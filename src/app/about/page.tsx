import React from 'react';
import { Globe, AudioWaveform, Database, LayoutTemplate } from 'lucide-react';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiX,
  SiGithub,
  SiBuymeacoffee,
} from 'react-icons/si';
import { EmailCopyButton } from './_components/EmailCopyButton';

export default function AboutPage() {
  const lastUpdate = process.env.NEXT_PUBLIC_LAST_UPDATED || 'Unknown';

  return (
    <main className="mx-auto min-h-[var(--content-height-full)] w-full max-w-3xl space-y-32 px-6 py-20 md:py-32">
      {/* 1. Hero & Philosophy */}
      <section className="animate-in fade-in slide-in-from-bottom-4 space-y-16 duration-1000">
        <div className="space-y-6">
          <h1 className="text-foreground text-5xl leading-[1.1] font-black tracking-tighter md:text-6xl">
            Visualizing
            <br />
            <span className="text-primary">Hidden Structures.</span>
          </h1>
          <p className="text-secondary-foreground max-w-2xl text-xl leading-relaxed md:text-2xl">
            From "memorization" to "geometry" in music theory.
            <br />A new compass that visualizes the gravity of sound.
            {/* 音楽理論を「暗記」から「幾何学」へ。<br />
            音の重力を可視化する、新しい羅針盤。 */}
          </p>
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-foreground text-lg font-bold">Why Circle?</h2>
            <p className="text-secondary-foreground leading-relaxed">
              Music is in a cycle. The octave's identity, the circle of fifths' eternal return.
              <br />
              The circular structure conceals the "gravitational relationship" between notes, which
              is not apparent in the linear arrangement of keys.
              <br />
              Harmonic Orbit places the circle at its center, expressing the harmony of music in the
              most natural way.
              {/* 音楽は循環の中にあります。オクターブの同一性、五度圏の永遠の回帰。<br />
              直線的な鍵盤の並びだけでは見えてこない、音と音の「重力関係」が円環構造には隠されています。<br />
              Harmonic Orbitは円（Circle）を中心据え、音楽の調和（Harmony）を最も自然な形で表現します。 */}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-foreground text-lg font-bold">What is Atlas?</h2>
            <p className="text-secondary-foreground leading-relaxed">
              An atlas is a guide for navigating the vast ocean of music theory.
              <br />
              It's not just a glossary, but a "map of knowledge" that visualizes concepts and their
              relationships.
              <br />
              It serves as a compass to guide fragmented knowledge towards a systematic
              understanding.
              {/* Atlas（地図帳）は、広大な音楽理論の海を航海するための道標です。<br />
              単なる用語集ではなく、概念と概念の関係性を可視化した「知の地図」。<br />
              あるコードがどのスケールに属し、そのスケールがどのキーと親和性を持つのか。<br />
              断片的な知識を体系的な理解へと導くための羅針盤となります。 */}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Connect & Links */}
      <section className="space-y-6 md:space-y-8">
        <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Connect
        </h2>
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <LinkItem
            href="https://x.com/lyreon_x"
            icon={<SiX className="h-4 w-4" />}
            label="X (Twitter)"
          />
          <LinkItem
            href="https://github.com/endo-ava/harmonic-orbit"
            icon={<SiGithub className="h-4 w-4" />}
            label="GitHub"
          />
          <LinkItem
            href="https://lyreonworks.com/"
            icon={<Globe className="h-4 w-4" />}
            label="Brand HP"
          />
          <LinkItem
            href="https://buymeacoffee.com/lyreonworks"
            icon={<SiBuymeacoffee className="h-4 w-4" />}
            label="Buy Me a Coffee"
          />
        </div>
      </section>

      {/* 3. Tech Stack */}
      <section className="space-y-6 md:space-y-8">
        <h2 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Built with
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-6">
          <TechItem icon={<SiNextdotjs />} name="Next.js" />
          <TechItem icon={<SiReact />} name="React" />
          <TechItem icon={<SiTypescript />} name="TypeScript" />
          <TechItem icon={<SiTailwindcss />} name="Tailwind CSS" />
          <TechItem icon={<AudioWaveform />} name="Tone.js" />
          <TechItem icon={<Database />} name="Zustand" />
          <TechItem icon={<SiFramer />} name="Framer Motion" />
          <TechItem icon={<LayoutTemplate />} name="Shadcn UI" />
        </div>
      </section>

      {/* 4. Contact */}
      <section className="flex flex-col items-center justify-center space-y-6 py-16 text-center md:py-24">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Drop a line to the void
        </p>
        <div className="">
          <a
            href="mailto:hello@lyreonworks.com"
            className="text-foreground hover:text-accent text-xl underline-offset-4 transition-colors hover:underline"
          >
            hello@lyreonworks.com
          </a>
          <EmailCopyButton email="hello@lyreonworks.com" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border/30 text-muted-foreground space-y-2 border-t pt-12 text-center text-sm opacity-60">
        <p>Harmonic Orbit</p>
        <p>© 2025 LyreonWorks</p>
        <p>Last Updated: {lastUpdate}</p>
      </footer>
    </main>
  );
}

// --- Components ---

function TechItem({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <div className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors select-none">
      <div className="flex h-5 w-5 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        {icon}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

function LinkItem({
  href,
  icon,
  label,
  disabled,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <a
      href={disabled ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-foreground hover:text-primary flex items-center gap-2 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
