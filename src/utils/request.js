// const API_DOMAIN = "http://localhost:3000";

// export const get = async (path) => {
//     const response = await fetch(API_DOMAIN + path);
//     const result = await response.json();
//     return result
// }

// export const post = async (path, options) => {
//     const response = await fetch(API_DOMAIN + path, {
//         method: "POST",
//         headers: {
//             accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(options)
//     })
//     const result = await response.json();
//     return result
// }

import Cookies from "js-cookie";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || "http://localhost:3000";

export const get = async (path) => {
  const response = await fetch(API_DOMAIN + path);
  const result = await response.json();
  return result
}

export const getInclude = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    credentials: "include",
  });
  const result = await response.json();
  return result;
};


export const post = async (path, options = {}) => {
  const token = Cookies.get("tokenUser");

  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(options),
  });

  const result = await response.json();
  return result;
};

export const put = async (path, options = {}) => {
  const token = Cookies.get("token");

  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(options),
  });

  const result = await response.json();
  return result;
};

export const patch = async (path, options = {}) => {
  const token = Cookies.get("token");

  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(options),
  });

  const result = await response.json();
  return result;
};

export const postForm = async (path, formData) => {
  const token = Cookies.get("token");

  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const putForm = async (path, formData) => {
  const token = Cookies.get("token");

  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const patchForm = async (path, formData) => {
  const token = Cookies.get("token");

  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    credentials: "include",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const deleteData = async (path) => {
  const token = Cookies.get("token");
  const response = await fetch(API_DOMAIN + path, {
    credentials: "include",
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return await response.json();
};