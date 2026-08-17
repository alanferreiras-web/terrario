const ALLOWED_ORIGINS = new Set([
  "https://alanferreiras-web.github.io",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

const PROJECTS = {
  "leader-assessment": {
    dataSourceId: "5afd6153-9259-41ca-8d92-6577229c8331",
    projectValue: "Leader Assessment",
  },
  iorguti: {
    dataSourceId: "5afd6153-9259-41ca-8d92-6577229c8331",
    projectValue: "Iorguti",
  },
  trendices: {
    dataSourceId: "5afd6153-9259-41ca-8d92-6577229c8331",
    projectValue: "Trendices",
  },
  kollab: {
    dataSourceId: "5afd6153-9259-41ca-8d92-6577229c8331",
    projectValue: "Kollab",
  },
};

const TASKS_DATA_SOURCE_ID = "5afd6153-9259-41ca-8d92-6577229c8331";

const STATUS_KEYS = {
  "a fazer": "todo",
  "em andamento": "doing",
  concluido: "done",
};

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  return origin && ALLOWED_ORIGINS.has(origin)
    ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
    : {};
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request),
    },
  });
}

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function readStatusName(item) {
  const properties = item.properties || {};
  const statusProperty = properties.Status
    || Object.values(properties).find(
      (property) => property?.type === "status" || property?.type === "select",
    );

  if (statusProperty?.type === "status") return statusProperty.status?.name || "";
  if (statusProperty?.type === "select") return statusProperty.select?.name || "";
  return "";
}

function readTitle(item) {
  const properties = item.properties || {};
  const titleProperty = properties.Tarefa
    || Object.values(properties).find((property) => property?.type === "title");
  return titleProperty?.title?.map((part) => part.plain_text).join("").trim() || "Tarefa sem título";
}

function readProjectName(item) {
  const projectProperty = item.properties?.Projeto;
  return projectProperty?.type === "select" ? projectProperty.select?.name || "" : "";
}

function readDeadline(item) {
  const deadlineProperty = item.properties?.Prazo;
  return deadlineProperty?.type === "date" ? deadlineProperty.date?.start?.slice(0, 10) || "" : "";
}

function dateInSaoPaulo(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function queryDataSource(dataSourceId, token, body) {
  const results = [];
  let cursor;

  do {
    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2026-03-11",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          ...body,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Notion respondeu ${response.status}`);
    }

    const page = await response.json();
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  return results;
}

async function readProjectProgress(project, token) {
  const tasks = { todo: 0, doing: 0, done: 0, none: 0 };
  const recentTasks = [];
  const items = await queryDataSource(project.dataSourceId, token, {
    filter: {
      property: "Projeto",
      select: { equals: project.projectValue },
    },
  });

  for (const item of items) {
    const statusKey = STATUS_KEYS[normalize(readStatusName(item))] || "none";
    tasks[statusKey] += 1;
    if (statusKey !== "done") {
      recentTasks.push({
        title: readTitle(item),
        status: statusKey,
        url: item.url,
      });
    }
  }

  return {
    tasks,
    recentTasks: ["doing", "todo", "none"].flatMap((status) =>
      recentTasks.filter((task) => task.status === status).slice(0, 3),
    ),
    updatedAt: new Date().toISOString(),
  };
}

async function readRadar(token) {
  const now = new Date();
  const today = dateInSaoPaulo(now);
  const tomorrow = dateInSaoPaulo(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  const items = await queryDataSource(TASKS_DATA_SOURCE_ID, token, {
    filter: {
      or: [
        { property: "Prazo", date: { equals: today } },
        { property: "Prazo", date: { equals: tomorrow } },
      ],
    },
    sorts: [{ property: "Prazo", direction: "ascending" }],
  });

  const deadlines = items
    .filter((item) => normalize(readStatusName(item)) !== "concluido")
    .map((item) => ({
      title: readTitle(item),
      project: readProjectName(item),
      due: readDeadline(item),
    }));

  return {
    today: deadlines.filter((item) => item.due === today),
    tomorrow: deadlines.filter((item) => item.due === tomorrow),
    updatedAt: new Date().toISOString(),
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          ...corsHeaders(request),
        },
      });
    }

    if (request.method !== "GET") {
      return json(request, { error: "Método não permitido" }, 405);
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json(request, {
        ok: true,
        notionConfigured: Boolean(env.NOTION_TOKEN),
      });
    }

    if (url.pathname === "/radar") {
      if (!env.NOTION_TOKEN) {
        return json(request, { error: "Integração com o Notion não configurada" }, 503);
      }

      try {
        return json(request, await readRadar(env.NOTION_TOKEN));
      } catch (error) {
        return json(request, { error: error.message }, 502);
      }
    }

    const projectMatch = url.pathname.match(/^\/projects\/([a-z0-9-]+)$/);
    const projectId = projectMatch?.[1];
    const project = projectId ? PROJECTS[projectId] : undefined;

    if (!project) {
      return json(request, { error: "Projeto não encontrado" }, 404);
    }

    if (!env.NOTION_TOKEN) {
      return json(request, { error: "Integração com o Notion não configurada" }, 503);
    }

    try {
      return json(request, await readProjectProgress(project, env.NOTION_TOKEN));
    } catch (error) {
      return json(request, { error: error.message }, 502);
    }
  },
};
