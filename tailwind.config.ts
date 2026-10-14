import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"], theme:{extend:{colors:{brand:{DEFAULT:"#FF4A00",dark:"#000"},ink:"#0A0A0A",paper:"#fff"},fontFamily:{serif:["Georgia","serif"],display:["Anton","Impact","sans-serif"]}}}, plugins:[] } satisfies Config;
