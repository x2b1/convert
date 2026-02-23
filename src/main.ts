import type { FileFormat, FileData, FormatHandler, ConvertPathNode } from "./FormatHandler.js";
import normalizeMimeType from "./normalizeMimeType.js";
import handlers from "./handlers";
import { TraversionGraph } from "./TraversionGraph.js";

/**
 * Japanese translations with English meanings for UI elements
 */
const JapaneseUI = {
  advancedMode: "アドバンスドモード (Advanced mode)",
  simpleMode: "シンプルモード (Simple mode)",
  convertFrom: "変換元: (Convert from)",
  convertTo: "変換先: (Convert to)",
  search: "検索 (Search)",
  convert: "変換 (Convert)",
  loadingTools: "ツールを読み込み中... (Loading tools...)",
  allInputFilesMustBeSameType: "すべての入力ファイルは同じタイプである必要があります (All input files must be of the same type).",
  clickToAddFile: "ファイルを追加するにはクリックしてください (Click to add file)",
  orDragAndDrop: "またはここにドラッグ＆ドロップ (or drag & drop here)",
  and: "および (and)",
  more: "さらに (more)",
  unknownFormat: "不明なフォーマット (Unknown format)"
};

/**
 * Format name translations with English meanings
 */
const FormatTranslations: Record<string, string> = {
  // Images
  "Portable Network Graphics": "ポータブルネットワークグラフィックス (Portable Network Graphics)",
  "Joint Photographic Experts Group": "Joint Photographic Experts Group (JPEG)",
  "WebP": "WebP",
  "CompuServe Graphics Interchange Format": "CompuServe Graphics Interchange Format (GIF)",
  "Scalable Vector Graphics": "スケーラブルベクターグラフィックス (Scalable Vector Graphics)",
  "Bitmap Image File": "ビットマップイメージファイル (BMP)",
  "Graphics Interchange Format": "Graphics Interchange Format (GIF)",
  "JPEG 2000": "JPEG 2000",
  "Portable Image Format": "Portable Image Format (PICT)",
  "Tagged Image File Format": "タグ付き画像ファイル形式 (TIFF)",
  "Portable Pixmap": "Portable Pixmap (PPM)",
  "Portable Graymap": "Portable Graymap (PGM)",
  "Portable BitMap": "Portable BitMap (PBM)",
  "Truevision Graphics Adapter": "Truevision Graphics Adapter (TGA)",
  "JPEG": "JPEG (Joint Photographic Experts Group)",
  "GIF": "GIF (Graphics Interchange Format)",
  "SVG": "SVG (Scalable Vector Graphics)",
  "BMP": "BMP (Bitmap Image File)",
  "TIFF": "TIFF (Tagged Image File Format)",
  "PPM": "PPM (Portable Pixmap)",
  "PGM": "PGM (Portable Graymap)",
  "PBM": "PBM (Portable BitMap)",
  "TGA": "TGA (Truevision Graphics Adapter)",
  "JPG": "JPG (JPEG)",
  "PNG": "PNG (Portable Network Graphics)",
  
  // Text
  "JavaScript Object Notation": "JavaScriptオブジェクト表記 (JavaScript Object Notation)",
  "Extensible Markup Language": "拡張可能なマークアップ言語 (Extensible Markup Language)",
  "YAML Ain't Markup Language": "YAML Ain't Markup Language",
  "Comma Seperated Values": "カンマ区切り値 (Comma Separated Values)",
  "Plain Text": "プレーンテキスト (Plain Text)",
  "Hypertext Markup Language": "ハイパーテキストマークアップ言語 (Hypertext Markup Language)",
  "Markdown": "Markdown",
  "Text": "テキスト (Text)",
  "JSON": "JSON (JavaScript Object Notation)",
  "XML": "XML (Extensible Markup Language)",
  "YAML": "YAML (YAML Ain't Markup Language)",
  "CSV": "CSV (Comma Separated Values)",
  "TXT": "TXT (Plain Text)",
  "HTML": "HTML (Hypertext Markup Language)",
  "MD": "MD (Markdown)",
  
  // Audio
  "Waveform Audio File Format": "波形オーディオファイル形式 (Waveform Audio File Format)",
  "MPEG-1 Audio Layer 3": "MPEG-1 Audio Layer 3 (MP3)",
  "MIDI Musical Instrument Digital Interface": "MIDI音楽機器デジタルインターフェース (MIDI Musical Instrument Digital Interface)",
  "FLAC": "FLAC (Free Lossless Audio Codec)",
  "Ogg Vorbis": "Ogg Vorbis",
  "Opus": "Opus",
  "WAV": "WAV (Waveform Audio File Format)",
  "MP3": "MP3 (MPEG-1 Audio Layer 3)",
  "MIDI": "MIDI (Musical Instrument Digital Interface)",
  "OGG": "OGG (Ogg Vorbis)",
  "OPUS": "OPUS (Opus)",
  
  // Video
  "Moving Picture Experts Group": "Moving Picture Experts Group (MPEG)",
  "Audio Video Interleaved": "オーディオビデオインターリーブ (Audio Video Interleaved)",
  "QuickTime File Format": "QuickTimeファイル形式 (QuickTime File Format)",
  "MPEG": "MPEG (Moving Picture Experts Group)",
  "AVI": "AVI (Audio Video Interleaved)",
  "MOV": "MOV (QuickTime File Format)",
  "MKV": "MKV (Matroska Video)",
  "WEBM": "WEBM (WebM Video)",
  "MP4": "MP4 (MPEG-4)",
  
  // Archives
  "ZIP": "ZIP",
  "RAR": "RAR",
  "7-Zip": "7-Zip",
  "GZIP": "GZIP",
  "TAR": "TAR",
  "TAR.GZ": "TAR.GZ",
  "TAR.BZ2": "TAR.BZ2",
  "TAR.XZ": "TAR.XZ",
  "7Z": "7Z (7-Zip)",
  
  // Documents
  "Portable Document Format": "ポータブルドキュメントフォーマット (Portable Document Format)",
  "OpenDocument Text": "OpenDocumentテキスト (OpenDocument Text)",
  "OpenDocument Presentation": "OpenDocumentプレゼンテーション (OpenDocument Presentation)",
  "OpenDocument Spreadsheet": "OpenDocumentスプレッドシート (OpenDocument Spreadsheet)",
  "OpenDocument Drawing": "OpenDocument描画 (OpenDocument Drawing)",
  "PDF": "PDF (Portable Document Format)",
  "ODT": "ODT (OpenDocument Text)",
  "ODP": "ODP (OpenDocument Presentation)",
  "ODS": "ODS (OpenDocument Spreadsheet)",
  "ODG": "ODG (OpenDocument Drawing)",
  "DOCX": "DOCX (Microsoft Word)",
  "XLSX": "XLSX (Microsoft Excel)",
  "PPTX": "PPTX (Microsoft PowerPoint)",
  
  // Fonts
  "TrueType Font": "TrueTypeフォント (TrueType Font)",
  "OpenType Font": "OpenTypeフォント (OpenType Font)",
  "WOFF": "WOFF (Web Open Font Format)",
  "WOFF2": "WOFF2 (Web Open Font Format 2)",
  "TTF": "TTF (TrueType Font)",
  "OTF": "OTF (OpenType Font)",
  
  // 3D
  "Three.js": "Three.js",
  
  // Game formats
  "Minecraft Level Format": "Minecraftレベルフォーマット (Minecraft Level Format)",
  "Binary Scene Object": "バイナリシーンオブジェクト (Binary Scene Object)",
  "BSON": "BSON (Binary JSON)",
  "BSOR": "BSOR (Binary Song Object Resource)",
  "SB3": "SB3 (Scratch 3.0)",
  "PND": "PND (Pandora)",
  "VTF": "VTF (Valve Texture Format)",
  "WAD": "WAD (Wolfenstein 3D Archive)",
  "LZMA": "LZMA (Lempel-Ziv-Markov chain)",
  "LZH": "LZH",
  "QOI": "QOI (Quite OK Image)",
  "QOA": "QOA (Quite OK Audio)",
  "CUR": "CUR (Cursor)",
  "ANI": "ANI (Animated Cursor)",
  "ICO": "ICO (Icon)",
  
  // Others
  "HTML Embed": "HTML埋め込み (HTML Embed)",
  "Canvas to Blob": "キャンバスをBlobに変換 (Canvas to Blob)",
  "Text to Shell": "テキストをシェルに変換 (Text to Shell)",
  "Text to Go": "テキストをGoに変換 (Text to Go)",
  "PNG to QOI": "PNG to QOI",
  "QOI to PNG": "QOI to PNG",
  "WAV to QOA": "WAV to QOA",
  "QOA to WAV": "QOA to WAV",
  "Image to Text": "画像をテキストに変換 (Image to Text)",
  "Envelope": "Envelope",
  "Espeakng": "Espeakng",
  "FFmpeg": "FFmpeg",
  "Flo": "Flo",
  "Font": "Font"
};

