const colours = {
  ink: "#232A31",
  ink3: "#535C64",
  paper: "#FFFFFF",
  blue: "#557790",
  pink: "#E6B2A6",
} as const;

export const ogSize = { width: 1200, height: 630 };

type FontWeight = 400 | 800;

async function loadGoogleFont(family: string, weight: FontWeight, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Couldn't load ${family} ${weight} for the generated images.`);
  return (await fetch(match[1])).arrayBuffer();
}

type FontSpec = { family: "Inter Tight" | "DM Sans" | "DM Mono"; weight: FontWeight; text: string };

export async function loadFonts(specs: FontSpec[]) {
  return Promise.all(
    specs.map(async ({ family, weight, text }) => ({
      name: family,
      weight,
      style: "normal" as const,
      data: await loadGoogleFont(family, weight, text),
    })),
  );
}

type CardProps = {
  label: string;
  title: string | string[];
  body: string;
  big?: boolean;
};

export function OgCard({ label, title, body, big = false }: CardProps) {
  const lines = Array.isArray(title) ? title : [title];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: colours.paper,
        color: colours.ink,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 40px" }}>
        <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 28, color: colours.ink3 }}>{label}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: big ? 28 : 24,
            fontFamily: "Inter Tight",
            fontWeight: 800,
            fontSize: big ? 124 : 96,
            lineHeight: 0.92,
            letterSpacing: big ? -5 : -3,
          }}
        >
          {lines.map((line) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            maxWidth: 1056,
            fontFamily: "DM Sans",
            fontSize: 36,
            lineHeight: 1.35,
          }}
        >
          {body}
        </div>
      </div>
      <div style={{ display: "flex", height: 28, background: colours.blue, borderTop: `4px solid ${colours.ink}` }} />
      <div style={{ display: "flex", height: 16, background: colours.ink }} />
    </div>
  );
}

export async function renderIcon(size: number) {
  const { ImageResponse } = await import("next/og");
  const border = Math.max(2, Math.round(size / 16));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colours.pink,
          border: `${border}px solid ${colours.ink}`,
          color: colours.ink,
          fontFamily: "Inter Tight",
          fontWeight: 800,
          fontSize: Math.round(size * 0.72),
          lineHeight: 1,
        }}
      >
        A
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: await loadFonts([{ family: "Inter Tight", weight: 800, text: "A" }]),
    },
  );
}
