import { notFound } from "next/navigation"
import AdminClient from "./AdminClient"

type PageProps = {
  searchParams: Promise<{ key?: string }>
}

export default async function AdminPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const key = sp.key

  const ADMIN_KEY = process.env.ADMIN_KEY

  // ADMIN_KEY가 설정 안 됐거나, key가 다르면 숨김
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    notFound()
  }

  return <AdminClient />
}