/**
 * Get Japanese translation for a format name
 */
function getJapaneseFormatName(formatName: string, englishName: string): string {
  // Try to find exact match
  if (FormatTranslations[formatName]) {
    return FormatTranslations[formatName];
  }
  
  // Try to find partial match (for handlers)
  for (const [key, value] of Object.entries(FormatTranslations)) {
    if (key.includes(formatName) || formatName.includes(key)) {
      return value;
    }
  }
  
  // Return original with Japanese katakana conversion for common extensions
  const katakanaMap: Record<string, string> = {
    'png': 'PNG (Portable Network Graphics)',
    'jpeg': 'JPEG (Joint Photographic Experts Group)',
    'jpg': 'JPEG (Joint Photographic Experts Group)',
    'webp': 'WebP',
    'gif': 'GIF (Graphics Interchange Format)',
    'svg': 'SVG (Scalable Vector Graphics)',
    'bmp': 'BMP (Bitmap Image File)',
    'tiff': 'TIFF (Tagged Image File Format)',
    'tif': 'TIFF (Tagged Image File Format)',
    'ppm': 'PPM (Portable Pixmap)',
    'pgm': 'PGM (Portable Graymap)',
    'pbm': 'PBM (Portable BitMap)',
    'tga': 'TGA (Truevision Graphics Adapter)',
    'json': 'JSON (JavaScript Object Notation)',
    'xml': 'XML (Extensible Markup Language)',
    'yaml': 'YAML (YAML Ain\'t Markup Language)',
    'yml': 'YAML (YAML Ain\'t Markup Language)',
    'csv': 'CSV (Comma Separated Values)',
    'txt': 'TXT (Plain Text)',
    'html': 'HTML (Hypertext Markup Language)',
    'htm': 'HTML (Hypertext Markup Language)',
    'md': 'MD (Markdown)',
    'wav': 'WAV (Waveform Audio File Format)',
    'mp3': 'MP3 (MPEG-1 Audio Layer 3)',
    'midi': 'MIDI (Musical Instrument Digital Interface)',
    'flac': 'FLAC (Free Lossless Audio Codec)',
    'ogg': 'OGG (Ogg Vorbis)',
    'opus': 'OPUS (Opus)',
    'mp4': 'MP4 (MPEG-4)',
    'avi': 'AVI (Audio Video Interleaved)',
    'mov': 'MOV (QuickTime File Format)',
    'mkv': 'MKV (Matroska Video)',
    'webm': 'WEBM (WebM Video)',
    'zip': 'ZIP',
    'rar': 'RAR',
    '7z': '7Z (7-Zip)',
    'gz': 'GZ (GZIP)',
    'tar': 'TAR',
    'tar.gz': 'TAR.GZ',
    'tar.bz2': 'TAR.BZ2',
    'tar.xz': 'TAR.XZ',
    'pdf': 'PDF (Portable Document Format)',
    'odt': 'ODT (OpenDocument Text)',
    'odp': 'ODP (OpenDocument Presentation)',
    'ods': 'ODS (OpenDocument Spreadsheet)',
    'odg': 'ODG (OpenDocument Drawing)',
    'docx': 'DOCX (Microsoft Word)',
    'xlsx': 'XLSX (Microsoft Excel)',
    'pptx': 'PPTX (Microsoft PowerPoint)',
    'ttf': 'TTF (TrueType Font)',
    'otf': 'OTF (OpenType Font)',
    'woff': 'WOFF (Web Open Font Format)',
    'woff2': 'WOFF2 (Web Open Font Format 2)',
    'bson': 'BSON (Binary JSON)',
    'bsor': 'BSOR (Binary Song Object Resource)',
    'sb3': 'SB3 (Scratch 3.0)',
    'pnd': 'PND (Pandora)',
    'vtf': 'VTF (Valve Texture Format)',
    'wad': 'WAD (Wolfenstein 3D Archive)',
    'lzh': 'LZH',
    'qoi': 'QOI (Quite OK Image)',
    'qoa': 'QOA (Quite OK Audio)',
    'cur': 'CUR (Cursor)',
    'ani': 'ANI (Animated Cursor)',
    'ico': 'ICO (Icon)',
    'threejs': 'Three.js',
    'htmlEmbed': 'HTML埋め込み (HTML Embed)',
    'canvasToBlob': 'キャンバスをBlobに変換 (Canvas to Blob)',
    'textToShell': 'テキストをシェルに変換 (Text to Shell)',
    'textToGo': 'テキストをGoに変換 (Text to Go)',
    'pngToQoi': 'PNG to QOI',
    'qoiToPng': 'QOI to PNG',
    'wavToQoa': 'WAV to QOA',
    'qoaToWav': 'QOA to WAV',
    'imageToTxt': '画像をテキストに変換 (Image to Text)',
    'envelope': 'Envelope',
    'espeakng': 'Espeakng',
    'ffmpeg': 'FFmpeg',
    'flo': 'Flo',
    'font': 'Font'
  };
  
  const ext = formatName.toLowerCase().split('.').pop();
  if (ext && katakanaMap[ext]) {
    return katakanaMap[ext];
  }
  
  return `${formatName} (${englishName})`;
}


