import { describe, expect, it } from "vitest";
import { captionFromDraft } from "./music3Api";
import { defaultStudioDraft } from "./music3Types";

describe("MiniMax Music 3.0 request mapping", () => {
  it("keeps the three structured brief sections in order", () => {
    const caption = captionFromDraft({
      ...defaultStudioDraft,
      globalMetadata: "wafu rock",
      vocalDetails: "Japanese female vocal",
      arrangement: "shamisen and live drums",
    });
    expect(caption).toBe("Global Metadata: wafu rock\nVocal Details: Japanese female vocal\nArrangement: shamisen and live drums");
  });

  it("trims each section before sending it to the gateway", () => {
    const caption = captionFromDraft({
      ...defaultStudioDraft,
      globalMetadata: "  city pop  ",
      vocalDetails: " clear vocal ",
      arrangement: " synth pads ",
    });
    expect(caption).not.toContain("  city pop  ");
    expect(caption).toContain("Global Metadata: city pop");
  });
});
