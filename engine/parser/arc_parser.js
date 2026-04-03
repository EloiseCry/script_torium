import path from "path";

function cleanLine(line) {
  return line.replace(/\t/g, " ").trim();
}

function parseScalar(raw) {
  let value = raw.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

function parseKeyValue(line) {
  const match = line.match(/^([\w./:-]+)\s*[:=]\s*(.+)$/);
  if (!match) return null;
  return {
    key: match[1],
    value: parseScalar(match[2])
  };
}

function parseInlineAction(line) {
  const match = line.match(/^([a-zA-Z_][\w.-]*)\s+(.+)$/);
  if (!match) return null;
  const [, type, rest] = match;
  return {
    type: "inlineAction",
    actionType: type,
    args: { value: parseScalar(rest) }
  };
}

function parseInlineItems(content) {
  const items = [];
  const pattern = /([\w./:-]+)\s*[:=]\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s][^:=]*?(?=\s+[\w./:-]+\s*[:=]|\s*$))/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    items.push({
      type: "kv",
      key: match[1],
      value: parseScalar(match[2])
    });
  }

  if (!items.length && content.trim()) {
    items.push({ type: "bare", value: content.trim() });
  }

  return items;
}

function parseRange(rangeStr) {
  const cleaned = rangeStr
    .replace(/→/g, "-")
    .replace(/->/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .trim();

  const match = cleaned.match(/^([\d.]+)(s|f)?(?:\+([\d.]+)f)?-([\d.]+)(s|f)?$/);
  if (!match) {
    return { start: null, end: null, duration: null, rawRange: rangeStr };
  }

  let start = Number(match[1]);
  let end = Number(match[4]);

  if (match[2] === "f") start /= 24;
  if (match[5] === "f") end /= 24;
  if (match[3]) start += Number(match[3]) / 24;

  return {
    start,
    end,
    duration: end - start,
    rawRange: rangeStr
  };
}

function toObjectFromItems(items) {
  const out = {};
  for (const item of items) {
    if (item.type === "kv") {
      if (Object.prototype.hasOwnProperty.call(out, item.key)) {
        if (Array.isArray(out[item.key])) out[item.key].push(item.value);
        else out[item.key] = [out[item.key], item.value];
      } else {
        out[item.key] = item.value;
      }
    } else if (item.type === "bare") {
      if (!out._items) out._items = [];
      out._items.push(item.value);
    } else if (item.type === "block") {
      const nestedValue = toObjectFromItems(item.items || []);
      const key = item.name ? `${item.blockType}.${item.name}` : item.blockType;

      if (Object.prototype.hasOwnProperty.call(out, key)) {
        if (Array.isArray(out[key])) out[key].push(nestedValue);
        else out[key] = [out[key], nestedValue];
      } else {
        out[key] = nestedValue;
      }

      if (!item.name && !Object.prototype.hasOwnProperty.call(out, item.blockType)) {
        out[item.blockType] = nestedValue;
      }
    }
  }
  return out;
}

function parseBlockHeader(line) {
  const match = line.match(/^([A-Za-z_][\w.-]*)(?:\s+(.+?))?\s*\{\s*$/);
  if (!match) return null;
  return {
    type: match[1],
    name: match[2] ? match[2].trim() : null
  };
}

function parseInlineBlock(line) {
  const match = line.match(/^([A-Za-z_][\w.-]*)(?:\s+(.+?))?\s*\{\s*(.*?)\s*\}\s*$/);
  if (!match) return null;

  const [, blockType, rawName, inner] = match;
  const items = parseInlineItems(inner.trim());

  return {
    type: "block",
    blockType,
    name: rawName ? rawName.trim() : null,
    items
  };
}

function parseBlock(lines, startIdx) {
  const headerLine = cleanLine(lines[startIdx]);
  const header = parseBlockHeader(headerLine);
  if (!header) {
    throw new Error(`Header de bloque inválido: ${lines[startIdx]}`);
  }

  const block = {
    type: "block",
    blockType: header.type,
    name: header.name,
    items: []
  };

  let idx = startIdx + 1;
  while (idx < lines.length) {
    const current = cleanLine(lines[idx]);

    if (!current || current.startsWith("//") || current.startsWith("#")) {
      idx++;
      continue;
    }

    if (current === "}") {
      return { node: block, nextIdx: idx + 1 };
    }

    const inlineBlock = parseInlineBlock(current);
    if (inlineBlock) {
      block.items.push(inlineBlock);
      idx++;
      continue;
    }

    const nested = parseBlockHeader(current);
    if (nested) {
      const parsed = parseBlock(lines, idx);
      block.items.push(parsed.node);
      idx = parsed.nextIdx;
      continue;
    }

    const kv = parseKeyValue(current);
    if (kv) {
      block.items.push({ type: "kv", key: kv.key, value: kv.value });
      idx++;
      continue;
    }

    const inlineAction = parseInlineAction(current);
    if (inlineAction) {
      block.items.push(inlineAction);
      idx++;
      continue;
    }

    block.items.push({ type: "bare", value: current });
    idx++;
  }

  throw new Error(`Bloque sin cierre: ${header.type}${header.name ? ` ${header.name}` : ""}`);
}

function parseDocumentTree(source) {
  const lines = source.split(/\r?\n/);
  const nodes = [];
  let idx = 0;

  while (idx < lines.length) {
    const current = cleanLine(lines[idx]);

    if (!current || current.startsWith("//") || current.startsWith("#")) {
      idx++;
      continue;
    }

    const header = parseBlockHeader(current);
    if (header) {
      const parsed = parseBlock(lines, idx);
      nodes.push(parsed.node);
      idx = parsed.nextIdx;
      continue;
    }

    const kv = parseKeyValue(current);
    if (kv) nodes.push({ type: "kv", key: kv.key, value: kv.value });
    else nodes.push({ type: "bare", value: current });
    idx++;
  }

  return nodes;
}

function normalizeAction(block) {
  if (!block || block.type !== "block") return null;
  const args = toObjectFromItems(block.items);
  return {
    type: block.blockType,
    args
  };
}

function normalizeInlineAction(item) {
  if (!item || item.type !== "inlineAction") return null;
  return {
    type: item.actionType,
    args: item.args || {}
  };
}

function normalizeStepDocument(nodes, filePath) {
  const metaBlock = nodes.find(
    node => node.type === "block" && node.blockType === "meta"
  );
  const requireBlock = nodes.find(
    node => node.type === "block" && node.blockType === "require"
  );
  const stepBlocks = nodes.filter(
    node => node.type === "block" && node.blockType === "step"
  );

  const steps = stepBlocks.map(block => ({
    name: block.name || "step_sin_nombre",
    actions: block.items
      .map(item => {
        if (item.type === "block") return normalizeAction(item);
        if (item.type === "inlineAction") return normalizeInlineAction(item);
        return null;
      })
      .filter(Boolean)
  }));

  return {
    type: "ritual",
    dialect: "steps",
    name: path.basename(filePath || "ritual.arc", path.extname(filePath || "ritual.arc")),
    filePath: filePath || null,
    meta: metaBlock ? toObjectFromItems(metaBlock.items) : {},
    assets: {},
    styles: {},
    requires: requireBlock
      ? requireBlock.items
          .filter(item => item.type === "bare")
          .map(item => item.value)
      : [],
    steps,
    timeline: [],
    sequence: [],
    rawTree: nodes
  };
}

function normalizeTimelineBlock(block) {
  const timeline = [];

  for (const item of block.items) {
    if (item.type === "inlineAction") {
      timeline.push({
        kind: "action",
        action: normalizeInlineAction(item)
      });
      continue;
    }

    if (item.type !== "block") continue;
    if (["range", "segment", "clip"].includes(item.blockType)) {
      const props = toObjectFromItems(item.items);
      const range = parseRange(
        typeof item.name === "string" && item.name ? item.name : String(props.range || "")
      );
      const start =
        range.start ??
        (typeof props.start === "number" ? props.start : parseScalar(String(props.start || "")));
      const duration =
        range.duration ??
        (typeof props.duration === "number"
          ? props.duration
          : typeof props.duracion === "number"
            ? props.duracion
            : parseScalar(String(props.duration ?? props.duracion ?? "")));
      const end =
        range.end ??
        (typeof start === "number" && typeof duration === "number" ? start + duration : null);

      timeline.push({
        kind: "segment",
        source: item.blockType,
        start,
        end,
        duration,
        rawRange: range.rawRange,
        props
      });
      continue;
    }

    if (item.blockType !== "track") continue;

    for (const nested of item.items || []) {
      if (nested.type !== "block") continue;

      const props = toObjectFromItems(nested.items);
      const range = parseRange(String(props.range || ""));
      const start =
        range.start ??
        (typeof props.start === "number" ? props.start : parseScalar(String(props.start || "")));
      const duration =
        range.duration ??
        (typeof props.duration === "number"
          ? props.duration
          : typeof props.duracion === "number"
            ? props.duracion
            : parseScalar(String(props.duration ?? props.duracion ?? "")));
      const end =
        range.end ??
        (typeof start === "number" && typeof duration === "number" ? start + duration : null);

      timeline.push({
        kind: "segment",
        source: nested.blockType,
        track: item.name || "track",
        name: nested.name || null,
        start,
        end,
        duration,
        rawRange: range.rawRange,
        props
      });
    }
  }

  return timeline;
}

function normalizeSequenceBlock(block) {
  const sequence = [];

  for (const item of block.items) {
    if (item.type === "block" && item.blockType === "act") {
      sequence.push({
        name: item.name || "act_sin_nombre",
        props: toObjectFromItems(item.items)
      });
      continue;
    }

    if (
      item.type === "kv" &&
      ["file", "include", "includes", "incluye"].includes(item.key)
    ) {
      const file = String(item.value || "");
      sequence.push({
        name: path.basename(file, path.extname(file)) || "act_sin_nombre",
        props: { file }
      });
    }
  }

  return sequence;
}

function normalizeWrappedRitual(nodes, filePath) {
  const root = nodes.find(
    node =>
      node.type === "block" &&
      ["ritual", "reel", "kerigma", "pack"].includes(node.blockType)
  ) || nodes.find(node => node.type === "block");

  const rootItems = root ? root.items : nodes;
  const metaBlock = rootItems.find(
    node => node.type === "block" && node.blockType === "meta"
  );
  const assetsBlock = rootItems.find(
    node => node.type === "block" && node.blockType === "assets"
  );
  const stylesBlock = rootItems.find(
    node => node.type === "block" && node.blockType === "styles"
  );
  const timelineBlock = rootItems.find(
    node => node.type === "block" && node.blockType === "timeline"
  );
  const sequenceBlock = rootItems.find(
    node =>
      node.type === "block" &&
      ["sequence", "secuencia"].includes(node.blockType)
  );

  let dialect = "unknown";
  if (timelineBlock) dialect = "timeline";
  else if (sequenceBlock) dialect = "sequence";

  return {
    type: "ritual",
    dialect,
    name:
      root?.name ||
      path.basename(filePath || "ritual.arc", path.extname(filePath || "ritual.arc")),
    filePath: filePath || null,
    meta: metaBlock ? toObjectFromItems(metaBlock.items) : {},
    assets: assetsBlock ? toObjectFromItems(assetsBlock.items) : {},
    styles: stylesBlock ? toObjectFromItems(stylesBlock.items) : {},
    requires: [],
    steps: [],
    timeline: timelineBlock ? normalizeTimelineBlock(timelineBlock) : [],
    sequence: sequenceBlock ? normalizeSequenceBlock(sequenceBlock) : [],
    rawTree: nodes
  };
}

export function detectArcDialect(source) {
  if (/\btimeline\s*\{/i.test(source)) return "timeline";
  if (/\b(sequence|secuencia)\s*\{/i.test(source)) return "sequence";
  if (/^\s*step\s+[A-Za-z_][\w.-]*\s*\{/m.test(source)) return "steps";
  if (/^\s*(ritual|reel|kerigma|pack)\s+[A-Za-z_][\w.-]*\s*\{/m.test(source)) {
    return "wrapped";
  }
  return "unknown";
}

export function parseArc(source, options = {}) {
  const { filePath = null } = options;
  const nodes = parseDocumentTree(source);
  const dialect = detectArcDialect(source);

  if (dialect === "steps") return normalizeStepDocument(nodes, filePath);
  if (dialect === "timeline" || dialect === "wrapped" || dialect === "sequence") {
    return normalizeWrappedRitual(nodes, filePath);
  }

  return {
    type: "ritual",
    dialect: "unknown",
    name: path.basename(filePath || "arc_document.arc", path.extname(filePath || "arc_document.arc")),
    filePath,
    meta: {},
    assets: {},
    styles: {},
    requires: [],
    steps: [],
    timeline: [],
    sequence: [],
    rawTree: nodes
  };
}

export default parseArc;