/** Files currently selected for conversion */
let selectedFiles: File[] = [];
/**
 * Whether to use "simple" mode.
 * - In **simple** mode, the input/output lists are grouped by file format.
 * - In **advanced** mode, these lists are grouped by format handlers, which
 *   requires the user to manually select the tool that processes the output.
 */
let simpleMode: boolean = true;

/** Handlers that support conversion from any formats. */
const conversionsFromAnyInput: ConvertPathNode[] = handlers
.filter(h => h.supportAnyInput && h.supportedFormats)
.flatMap(h => h.supportedFormats!
  .filter(f => f.to)
  .map(f => ({ handler: h, format: f})))

const ui = {
  fileInput: document.querySelector("#file-input") as HTMLInputElement,
  fileSelectArea: document.querySelector("#file-area") as HTMLDivElement,
  convertButton: document.querySelector("#convert-button") as HTMLButtonElement,
  modeToggleButton: document.querySelector("#mode-button") as HTMLButtonElement,
  inputList: document.querySelector("#from-list") as HTMLDivElement,
  outputList: document.querySelector("#to-list") as HTMLDivElement,
  inputSearch: document.querySelector("#search-from") as HTMLInputElement,
  outputSearch: document.querySelector("#search-to") as HTMLInputElement,
  popupBox: document.querySelector("#popup") as HTMLDivElement,
  popupBackground: document.querySelector("#popup-bg") as HTMLDivElement
};

