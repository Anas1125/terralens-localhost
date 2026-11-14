import api from "./client";

export const getMedia = async () => {
  const response = await api.get("/media/");
  return response.data;
};

// Production (Vercel): the API hands out a one-file token and the browser
// uploads straight to Vercel Blob, so large videos are not blocked by the
// 4.5 MB serverless request limit. Local dev: falls back to a normal upload.
export const uploadFile = async (folder, file) => {
  const { data: target } = await api.post(
    `/media/upload-token/${folder}`,
    { filename: file.name, size: file.size }
  );

  if (target.mode === "direct") {
    const { put } = await import("@vercel/blob/client");

    const blob = await put(target.pathname, file, {
      access: "public",
      token: target.token,
      contentType: target.contentType,
      multipart: file.size > 20 * 1024 * 1024,
    });

    return {
      filename: file.name,
      path: blob.url,
    };
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/media/upload/${folder}`,
    formData
  );

  return response.data;
};

export const deleteMedia = async (folder, filename) => {
  const response = await api.delete(
    `/media/${folder}/${filename}`
  );

  return response.data;
};
