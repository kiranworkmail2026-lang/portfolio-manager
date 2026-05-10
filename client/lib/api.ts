import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector: string;
  assetType: string;
};

export type Portfolio = {
  id: string;
  userId: string;
  name: string;
  holdings: Holding[];
  uploadedAt: string;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  sourceAnalysisId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type PublicPost = {
  id: string;
  authorName: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  publishedAt?: string;
};