/**
 * Filters a list of butttons to exclude those not matching a substring.
 * @param list Button list (div) to filter.
 * @param string Substring for which to search.
 */
const filterButtonList = (list: HTMLDivElement, string: string) => {
  for (const button of Array.from(list.children)) {
    if (!(button instanceof HTMLButtonElement)) continue;
    const formatIndex = button.getAttribute("format-index");
    let hasExtension = false;
    if (formatIndex) {
      const format = allOptions[parseInt(formatIndex)];
      hasExtension = format?.format.extension.toLowerCase().includes(string);
    }
    const hasText = button.textContent.toLowerCase().includes(string);
    if (!hasExtension && !hasText) {
      button.style.display = "none";
    } else {
      button.style.display = "";
    }
  }
}

/**
 * Handles search box input by filtering its parent container.
 * @param event Input event from an {@link HTMLInputElement}
 */
const searchHandler = (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const targetParentList = target.parentElement?.querySelector(".format-list");
  if (!(targetParentList instanceof HTMLDivElement)) return;

  const string = target.value.toLowerCase();
  filterButtonList(targetParentList, string);
};

// Assign search handler to both search boxes
ui.inputSearch.oninput = searchHandler;
ui.outputSearch.oninput = searchHandler;

// Map clicks in the file selection area to the file input element
ui.fileSelectArea.onclick = () => {
  ui.fileInput.click();
};

