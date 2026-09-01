
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
});

// =====================================================
// AUTOMATICALLY ATTACH JWT TOKEN
// =====================================================

API.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =====================================================
// HANDLE API ERRORS
// =====================================================

API.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        console.error(
            "API Error:",
            error.response?.data ||
            error.message
        );

        if (
            error.response?.status ===
            401
        ) {
            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );
        }

        return Promise.reject(error);
    }
);

export default API;

