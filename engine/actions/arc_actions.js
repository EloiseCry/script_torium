function normalizeDuration(value, fallback = 3) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  return fallback;
}

function estimateVoiceDuration(text) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(2, words * 0.45);
}

function pushTimelineEvent(ctx, event, advanceTo = null) {
  ctx.timeline.push(event);

  if (advanceTo !== null) {
    ctx.cursor = Math.max(ctx.cursor, advanceTo);
  } else if (typeof event.start === "number" && typeof event.duration === "number") {
    ctx.cursor = Math.max(ctx.cursor, event.start + event.duration);
  }

  return event;
}

function currentStyles(ritual) {
  return { ...(ritual?.styles || {}) };
}

const actions = {
  async print(args = {}, ctx, ritual) {
    const text = String(args.text ?? args.value ?? "");
    const duration = normalizeDuration(args.duration, 3);
    const start = typeof args.start === "number" ? args.start : ctx.cursor;

    return pushTimelineEvent(
      ctx,
      {
        type: "clip",
        clipType: "text",
        value: text,
        start,
        duration,
        layer: Number(args.layer ?? 2),
        style: { ...currentStyles(ritual), ...(args.style || {}) }
      },
      start + duration
    );
  },

  async emit_text(args = {}, ctx, ritual) {
    return actions.print(args, ctx, ritual);
  },

  async log(args = {}, ctx) {
    const entry = {
      type: "log",
      level: String(args.level ?? "info"),
      text: String(args.text ?? args.message ?? ""),
      at: ctx.cursor
    };
    ctx.logs.push(entry);
    return entry;
  },

  async invoke(args = {}, ctx) {
    const invocation = {
      type: "invoke",
      name: String(args.name ?? args.target ?? "accion_sin_nombre"),
      args: { ...args },
      at: ctx.cursor
    };

    ctx.invocations.push(invocation);
    ctx.state.lastInvocation = invocation.name;
    return invocation;
  },

  async wait(args = {}, ctx) {
    const inlineValue =
      typeof args.value === "number"
        ? args.value > 20
          ? args.value / 1000
          : args.value
        : null;
    const duration = normalizeDuration(
      args.duration ??
        args.seconds ??
        (typeof args.ms === "number" ? args.ms / 1000 : null) ??
        inlineValue,
      1
    );
    ctx.cursor += duration;
    return { type: "wait", duration, at: ctx.cursor };
  },

  async emit_silence(args = {}, ctx) {
    const start = ctx.cursor;
    const duration = normalizeDuration(
      args.duration ?? (typeof args.ms === "number" ? args.ms / 1000 : null),
      1
    );

    return pushTimelineEvent(
      ctx,
      {
        type: "audio",
        clipType: "silence",
        src: null,
        start,
        duration,
        layer: Number(args.layer ?? 0)
      },
      start + duration
    );
  },

  async voice(args = {}, ctx) {
    const text = String(args.text ?? "");
    const start = typeof args.start === "number" ? args.start : ctx.cursor;
    const duration = normalizeDuration(args.duration, estimateVoiceDuration(text));

    return pushTimelineEvent(
      ctx,
      {
        kind: "voice",
        type: "voice",
        text,
        voice: String(args.voice ?? "es-MX-JorgeNeural"),
        start,
        duration,
        layer: Number(args.layer ?? 0),
        subtitles: args.subtitles !== false
      },
      start + duration
    );
  },

  async emit_voice(args = {}, ctx) {
    return actions.voice(args, ctx);
  }
};

export default actions;