/**
 * Validates and stores user selected files. Works for both manual
 * selection and file drag-and-drop.
 * @param event Either a file input element's "change" event,
 * or a "drop" event.
 */
const fileSelectHandler = (event: Event) => {

  let inputFiles;

  if (event instanceof DragEvent) {
    inputFiles = event.dataTransfer?.files;
    if (inputFiles) event.preventDefault();
  } else if (event instanceof ClipboardEvent) {
    inputFiles = event.clipboardData?.files;
  } else {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    inputFiles = target.files;
  }

  if (!inputFiles) return;
  const files = Array.from(inputFiles);
  if (files.length === 0) return;

  if (files.some(c => c.type !== files[0].type)) {
    return alert(JapaneseUI.allInputFilesMustBeSameType);
  }
  files.sort((a, b) => a.name === b.name ? 0 : (a.name < b.name ? -1 : 1));
  selectedFiles = files;

  ui.fileSelectArea.innerHTML = `<h2>
    ${files[0].name}
    ${files.length > 1 ? `<br>... and ${files.length - 1} more` : ""}
  </h2>`;

  // Common MIME type adjustments (to match "mime" library)
  let mimeType = normalizeMimeType(files[0].type);

  const fileExtension = files[0].name.split(".").pop()?.toLowerCase();

  // Find all buttons matching the input MIME type.
  const buttonsMatchingMime = Array.from(ui.inputList.children).filter(button => {
    if (!(button instanceof HTMLButtonElement)) return false;
    return button.getAttribute("mime-type") === mimeType;
  }) as HTMLButtonElement[];
  // If there are multiple, find one with a matching extension too
  let inputFormatButton: HTMLButtonElement;
  if (buttonsMatchingMime.length > 1) {
    inputFormatButton = buttonsMatchingMime.find(button => {
      const formatIndex = button.getAttribute("format-index");
      if (!formatIndex) return;
      const format = allOptions[parseInt(formatIndex)];
      return format.format.extension === fileExtension;
    }) || buttonsMatchingMime[0];
  } else {
    inputFormatButton = buttonsMatchingMime[0];
  }
  // Click button with matching MIME type.
  if (mimeType && inputFormatButton instanceof HTMLButtonElement) {
    inputFormatButton.click();
    ui.inputSearch.value = mimeType;
    filterButtonList(ui.inputList, ui.inputSearch.value);
    return;
  }

  // Fall back to matching format by file extension if MIME type wasn't found.
  const buttonExtension = Array.from(ui.inputList.children).find(button => {
    if (!(button instanceof HTMLButtonElement)) return false;
    const formatIndex = button.getAttribute("format-index");
    if (!formatIndex) return;
    const format = allOptions[parseInt(formatIndex)];
    return format.format.extension.toLowerCase() === fileExtension;
  });
  if (buttonExtension instanceof HTMLButtonElement) {
    buttonExtension.click();
    ui.inputSearch.value = buttonExtension.getAttribute("mime-type") || "";
  } else {
    ui.inputSearch.value = fileExtension || "";
  }

  filterButtonList(ui.inputList, ui.inputSearch.value);

};

