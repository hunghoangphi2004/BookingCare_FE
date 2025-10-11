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

const API_DOMAIN = "http://localhost:3000";

export const get = async (path) => {
    const token = Cookies.get("token"); // lấy token từ cookie

    const response = await fetch(API_DOMAIN + path, {
        headers: {
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    const result = await response.json();
    return result;
};

export const post = async (path, options = {}) => {
    const token = Cookies.get("token");

    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
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
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }), 
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};
