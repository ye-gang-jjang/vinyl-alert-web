"use client";

import { useEffect, useState } from "react";

import type { Release } from "@/lib/types";
import { fetchNewReleases, fetchStores } from "@/lib/api";
import type { Store } from "@/lib/api";

import { CreateReleaseForm } from "@/components/admin/CreateReleaseForm";
import { AddListingForm } from "@/components/admin/AddListingForm";
import { CreateStoreForm } from "@/components/admin/CreateStoreForm";
import { ManageReleaseListings } from "@/components/admin/ManageReleaseListings";
import { StoreList } from "@/components/admin/StoreList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminClient() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState("");

  const [stores, setStores] = useState<Store[]>([]);

  async function refreshReleases(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchNewReleases();
      setReleases(data);

      if (data.length === 0) {
        setSelectedReleaseId("");
      } else if (
        !selectedReleaseId ||
        !data.some((r) => r.id === selectedReleaseId)
      ) {
        setSelectedReleaseId(data[0].id);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "릴리즈 목록을 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshStores(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchStores();
      setStores(data);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "스토어 목록을 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshReleases();
    refreshStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">관리자</h1>
        <p className="text-sm text-gray-600">
          MVP 단계: 수동으로 릴리즈/판매처 정보를 등록함
        </p>
      </header>

      {isLoading && releases.length === 0 && (
        <div className="rounded-xl border p-4 text-sm text-gray-600">
          릴리즈 목록을 불러오는 중...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="flex w-full gap-2 overflow-x-auto">
          <TabsTrigger value="create" className="shrink-0">
            데이터 추가
          </TabsTrigger>

          <TabsTrigger
            value="cleanup"
            className="shrink-0 text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            삭제/정리
          </TabsTrigger>

          <TabsTrigger value="stores" className="shrink-0">
            스토어 관리
          </TabsTrigger>
        </TabsList>

        {/* 1) 데이터 추가: 릴리즈 등록 + 판매처 등록 */}
        <TabsContent value="create" className="space-y-10">
          <CreateReleaseForm
            setStatus={setStatus}
            setGlobalLoading={setIsLoading}
            onCreated={async (createdId) => {
              await refreshReleases();
              setSelectedReleaseId(createdId);
            }}
          />

          <AddListingForm
            releases={releases}
            selectedReleaseId={selectedReleaseId}
            onSelectReleaseId={setSelectedReleaseId}
            onRefreshReleases={refreshReleases}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>

        {/* 2) 삭제/정리: 판매처 삭제 + 릴리즈 삭제 */}
        <TabsContent value="cleanup" className="space-y-6">
          <ManageReleaseListings
            releases={releases}
            selectedReleaseId={selectedReleaseId}
            onSelectReleaseId={setSelectedReleaseId}
            onRefreshReleases={refreshReleases}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>

        {/* 3) 스토어 관리: 스토어 등록 + 스토어 목록 */}
        <TabsContent value="stores" className="space-y-10">
          <CreateStoreForm
            setStatus={setStatus}
            setGlobalLoading={setIsLoading}
            onCreated={refreshStores}
          />

          <StoreList
            stores={stores}
            onChanged={refreshStores}
            isLoadingGlobal={isLoading}
            setStatus={setStatus}
          />
        </TabsContent>
      </Tabs>

      {status && <p className="text-sm font-medium">{status}</p>}
    </div>
  );
}