// Add the file selection handler to both the file input element and to
// the window as a drag-and-drop event, and to the clipboard paste event.
ui.fileInput.addEventListener("change", fileSelectHandler);
window.addEventListener("drop", fileSelectHandler);
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("paste", fileSelectHandler);

/**
 * Display an on-screen popup.
 * @param html HTML content of the popup box.
 */
window.showPopup = function (html: string) {
  ui.popupBox.innerHTML = html;
  ui.popupBox.style.display = "block";
  ui.popupBackground.style.display = "block";
}
/**
 * Hide the on-screen popup.
 */
window.hidePopup = function () {
  ui.popupBox.style.display = "none";
  ui.popupBackground.style.display = "none";
}

const allOptions: Array<{ format: FileFormat, handler: FormatHandler }> = [];

window.supportedFormatCache = new Map();
window.traversionGraph = new TraversionGraph();

window.printSupportedFormatCache = () => {
  const entries = [];
  for (const entry of window.supportedFormatCache) {
    entries.push(entry);
  }
  return JSON.stringify(entries, null, 2);
}


async function buildOptionList () {

  allOptions.length = 0;
  ui.inputList.innerHTML = "";
  ui.outputList.innerHTML = "";

  for (const handler of handlers) {
    if (!window.supportedFormatCache.has(handler.name)) {
      console.warn(`Cache miss for formats of handler "${handler.name}".`);
      try {
        await handler.init();
      } catch (_) { continue; }
      if (handler.supportedFormats) {
        window.supportedFormatCache.set(handler.name, handler.supportedFormats);
        console.info(`Updated supported format cache for "${handler.name}".`);
      }
    }
    const supportedFormats = window.supportedFormatCache.get(handler.name);
    if (!supportedFormats) {
      console.warn(`Handler "${handler.name}" doesn't support any formats.`);
      continue;
    }
    for (const format of supportedFormats) {

      if (!format.mime) continue;

      allOptions.push({ format, handler });

      // In simple mode, display each input/output format only once
      let addToInputs = true, addToOutputs = true;
      if (simpleMode) {
        addToInputs = !Array.from(ui.inputList.children).some(c => {
          const currFormat = allOptions[parseInt(c.getAttribute("format-index") || "")]?.format;
          return currFormat?.mime === format.mime && currFormat?.format === format.format;
        });
        addToOutputs = !Array.from(ui.outputList.children).some(c => {
          const currFormat = allOptions[parseInt(c.getAttribute("format-index") || "")]?.format;
          return currFormat?.mime === format.mime && currFormat?.format === format.format;
        });
        if ((!format.from || !addToInputs) && (!format.to || !addToOutputs)) continue;
      }

      const newOption = document.createElement("button");
      newOption.setAttribute("format-index", (allOptions.length - 1).toString());
      newOption.setAttribute("mime-type", format.mime);

      const formatDescriptor = format.format.toUpperCase();
      const englishName = format.name;
      
      if (simpleMode) {
        // Hide any handler-specific information in simple mode
        const cleanName = format.name
          .split("(").join(")").split(")")
          .filter((_, i) => i % 2 === 0)
          .filter(c => c != "")
          .join(" ");
        const japaneseName = getJapaneseFormatName(cleanName, englishName);
        newOption.appendChild(document.createTextNode(`${formatDescriptor} ${japaneseName} (${format.mime})`));
      } else {
        const japaneseName = getJapaneseFormatName(format.name, englishName);
        newOption.appendChild(document.createTextNode(`${formatDescriptor} ${japaneseName} (${format.mime}) ${handler.name}`));
      }

      const clickHandler = (event: Event) => {
        if (!(event.target instanceof HTMLButtonElement)) return;
        const targetParent = event.target.parentElement;
        const previous = targetParent?.getElementsByClassName("selected")?.[0];
        if (previous) previous.className = "";
        event.target.className = "selected";
        const allSelected = document.getElementsByClassName("selected");
        if (allSelected.length === 2) {
          ui.convertButton.className = "";
        } else {
          ui.convertButton.className = "disabled";
        }
      };

      if (format.from && addToInputs) {
        const clone = newOption.cloneNode(true) as HTMLButtonElement;
        clone.onclick = clickHandler;
        ui.inputList.appendChild(clone);
      }
      if (format.to && addToOutputs) {
        const clone = newOption.cloneNode(true) as HTMLButtonElement;
        clone.onclick = clickHandler;
        ui.outputList.appendChild(clone);
      }

    }
  }
  window.traversionGraph.init(window.supportedFormatCache, handlers);
  filterButtonList(ui.inputList, ui.inputSearch.value);
  filterButtonList(ui.outputList, ui.outputSearch.value);

  window.hidePopup();

}

