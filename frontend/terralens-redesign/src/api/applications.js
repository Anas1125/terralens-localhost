import api from "./client";

export const createApplication = async (formData) => {
  const { data } = await api.post(
    "/applications/",
    formData
  );

  return data;
};

export const getApplications = async () => {
  const { data } = await api.get("/applications/");
  return data;
};

export const getApplication = async (id) => {
  const { data } = await api.get(
    `/applications/${id}`
  );

  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await api.delete(
    `/applications/${id}`
  );

  return data;
};

export const downloadResume = async (id) => {
  const response = await api.get(`/applications/${id}/resume`, { responseType: "blob" });
  const disposition = response.headers["content-disposition"] || "";
  const extension = disposition.match(/resume-\d+(\.(?:pdf|png|jpg|jpeg))/i)?.[1] || "";
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resume-${id}${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
