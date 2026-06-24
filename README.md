# VietKey Shop

Ứng dụng React + Express API chạy local bằng Vite/tsx và deploy lên Vercel bằng `api/index.ts`.

## Chạy local

**Yêu cầu:** Node.js

1. Cài dependencies: `npm install`
2. Tạo `.env.local` từ `.env.example`
3. Chạy app: `npm run dev`
4. Nếu chỉ chạy frontend: `npm run dev:client`

## Deploy Vercel

### Build/runtime
- Frontend build bằng `vite build`
- API chạy qua Vercel Serverless Function tại `api/index.ts`
- `vercel.json` đã rewrite `/api/*` vào function và route còn lại về SPA `index.html`

### Biến môi trường bắt buộc
- `DATABASE_URL` hoặc `MONGODB_URI`
- `JWT_SECRET`

### Khuyến nghị
- Dùng MongoDB Atlas thay vì Mongo local
- Đặt `JWT_SECRET` đủ dài và ngẫu nhiên
- Kiểm tra health endpoint sau deploy: `/api/health`

## Các endpoint kiểm tra nhanh
- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/settings`