(async () => {
  try {
    const cacheJSON = await fetch("cache.json").then(r => r.json());
    window.supportedFormatCache = new Map(cacheJSON);
  } catch {
    console.warn(
      "Missing supported format precache.\n\n" +
      "Consider saving the output of printSupportedFormatCache() to cache.json."
    );
  } finally {
    await buildOptionList();
    console.log("Built initial format list.");
  }
})();

ui.modeToggleButton.addEventListener("click", () => {
  simpleMode = !simpleMode;
  if (simpleMode) {
    ui.modeToggleButton.textContent = JapaneseUI.advancedMode;
    document.body.style.setProperty("--highlight-color", "#1C77FF");
  } else {
    ui.modeToggleButton.textContent = JapaneseUI.simpleMode;
    document.body.style.setProperty("--highlight-color", "#FF6F1C");
  }
  buildOptionList();
});

let deadEndAttempts: ConvertPathNode[][];

async function attemptConvertPath (files: FileData[], path: ConvertPathNode[]) {

  const pathString = path.map(c => c.format.format).join(" → ");

  // Exit early if we've encountered a known dead end
  for (const deadEnd of deadEndAttempts) {
    let isDeadEnd = true;
    for (let i = 0; i < deadEnd.length; i++) {
      if (path[i] === deadEnd[i]) continue;
      isDeadEnd = false;
      break;
    }
    if (isDeadEnd) {
      const deadEndString = deadEnd.slice(-2).map(c => c.format.format).join(" → ");
      console.warn(`Skipping ${pathString} due to dead end near ${deadEndString}.`);
      return null;
    }
  }

  ui.popupBox.innerHTML = `<h2>Finding conversion route...</h2>
    <p>Trying <b>${pathString}</b>...</p>`;

  for (let i = 0; i < path.length - 1; i ++) {
    const handler = path[i + 1].handler;
    try {
      let supportedFormats = window.supportedFormatCache.get(handler.name);
      if (!handler.ready) {
        await handler.init();
        if (!handler.ready) throw `Handler "${handler.name}" not ready after init.`;
        if (handler.supportedFormats) {
          window.supportedFormatCache.set(handler.name, handler.supportedFormats);
          supportedFormats = handler.supportedFormats;
        }
      }
      if (!supportedFormats) throw `Handler "${handler.name}" doesn't support any formats.`;
      const inputFormat = supportedFormats.find(c =>
        c.from
        && c.mime === path[i].format.mime
        && c.format === path[i].format.format
      )!;
      files = (await Promise.all([
        handler.doConvert(files, inputFormat, path[i + 1].format),
        // Ensure that we wait long enough for the UI to update
        new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      ]))[0];
      if (files.some(c => !c.bytes.length)) throw "Output is empty.";
    } catch (e) {

      console.log(path.map(c => c.format.format));
      console.error(handler.name, `${path[i].format.format} → ${path[i + 1].format.format}`, e);

      // Dead ends are added both to the graph and to the attempt system.
      // The graph may still have old paths queued from before they were
      // marked as dead ends, so we catch that here.
      const deadEndPath = path.slice(0, i + 2);
      deadEndAttempts.push(deadEndPath);
      window.traversionGraph.addDeadEndPath(path.slice(0, i + 2));

      ui.popupBox.innerHTML = `<h2>Finding conversion route...</h2>
        <p>Looking for a valid path...</p>`;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      return null;

    }
  }

  return { files, path };

}

