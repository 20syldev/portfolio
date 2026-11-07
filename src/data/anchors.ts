// Page that receives a visitor of the former /alternance page without a known anchor
export const alternanceFallback = "/repositories/#zenetys";

// Anchors of the former /alternance page mapped to the page that replaced them
export const alternanceAnchors: Record<string, string> = {
    zenetys: alternanceFallback,
    contributions: "/contributions/",
    articles: "/articles/",
    hyoai: "/projet/hyoai/",
    zeportal: "/projet/zeportal/",
    monitoring: "/projet/monitoring/",
    zwebsite: "/projet/zwebsite/",
    "logvault-io": "/projet/logvault/",
    logcenter: "/projet/logcenter/",
    lyah: "/projet/lyah/",
    zpki: "/projet/zpki/",
    "drawio-ext": "/projet/drawio-ext/",
};