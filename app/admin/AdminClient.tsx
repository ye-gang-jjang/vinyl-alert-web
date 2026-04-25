"use client";

import { useEffect, useState } from "react";

import { fetchNewReleases } from "@/features/releases/api/releases";
import type { Release } from "@/features/releases/types";
import { fetchStores } from "@/features/stores/api/stores";
import type { Store } from "@/features/stores/types";

import { AddListingForm } from "@/features/admin/listings/components/AddListingForm";
import { ManageReleaseListings } from "@/features/admin/listings/components/ManageReleaseListings";
import { fetchPendingCandidates } from "@/features/admin/pending/api/pendingCandidates";
import { PendingCandidateList } from "@/features/admin/pending/components/PendingCandidateList";
import type { PendingCandidate } from "@/features/admin/pending/types";
import { CreateReleaseForm } from "@/features/admin/releases/components/CreateReleaseForm";
import { CreateStoreForm } from "@/features/admin/stores/components/CreateStoreForm";
import { StoreList } from "@/features/admin/stores/components/StoreList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminClient() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState("");

  const [stores, setStores] = useState<Store[]>([]);
  const [pendingCandidates, setPendingCandidates] = useState<PendingCandidate[]>([]);
  const [pendingError, setPendingError] = useState<string | null>(null);

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

  async function refreshPendingCandidates(): Promise<void> {
    setIsLoading(true);
    setPendingError(null);

    try {
      const data = await fetchPendingCandidates();
      setPendingCandidates(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "pending 후보를 불러오지 못했습니다.";
      setPendingError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshReleases();
    refreshStores();
    refreshPendingCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">관리자</h1>
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
        <TabsList className="flex w-full flex-wrap justify-center gap-2 rounded-xl border bg-white p-1">
          <TabsTrigger value="pending" className="shrink-0">
            수집 후보
          </TabsTrigger>

          <TabsTrigger value="create" className="shrink-0">
            데이터 추가
          </TabsTrigger>

          <TabsTrigger
            value="cleanup"
            className="shrink-0 text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            수정/삭제
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
            stores={stores}
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

        <TabsContent value="pending" className="space-y-6">
          {pendingError && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              pending 후보를 불러오지 못했습니다. 백엔드 배포나 마이그레이션 상태를 확인해 주세요. ({pendingError})
            </div>
          )}

          <PendingCandidateList
            candidates={pendingCandidates}
            releases={releases}
            stores={stores}
            onChanged={refreshPendingCandidates}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>
      </Tabs>

      {status && <p className="text-sm font-medium">{status}</p>}
    </div>
  );
}
