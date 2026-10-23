function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (match[1] === "" && match[2] === "")) return null;
  if (match[1] === "") {
    const length = Math.min(Number(match[2]), size);
    return length > 0 ? { start: size - length, end: size - 1 } : null;
  }
  const start = Number(match[1]);
  const end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  return start <= end ? { start, end } : null;
}

const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request.url);
    const rangeHeader = request.headers.get("Range");
    const headers = new Headers(response.headers);
    headers.set("Accept-Ranges", "bytes");

    if (response.status !== 200 || !rangeHeader) {
      return new Response(request.method === "HEAD" ? null : response.body, { status: response.status, headers });
    }

    const data = await response.arrayBuffer();
    const range = parseRange(rangeHeader, data.byteLength);
    if (!range) {
      headers.set("Content-Range", `bytes */${data.byteLength}`);
      return new Response(null, { status: 416, headers });
    }

    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${data.byteLength}`);
    const body = request.method === "HEAD" ? null : data.slice(range.start, range.end + 1);
    return new Response(body, { status: 206, headers });
  },
};

export default worker;