window.tryConvertByTraversing = async function (
  files: FileData[],
  from: ConvertPathNode,
  to: ConvertPathNode
) {
  deadEndAttempts = [];
  window.traversionGraph.clearDeadEndPaths();
  for await (const path of window.traversionGraph.searchPath(from, to, simpleMode)) {
    // Use exact output format if the target handler supports it
    if (path.at(-1)?.handler === to.handler) {
      path[path.length - 1] = to;
    }
    const attempt = await attemptConvertPath(files, path);
    if (attempt) return attempt;
  }
  return null;
}

function downloadFile (bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

ui.convertButton.onclick = async function () {

  const inputFiles = selectedFiles;

  if (inputFiles.length === 0) {
    return alert(JapaneseUI.unknownFormat);
  }

  const inputButton = document.querySelector("#from-list .selected");
  if (!inputButton) return alert("入力ファイル形式を指定してください (Specify input file format).");

  const outputButton = document.querySelector("#to-list .selected");
  if (!outputButton) return alert("出力ファイル形式を指定してください (Specify output file format).");

  const inputOption = allOptions[Number(inputButton.getAttribute("format-index"))];
  const outputOption = allOptions[Number(outputButton.getAttribute("format-index"))];

  const inputFormat = inputOption.format;
  const outputFormat = outputOption.format;

  try {

    const inputFileData = [];
    for (const inputFile of inputFiles) {
      const inputBuffer = await inputFile.arrayBuffer();
      const inputBytes = new Uint8Array(inputBuffer);
      if (
        inputFormat.mime === outputFormat.mime
        && inputFormat.format === outputFormat.format
      ) {
        downloadFile(inputBytes, inputFile.name);
        continue;
      }
      inputFileData.push({ name: inputFile.name, bytes: inputBytes });
    }

    window.showPopup("<h2>Finding conversion route...</h2>");
    // Delay for a bit to give the browser time to render
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const output = await window.tryConvertByTraversing(inputFileData, inputOption, outputOption);
    if (!output) {
      window.hidePopup();
      alert("変換ルートが見つかりませんでした (Failed to find conversion route).");
      return;
    }

    for (const file of output.files) {
      downloadFile(file.bytes, file.name);
    }

    const inputFormatName = getJapaneseFormatName(inputOption.format.name, inputOption.format.format);
    const outputFormatName = getJapaneseFormatName(outputOption.format.name, outputOption.format.format);
    
    window.showPopup(
      `<h2>${inputFormatName} から ${outputFormatName} へ変換しました (Converted)!</h2>` +
      `<p>使用されたパス: <b>${output.path.map(c => c.format.format).join(" → ")}</b>.</p>\n` +
      `<button onclick="window.hidePopup()">OK</button>`
    );

  } catch (e) {

    window.hidePopup();
    alert("ルーティング中に予期しないエラーが発生しました (Unexpected error while routing):\n" + e);
    console.error(e);

  }

};

// Display the current git commit SHA in the UI, if available
{
  const commitElement = document.querySelector("#commit-id");
  if (commitElement) {
    commitElement.textContent = import.meta.env.VITE_COMMIT_SHA ?? "unknown";
  }
}
