import type { ServiceState } from "../lib/types";
import type { Locale } from "./locale";

export function getShellCopy(locale: Locale) {
  if (locale === "ja") {
    return {
      skipLink: "メインコンテンツへ移動",
      navigationLabel: "主なナビゲーション",
      workspace: "ワークスペース",
      navigation: {
        create: { label: "作成", hint: "MiniMax Music 3.0で曲を生成する" },
        library: { label: "ライブラリ", hint: "生成した曲を聴く" },
        system: { label: "セットアップ", hint: "ComfyUIとゲートウェイを確認する" },
      },
      pageMeta(pathname: string) {
        if (pathname === "/library") return ["ローカルコレクション", "ライブラリ"] as const;
        if (pathname === "/system") return ["ローカルランタイム", "セットアップ"] as const;
        return ["MiniMax Music 3.0", "作曲"] as const;
      },
      serviceLabel(state: ServiceState) {
        if (state === "online") return "Gateway 接続済み";
        if (state === "checking") return "Gateway を確認中";
        return "Gateway に接続できません";
      },
      localServiceNote: "ComfyUI上のMiniMax Music 3.0でローカル生成します。",
      sourceApi: "GitHub リポジトリ",
      languageLabel: "表示言語",
      switchToEnglish: "English に切り替える",
      switchToJapanese: "日本語に切り替える",
      activeJobs(count: number) {
        return count ? `${count} 件を生成中` : "キューは空です";
      },
    };
  }

  return {
    skipLink: "Skip to main content",
    navigationLabel: "Primary navigation",
    workspace: "Workspace",
    navigation: {
      create: { label: "Create", hint: "Generate with MiniMax Music 3.0" },
      library: { label: "Library", hint: "Audition finished takes" },
      system: { label: "Setup", hint: "Check ComfyUI and the gateway" },
    },
    pageMeta(pathname: string) {
      if (pathname === "/library") return ["Local collection", "Library"] as const;
      if (pathname === "/system") return ["Local runtime", "Setup"] as const;
      return ["MiniMax Music 3.0", "Compose"] as const;
    },
    serviceLabel(state: ServiceState) {
      if (state === "online") return "Gateway ready";
      if (state === "checking") return "Checking gateway";
      return "Gateway unavailable";
    },
    localServiceNote: "All jobs are rendered locally by MiniMax Music 3.0 on ComfyUI.",
    sourceApi: "GitHub repository",
    languageLabel: "Language",
    switchToEnglish: "Switch to English",
    switchToJapanese: "Switch to Japanese",
    activeJobs(count: number) {
      return count ? `${count} job${count === 1 ? "" : "s"} in motion` : "Queue clear";
    },
  };
}
