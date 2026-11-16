import axios from "axios";

const mealdbUrl = import.meta.env.VITE_MEALDB_URL;
const apiUrl = import.meta.env.VITE_API_URL;

if (!mealdbUrl || !apiUrl) {
  throw new Error("Missing API environment variables.");
}

export const mealdb = axios.create({
  baseURL: mealdbUrl,
});

export const api = axios.create({
  baseURL: apiUrl,
});